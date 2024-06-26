
// const uploadToS3 = require('../../services/S3services').uploadToS3;
// const AWS=require('aws-sdk');
// import AWS from 'aws-sdk';

// const { response } = require("express");

// const { response } = require("express");

// $(document).ready(function () {
//   $(".attach_btn").click(function () {
//     $('#fileInput').trigger('click');
//   });
// });



// AWS.config.update({
//   accessKeyId: 'YOUR_ACCESS_KEY',
//   secretAccessKey: 'YOUR_SECRET_KEY',
//    region: 'YOUR_REGION'
// });

// document.addEventListener("DOMContentLoaded",()=>{


const messageTextArea = document.getElementById("messageTextArea");
const messageSendBtn = document.getElementById("messageSendBtn");
const chatBoxBody = document.getElementById("chatBoxBody");
const uiGroup = document.getElementById("groups");
const groupNameHeading = document.getElementById("groupNameHeading");
const socket = io("http://localhost:5000");
socket.on("data", (data) => {
  console.log(data);
});


async function activeGroup(e) {
  console.log("in active group ");
  chatBoxBody.innerHTML = "";
  localStorage.setItem("chats", JSON.stringify([]));
  groupNameHeading.innerHTML = "";
  const activeLi = document.getElementsByClassName("active");
  if (activeLi.length != 0) {
    activeLi[0].removeAttribute("class", "active");
  }
  let li = e.target;
  while (li.tagName !== "LI") {
    li = li.parentElement;
  }
  li.setAttribute("class", "active");
  const groupName = li.querySelector("span").textContent;
  localStorage.setItem("groupName", groupName);
  const span = document.createElement("span");
  span.appendChild(document.createTextNode(groupName));
  groupNameHeading.appendChild(span);
  getMessages();
}
// $(document).ready(function () {
//   $('#fileInput').change(function(e) {
//     var file = e.target.files[0];
//     messageSend(file);
//     console.log("select the fuile ",file)
//   });
// // });
// let fileUrl='';
document.querySelector('.attach_btn').addEventListener('click', function() {
  document.querySelector('#fileInput').click();
});

document.querySelector('#fileInput').addEventListener('change', async function() {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.userId;
  console.log("userid:",userId);
  const groupName = localStorage.getItem("groupName");
  if (!groupName || groupName == "") {
    return alert("Select group to send the image");
  }
  const file = this.files[0];
  console.log("file:",file);
  
  const formData=new FormData();
  formData.append('file',file);
  formData.append('userId',userId);
  formData.append('groupName',groupName);
  // console.log(file.name);

  try{
  const response=await axios.post('http://localhost:4000/chat/sendFile/',formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
     Authorization: `Bearer ${token}` ,
    },
    
  });
  console.log("post sendfile res:",response);
  fileUrl=response.data.fileUrl;
  console.log(fileUrl);
  // messageSend(fileUrl);
  getMessages(fileUrl);
}catch(error){
  console.error(error);
}
  
});
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'SPAN' && e.target.dataset.fileUrl) {
    window.location.href = e.target.dataset.fileUrl;
  }
});
async function messageSend() {
  try {
    if (chatBoxBody.querySelector(".groupMembersDiv")) {
      const members = chatBoxBody.querySelectorAll(".groupMembersDiv");
      members.forEach((member) => {
        member.remove();
      });
    }
    // console.log("in chat.js mesagesnd fileurl:",fileUrl);
    const message = messageTextArea.value;
 
  
    // formData.append("description",description);

    const token = localStorage.getItem("token");
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };
    
    const groupName = localStorage.getItem("groupName");
    if (!groupName || groupName == "") {
      return alert("Select group to send the message");
    }
    const formData=new FormData()
    // formData.append("image",file);
    formData.append("message", message);
formData.append("groupName", groupName);
const response=await axios.get(`http://localhost:4000/chat/getMessages?groupName=${groupName}&param=0`,
{ headers: { Authorization: token }} 
);
const messages=response.data;
console.log("mesage snd get :",response.data);


  const res = await axios.post(
        `http://localhost:4000/chat/sendMessage/`,
        
        {
          message: message,
          // fileUrl: fileUrl,
          // fileUrl: fileUrl,
          groupName: groupName,
        },
        { headers: { Authorization: token } }
      );
      console.log("post messagesend",res);
  // const messageContent = message;
  // console.log("in else block ",message);
  // await sendMessage(messageContent);
// }
messageTextArea.value = "";
getMessages();





  } catch (error) {
    console.log("something went wrong:",error);
  }
}




