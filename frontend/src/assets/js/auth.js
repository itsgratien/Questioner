//this function will check if user is authenticated before
function CheckAuth() {
  if (localStorage.token) {
    if (currentUser().isAdmin === true) {
      window.location = "/#/dashboard";
    } else {
      window.location = "/#/home";
    }
  }
}
//
function resetData() {
  document.querySelector("small[key='email-error']").innerHTML = "";
  document.querySelector("small[key='password-error']").innerHTML = "";
  document.querySelector("small[key='username-error']").innerHTML = "";
  document.querySelector("small[key='firstname-error']").innerHTML = "";
  document.querySelector("small[key='lastname-error']").innerHTML = "";
  document.querySelector("small[key='phone-error']").innerHTML = "";
}
function resetInput() {
  document.querySelector("input[name='firstname']").value = "";
  document.querySelector("input[name='lastname']").value = "";
  document.querySelector("input[name='username']").value = "";
  document.querySelector("input[name='phoneNumber']").value = "";
  document.querySelector("input[name='email']").value = "";
  document.querySelector("input[name='password']").value = "";
}
//
function onSubmit(e) {
  e.preventDefault();
  //check if is authenticated
  CheckAuth();
  //errors assignment
  const emailError = document.querySelector("small[key='email-error']");
  const passwordError = document.querySelector("small[key='password-error']");
  //load data
  const loadData = document.querySelector(".loadData");
  loadData.style.display = "block";
  //@value
  const user = {
    email: document.querySelector("input[type='email']").value,
    password: document.querySelector("input[type='password']").value
  };
  fetch("/api/v1/signin", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .then((data) => {
      loadData.style.display = "none";
      //check for validations errors
      if (data.errors) {
        const err = data.errors;
        emailError.textContent = err.email;
        passwordError.textContent = err.password;
      }
      //check
      if (data.error) {
        passwordError.innerHTML = data.error;
      }
      //@set token to globals so that can be called everywhere
      if (data.user.isadmin === true) {
        const token = data.token;
        //@set token to localStorage
        localStorage.setItem("token", token);
        //window.location="/#/dashboard";
        history.pushState({ id: "Dashbboard" }, "Questioner | Dashbboard", "/#/dashboard");
        window.location.reload(true);
      } else {
        const token = data.token;
        //@set token to localStorage
        localStorage.setItem("token", token);
        history.pushState({ id: "Home" }, "Questioner | Home", "/#/home");
        window.location.reload(true);
      }
      //
    })
    .catch((error) => {
      console.log(error);
    });
}
//register
function signup(e) {
  e.preventDefault();
  CheckAuth();
  //@call resetData function
  //@to reset error empty before
  resetData();
  //errors assignment
  const emailError = document.querySelector("small[key='email-error']");
  const passwordError = document.querySelector("small[key='password-error']");
  const usernameError = document.querySelector("small[key='username-error']");
  const firstnameError = document.querySelector("small[key='firstname-error']");
  const lastnameError = document.querySelector("small[key='lastname-error']");
  const phoneError = document.querySelector("small[key='phone-error']");
  //
  const loadData = document.querySelector(".loadData");
  loadData.style.display = "block";
  const data = {
    firstname: document.querySelector("input[name='firstname']").value,
    lastname: document.querySelector("input[name='lastname']").value,
    username: document.querySelector("input[name='username']").value,
    phoneNumber: document.querySelector("input[name='phoneNumber']").value,
    email: document.querySelector("input[name='email']").value,
    password: document.querySelector("input[name='password']").value
  };
  //fetch
  fetch("/api/v1/signup",{
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json, text/plain,*/*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then((result) => {
      //stop loading
      loadData.style.display = "none";
      //check for errors
      if (result.errors) {
        const err = result.errors;
        emailError.textContent = err.email;
        passwordError.textContent = err.password;
        firstnameError.textContent = err.firstname;
        lastnameError.textContent = err.lastname;
        usernameError.textContent = err.username;
        phoneError.textContent = err.phoneNumber;
      }
      //@check for email exist
      if (result.error) {
        emailError.textContent = result.error;
      }
      //@check for success
      if (result.success) {
        //@to reset error empty before
        resetInput();
        //append
        const success = document.querySelector(".success");
        success.innerHTML = `
            <div class="trans">
            <div class="image">
            <img src="/src/assets/images/icons/auth/career.svg" alt="success">
            </div>
            <div class="m">
            <h5>${result.message}. wait for short time to redirect...</h5>
            </div>
            </div>`;
        success.style = "transform:translateY(0%)";
        //redirect
        loadData.style.display = "block";
        const url = "/#/signin";
        history.pushState({ id: "Signin" }, "Questioner", url);
        setTimeout(() => {
          window.location.reload(true);
        }, 2000);
        //done
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//@lagout user
function logout(e) {
  e.preventDefault();
  //load data
  const load = document.querySelector(".loadData");
  //@remove localStorage
  localStorage.removeItem("token");
  load.style.display = "block";
  setTimeout(() => {
    history.pushState({ id: "Dashbboard" }, "Questioner | Dashbboard", "/#/");
    window.location.reload(true);
  }, 1000);
}
