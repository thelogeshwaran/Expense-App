const loginForm = document.querySelector("#signin-form");
const errorInfo = document.querySelector("#loginError");
const googleAuth = document.querySelector("#google-auth");

var provider = new firebase.auth.GoogleAuthProvider();
function signInGoogle(){
  
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    console.log(result)
  })
  .catch((err)=>{
    console.log(err.message)
  })
  }


loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const loginEmail = loginForm["login-email"].value;
  const loginPassword = loginForm["login-password"].value;
  auth
    .signInWithEmailAndPassword(loginEmail, loginPassword)
    .then(() => {
      console.log("login-sucess");
      location = "app.html";
    })
    .catch((err) => {
      loginError.textContent = err.message;
      // alert(err.message)
    });
});


googleAuth.addEventListener("click",signInGoogle,false)