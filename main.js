const loginForm = document.querySelector("#signin-form")
const errorInfo = document.querySelector("#loginError")

loginForm.addEventListener("submit", e=>{
    e.preventDefault();
    const loginEmail = loginForm['login-email'].value;
    const loginPassword = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(loginEmail, loginPassword)
    .then(()=>{
        console.log("login-sucess")
        location="app.html"
    })
    .catch((err)=>{
        loginError.textContent = err.message
        // alert(err.message)
    })
})


