const loginForm = document.querySelector("#signin-form");
const errorInfo = document.querySelector("#loginError");
const googleAuth = document.querySelector("#google-auth");
const guestAccount = document.querySelector("#guest");
const passwordShow = document.querySelector(".password-show");

function signInGoogle() {
  auth
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(() => {
      location = "app.html";
    })
    .catch((err) => {
      console.log(err.message);
    });
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

function show() {
  loginForm["login-password"].type === "password"
    ? ((loginForm["login-password"].type = "text"),
      (passwordShow.innerHTML = `<i class="fas fa-eye-slash"></i>`))
    : ((loginForm["login-password"].type = "password"),
      (passwordShow.innerHTML = `<i class="fas fa-eye"></i>`));
}

function guestCred() {
  loginForm["login-email"].value = "admin@gmail.com";
  loginForm["login-password"].value = "admin@45";
}

googleAuth.addEventListener("click", signInGoogle, false);
guestAccount.addEventListener("click", guestCred, false);
passwordShow.addEventListener("click", show, false);
