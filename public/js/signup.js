document.addEventListener('DOMContentLoaded',()=>{


    function clearFields() {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        console.log("field clear");
    }
    document.getElementById('email').addEventListener('input', () => {
        const errorMessage = document.querySelector('#signup-form p');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
    
    document.getElementById('password').addEventListener('input', () => {
        const errorMessage = document.querySelector('#signup-form p');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
    document.getElementById("btn_Login").addEventListener("click", function() {
        window.location.href = "/views/login.html";
    });
    document.getElementById('signup-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email= document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const mobileno=document.getElementById('mobilenum').value;
        console.log("name,email,password,mobileno:", { name, email, password ,mobileno});
         
        if (!name || !email || !password || !mobileno) {
            alert('Please fill out all fields');
            return;
        }
        
        try {
            const response = await axios.post('/user/signUp', { name, email, password,mobileno });
            console.log(response.data);
            alert('Sign Up Successfull!');
            clearFields();
            window.location.href = "/views/login.html";
            console.log("function");
        } catch (error) {
            console.error(error.response.data);
                    // Create an error message element
                    const errorMessage = document.createElement('p');
                    errorMessage.textContent = error.response.data.message;
                    errorMessage.style.color = 'red';
            
                    // Append the error message element to the signup form
                    document.getElementById('signup-form').appendChild(errorMessage);
                
        }
    
    });
    });