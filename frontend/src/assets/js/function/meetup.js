function clearError() {
  document.querySelector("small[key='topic-error']").innerHTML = "";
  document.querySelector("small[key='location-error']").innerHTML = "";
  document.querySelector("small[key='happening-error']").innerHTML = "";
}
function clearInput() {
  document.querySelector("input[name='topic']").value = "";
  document.querySelector("input[name='location']").value = "";
  document.querySelector("input[name='happeningon']").value = "";
}
function saveMeetup(event) {
  event.preventDefault();
  //@clearError
  clearError();
  //error assignment
  const topicError = document.querySelector("small[key='topic-error']");
  const locationError = document.querySelector("small[key='location-error']");
  const happeningError = document.querySelector("small[key='happening-error']");
  //load data
  const loadData = document.querySelector(".loadData");
  loadData.style.display = "block";
  //initial
  const meetup = {
    topic: document.querySelector("input[name='topic']").value,
    location: document.querySelector("input[name='location']").value,
    happeningOn: document.querySelector("input[name='happeningon']").value
  };
  //fetch
  fetch("/api/v1/meetups", {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json,application/text,*/*",
      "Content-Type": "application/json",
      Authorization: getToken(),
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(meetup)
  })
    .then(res => res.json())
    .then((data) => {
    //clear data
      clearInput();
      //hide
      loadData.style.display = "none";
      //check for errors
      if (data.errors) {
        topicError.textContent = data.errors.topic;
        locationError.textContent = data.errors.location;
        happeningError.textContent = data.errors.happeningOn;
      }
      if (data.success) {
      //
        loadData.style.display = "block";
        document.querySelector(".savedMsg").textContent = data.message;
        setTimeout(() => {
          window.location.reload(true);
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//deleteMeetup
function trashMeetup(id) {
  const loadData = document.querySelector(".loadData");
  loadData.style.display = "block";
  //delete
  fetch(`/api/v1/meetups/${id}`, {
    method: "DELETE",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: getToken(),
      "Access-Control-Allow-Origin": "*"
    }
  })
    .then(res => res.json())
    .then((result) => {
      loadData.style.display = "none";
      if (result.success) {
        window.location.reload(true);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function View(url) {
  history.pushState({ id: "Dashbboard" }, "Questioner | Dashbboard", url);
  window.location.reload(true);
  return false;
}
//@update meetup
function updateMeetup(id) {
  //@reset error
  clearError();
  //error assignment
  const topicError = document.querySelector("small[key='topic-error']");
  const locationError = document.querySelector("small[key='location-error']");
  const happeningError = document.querySelector("small[key='happening-error']");
  //load data
  const loadData = document.querySelector(".loadData");
  loadData.style.display = "block";
  //initial
  const meetup = {
    topic: document.querySelector("input[name='topic']").value,
    location: document.querySelector("input[name='location']").value,
    happeningOn: document.querySelector("input[name='happeningon']").value
  };
  //send
  fetch(`/api/v1/meetups/${id}`, {
    method: "PATCH",
    mode: "cors",
    headers: {
      Accept: "application/json,*/*",
      "Content-Type": "application/json",
      Authorization: getToken(),
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(meetup)
  })
    .then(res => res.json())
    .then((data) => {
      loadData.style.display = "none";
      if (data.errors) {
        topicError.textContent = data.errors.topic;
        locationError.textContent = data.errors.location;
        happeningError.textContent = data.errors.happeningOn;
      }
      if (data.success) {
      //
        loadData.style.display = "block";
        document.querySelector(".savedMsg").textContent = data.message;
        setTimeout(() => {
          window.location.reload(true);
        }, 3000);
      }
      if (data.error) {
        happeningError.textContent = data.error;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return false;
}
