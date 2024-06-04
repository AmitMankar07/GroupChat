
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
  messageSend(fileUrl);
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
const response=await axios.get(`http://localhost:4000/chat/getMessages?groupName=${groupName}`,
{ headers: { Authorization: token }} 
);
console.log("mesage snd get :",response);
//   } else

  // if(fileUrl){
    // const fileMessage = {
    //   message: `File uploaded: ${fileUrl}`,
    //   groupName: groupName,
    // };
//     if (typeof fileUrl === 'string') {
//   const fileName = fileUrl.split('/').pop();
//   // ...
//   const link = document.createElement("a");
//   link.href = fileUrl;
//   link.target = "_blank";
//   link.rel = "noopener noreferrer";
//   link.appendChild(document.createTextNode(`Download: ${fileName}`));
//   const res = await axios.post(
//     `http://localhost:4000/chat/sendMessage/`,
    
//     {
//       message: `File uploaded: ${fileName}`,
//       // fileUrl: fileUrl,
//       fileUrl: fileUrl,
//       groupName: groupName,
//     },
//     { headers: { Authorization: token } }
//   );
//   console.log("post messagesend",res);
// } else {
//   console.error('Invalid fileUrl type:', fileUrl);
//   return;
// }
// }else {
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




    // const fileName = fileUrl.split('/').pop();
  

    // let fileUrlForLink=fileUrl;
  
    
    // const messageElement = document.createElement('div');
    // messageElement.innerHTML = `File: <a href="${fileUrl}" target="_blank">${fileName}</a>`;
    // // Add the messageElement to the chat UI
    // document.getElementById('chat-ui').appendChild(messageElement);
    

//   const messageElement = document.createElement('div');
// messageElement.innerHTML = `File: <a href="${fileUrl}" target="_blank">${fileName}</a>`;


//remove fileurl



// formData.append("imageUrl", imageUrl);


// const response = await axios.get("/chat/s3Url");
// if (response.status === 200) {
//   const { url } = response.data;
//   console.log(url);
//   const imageUrl = url.split('?')[0]
//   formData.append("imageUrl", imageUrl);

//   const fileName = "image"; // replace with the actual filename
//   // const contentType = file.type; // replace with the actual content type
//   const linkText = "file"; // use "file" as the link text
//   const link = `<a href="${imageUrl}" download="${fileName}">${linkText}</a>`;

//   // const link = document.createElement("a");
//   // link.href = `data:${contentType};base64,${btoa(imageUrl)}`;
//   // link.download = fileName;
//   // link.click();

 
//   if (file) {
//     // formData
//     const res = await axios.post(
//       `http://localhost:4000/chat/sendMessage/`,
      
//         {
//           message: linkText,
//           imageUrl: imageUrl,
//           groupName: groupName,
//         },
      
//       { headers: { Authorization: token } }
//     );
//     console.log("response messagesend: ",res);

//     const downloadLink = document.createElement("a");
//     downloadLink.href = imageUrl;
//     downloadLink.download = fileName;
//     downloadLink.click();

//      // Send the clickable link as the message to the server
//      const res2 = await axios.post(
//       `http://localhost:4000/chat/sendMessage/`,
//       {
//         message: link,
//         imageUrl: imageUrl,
//         groupName: groupName,
//       },
//       { headers: { Authorization: token } }
//     );
//     console.log("response messagesend: ", res2);

  
// } else {
//   console.error("Something went wrong:", response.statusText);
//   return; // or throw an error
// }


  } catch (error) {
    console.log("something went wrong:",error);
  }
}

// async function messageSend() {
//   try {
//     if (chatBoxBody.querySelector(".groupMembersDiv")) {
//       const members = chatBoxBody.querySelectorAll(".groupMembersDiv");
//       members.forEach((member) => {
//         member.remove();
//       });
//     }
//     const message = chatBoxBody.querySelector(".chatInput");
//     const groupName = chatBoxBody.querySelector(".groupName").textContent;
//     const formData = new FormData();
//     formData.append("groupName", groupName);
//     formData.append("message", message.value);
//     const file = chatBoxBody.querySelector("#fileInput").files[0];
//     if (file) {
//       formData.append("file", file);
//     }
//     const response = await fetch("/api/messages/send", {
//       method: "POST",
//       body: formData,
//     });
//     const result = await response.json();
//     if (result.messages) {
//       chatBoxBody.innerHTML = "";
//       renderMessages(result.messages);
//       if (result.fileUrl) {
//         const file = await FileURL.findOne({
//           where: {
//             url: result.fileUrl,
//           },
//         });
//         const chatMessage = await Chat.findOne({
//           where: {
//             message: result.messages[0].dataValues.message,
//             groupId: result.messages[0].dataValues.groupId,
//           },
//         });
//         chatMessage.setFileURL(file);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

async function getMessages() {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.userId;
  const groupName = localStorage.getItem("groupName");

  socket.emit("getMessages", groupName);

  socket.on("messages", (messages) => {
    chatBoxBody.innerHTML = "";
    messages.forEach((message) => {
      if (message.userId == userId) {
        // if (message.message.trim()!== "") {}//new changes

        
        const div = document.createElement("div");
        chatBoxBody.appendChild(div);

        const messageSendby = document.createElement("span");
        messageSendby.classList.add(
          "d-flex",
          "justify-content-end",
          "px-3",
          "mb-1",
          "text-uppercase",
          "small",
          "text-white"
        );
        messageSendby.appendChild(document.createTextNode("You"));
        div.appendChild(messageSendby);

        const messageBox = document.createElement("div");
        const messageText = document.createElement("div");

        messageBox.classList.add("d-flex", "justify-content-end", "mb-4");
      //  console.log("in getmessages:",message);
        if (message.fileUrl) { // Check if fileUrl is present
          const link = document.createElement("a");
          link.href = fileUrl;
          link.target = "_blank"; // Open in new tab
          link.rel = "noopener noreferrer"; // Security attributes
          link.appendChild(document.createTextNode("Download File")); // You can customize the text
          messageText.appendChild(link);
        } else {
          messageText.appendChild(document.createTextNode(message.message));
        }
        messageText.classList.add("msg_cotainer_send");
        // messageText.appendChild(document.createTextNode(message.message));

        messageBox.appendChild(messageText);
        div.appendChild(messageBox);
      } else {
        const div = document.createElement("div");
        chatBoxBody.appendChild(div);

        const messageSendby = document.createElement("span");
        messageSendby.classList.add(
          "d-flex",
          "justify-content-start",
          "px-3",
          "mb-1",
          "text-uppercase",
          "small",
          "text-white"
        );
        messageSendby.appendChild(document.createTextNode(message.name));
        div.appendChild(messageSendby);

        const messageBox = document.createElement("div");
        const messageText = document.createElement("div");

        messageBox.classList.add("d-flex", "justify-content-start", "mb-4");

        messageText.classList.add("msg_cotainer");
        messageText.appendChild(document.createTextNode(message.message));

        messageBox.appendChild(messageText);
        div.appendChild(messageBox);
      }
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