async function getMessages() {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.userId;
  const groupName = localStorage.getItem("groupName");

  socket.emit("getMessages", groupName);

  socket.on("messages", (messages) => {
    console.log("messages in socekt:", messages);
    chatBoxBody.innerHTML = "";
    messages.forEach((message) => {
      const div = document.createElement("div");
      chatBoxBody.appendChild(div);

      const messageSendby = document.createElement("span");
      messageSendby.classList.add(
        "d-flex",
        "justify-content-" + (message.userId == userId? "end" : "start"),
        "px-3",
        "mb-1",
        "text-uppercase",
        "small",
        "text-white"
      );
      messageSendby.appendChild(
        document.createTextNode(message.userId == userId? "You" : message.name)
      );
      div.appendChild(messageSendby);

      const messageBox = document.createElement("div");
      const messageText = document.createElement("div");

      messageBox.classList.add(
        "d-flex",
        "justify-content-" + (message.userId == userId? "end" : "start"),
        "mb-4"
      );
      div.appendChild(messageBox);

      messageText.classList.add(
        message.userId == userId? "msg_cotainer_send" : "msg_cotainer"
      );

      if (message.Files && message.Files.length > 0) {
        const file = message.Files[0];
        const fileName = file.name;
        const s3Url = file.s3Url;

        const link = document.createElement("a");
        link.href = s3Url;
        link.target = "_blank";
        link.textContent = `Download ${fileName}`;
        link.rel = "noopener noreferrer";
        messageText.appendChild(link);
      } else {
        messageText.appendChild(document.createTextNode(message.message));
      }

      messageBox.appendChild(messageText);
      div.appendChild(messageBox);
    });
  });
}
function decodeToken(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
// async function getMessages() {
//   const token = localStorage.getItem("token");
//   const decodedToken = decodeToken(token);
//   const userId = decodedToken.userId;
//   const groupName = localStorage.getItem("groupName");

//   socket.emit("getMessages", groupName);

//   socket.on("messages", (messages) => {
//     console.log("messages in socekt:",messages);
//     chatBoxBody.innerHTML = "";
//     messages.forEach((message) => {
//       if (message.userId == userId) {
//         // if (message.message.trim()!== "") {}//new changes

        
//         const div = document.createElement("div");
//         chatBoxBody.appendChild(div);

//         const messageSendby = document.createElement("span");
//         messageSendby.classList.add(
//           "d-flex",
//           "justify-content-end",
//           "px-3",
//           "mb-1",
//           "text-uppercase",
//           "small",
//           "text-white"
//         );
//         messageSendby.appendChild(document.createTextNode("You"));
//         div.appendChild(messageSendby);

//         const messageBox = document.createElement("div");
//         const messageText = document.createElement("div");

//         messageBox.classList.add("d-flex", "justify-content-end", "mb-4");
//         div.appendChild(messageBox); //did change
        
//         messageText.classList.add("msg_cotainer_send");

//         //  console.log("in getmessages:",message);
//         if (message.Files && message.Files.length>0) { // Check if fileUrl is present
         
//           const file = message.Files[0];
//           const fileName = file.name;
//           const s3Url = file.s3Url;

//           const link = document.createElement("a");
//           link.href = s3Url;
//           link.target = "_blank";
          
//       link.textContent = `Download ${fileName}`; // Open in new tab
//           link.rel = "noopener noreferrer"; // Security attributes
//           // link.appendChild(document.createTextNode("Download File")); // You can customize the text
//           // messageText.appendChild(link);
//           // const messageText = document.createElement("div");
//           messageText.appendChild(link);
    
//           chatBoxBody.appendChild(messageText);
       
//         } else {
//           messageText.appendChild(document.createTextNode(message.message));
//         }
//         messageText.classList.add("msg_cotainer_send");
//         // messageText.appendChild(document.createTextNode(message.message));

//         messageBox.appendChild(messageText);
//         div.appendChild(messageBox);
//       } else {
//         const div = document.createElement("div");
//         chatBoxBody.appendChild(div);

//         const messageSendby = document.createElement("span");
//         messageSendby.classList.add(
//           "d-flex",
//           "justify-content-start",
//           "px-3",
//           "mb-1",
//           "text-uppercase",
//           "small",
//           "text-white"
//         );
//         messageSendby.appendChild(document.createTextNode(message.name));
//         div.appendChild(messageSendby);

//         const messageBox = document.createElement("div");
//         const messageText = document.createElement("div");

//         messageBox.classList.add("d-flex", "justify-content-start", "mb-4");

//         messageText.classList.add("msg_cotainer");
//         messageText.appendChild(document.createTextNode(message.message));

//         messageBox.appendChild(messageText);
//         div.appendChild(messageBox);
//       }
//     });
//   });
// }
// async function getMessages() {
//   try {
//     const groupName = localStorage.getItem("groupName");
//     if (!groupName || groupName == "") {
//       return alert("Select group to get the message");
//     }
//     let param;
//     const localStorageChats = JSON.parse(localStorage.getItem("chats"));
//     if (localStorageChats && localStorageChats.length !== 0) {
//       let array = JSON.parse(localStorage.getItem("chats"));
//       let length = JSON.parse(localStorage.getItem("chats")).length;
//       param = array[length - 1].id;
//     } else {
//       param = 0;
//     }
//     const res = await axios.get(
//       `http://localhost:4000/chat/getMessages?param=${param}&groupName=${groupName}`
//     );
//     const token = localStorage.getItem("token");
//     const decodedToken = decodeToken(token);
//     const userId = decodedToken.userId;
//     // chatBoxBody.innerHTML = "";
//     const chats = JSON.parse(localStorage.getItem("chats"));
//     if (!chats) {
//       localStorage.setItem("chats", JSON.stringify(res.data.messages));
//     } else {
//       res.data.messages.forEach((message) => {
//         chats.push(message);
//       });
//       localStorage.setItem("chats", JSON.stringify(chats));
//     }
//     res.data.messages.forEach((message) => {
//       if (message.userId == userId) {
//         const div = document.createElement("div");
//         chatBoxBody.appendChild(div);

//         const messageSendby = document.createElement("span");
//         messageSendby.classList.add(
//           "d-flex",
//           "justify-content-end",
//           "px-3",
//           "mb-1",
//           "text-uppercase",
//           "small",
//           "text-white"
//         );
//         messageSendby.appendChild(document.createTextNode("You"));
//         div.appendChild(messageSendby);

//         const messageBox = document.createElement("div");
//         const messageText = document.createElement("div");

//         messageBox.classList.add("d-flex", "justify-content-end", "mb-4");

//         messageText.classList.add("msg_cotainer_send");
//         messageText.appendChild(document.createTextNode(message.message));

//         messageBox.appendChild(messageText);
//         div.appendChild(messageBox);
//       } else {
//         const div = document.createElement("div");
//         chatBoxBody.appendChild(div);

//         const messageSendby = document.createElement("span");
//         messageSendby.classList.add(
//           "d-flex",
//           "justify-content-start",
//           "px-3",
//           "mb-1",
//           "text-uppercase",
//           "small",
//           "text-white"
//         );
//         messageSendby.appendChild(document.createTextNode(message.name));
//         div.appendChild(messageSendby);

//         const messageBox = document.createElement("div");
//         const messageText = document.createElement("div");

//         messageBox.classList.add("d-flex", "justify-content-start", "mb-4");

//         messageText.classList.add("msg_cotainer");
//         messageText.appendChild(document.createTextNode(message.message));

//         messageBox.appendChild(messageText);
//         div.appendChild(messageBox);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

messageSendBtn.addEventListener("click", messageSend);
// document.addEventListener("DOMContentLoaded", getMessagesFromLocalStorage);
uiGroup.addEventListener("click", activeGroup);
document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("groupName", "");
  localStorage.setItem("chats", JSON.stringify([]));
});

