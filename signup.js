const signupForm = document.querySelector("#signup-form");
const errorInfo = document.querySelector("#signupError");
const googleAuth = document.querySelector("#google-auth");
const passwordShow = document.querySelector(".password-show");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = signupForm["signup-username"].value;
  const signupEmail = signupForm["signup-email"].value;
  const signupPassword = signupForm["signup-password"].value;

  auth
    .createUserWithEmailAndPassword(signupEmail, signupPassword)
    .then((cred) => {
      db.collection("users")
        .doc(cred.user.uid)
        .set({
          name: username,
          data: {},
        })
        .then(() => {
          cred.user.updateProfile({
            displayName: username,
          });
        })
        .then(() => {
          console.log("database created");
          location = "app.html";
        });
    })
    .catch((err) => {
      errorInfo.textContent = err.message;
    });
});

function signInGoogle() {
  auth
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((cred) => {
      db.collection("users")
        .doc(cred.user.uid)
        .set({
          name: cred.user.displayName,
          data: {},
        })
        .then(() => {
          console.log("database created");
          location = "app.html";
        });
    })
    .catch((err) => {
      errorInfo.textContent = err.message;
    });
}

function show() {
  signupForm["signup-password"].type === "password"
    ? ((signupForm["signup-password"].type = "text"),
      (passwordShow.innerHTML = `<i class="fas fa-eye-slash"></i>`))
    : (signupForm["signup-password"].type = "password",
    passwordShow.innerHTML =`<i class="fas fa-eye"></i>`);
}

googleAuth.addEventListener("click", signInGoogle, false);
passwordShow.addEventListener("click", show, false);