// });
// async function messageSend() {
//   try {
//     if (chatBoxBody.querySelector(".groupMembersDiv")) {
//       const members = chatBoxBody.querySelectorAll(".groupMembersDiv");
//       members.forEach((member) => {
//         member.remove();
//       });
//     }
//     const message = messageTextArea.value;
//     const file = $('#fileInput')[0].files[0];
//     const token = localStorage.getItem("token");
//     const groupName = localStorage.getItem("groupName");
//     if (!groupName || groupName == "") {
//       return alert("Select group to send the message");
//     }

//     // Upload the file to AWS S3
//     const s3 = new AWS.S3({
//       accessKeyId: 'YOUR_ACCESS_KEY',
//       secretAccessKey: 'YOUR_SECRET_KEY',
//       region: 'YOUR_REGION'
//     });
//     const params = {
//       Bucket: 'YOUR_BUCKET_NAME',
//       Key: file.name,
//       Body: file,
//       ContentType: file.type,
//       ACL: 'public-read'
//     };
//     const data = await s3.upload(params).promise();
//     const s3Url = data.Location;

//     // Send the message to the server with the S3 URL
//     const res = await axios.post(
//       `http://localhost:4000/chat/sendMessage/`,
//       {
//         message: message,
//         groupName: groupName,
//         fileUrl: s3Url
//       },
//       { headers: { Authorization: token } }
//     );
//     messageTextArea.value = "";
//     getMessages();
//   } catch (error) {
//     console.log("something went wrong");
//   }
// }
