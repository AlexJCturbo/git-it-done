var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function (event) {
  //event.preventDefault() stops the browser from performing the default action the event wants it to do. In the case of submitting a form, it prevents the browser from sending the form's input data to a URL, as we'll handle what happens with the form input data ourselves in JavaScript.
  event.preventDefault();
  //console.log(event);

  //Get value from input element
  //Get the value from the <input> element via the nameInputEl DOM variable and store the value in its own variable called username
  var username = nameInputEl.value.trim();

  //check that there's a value in that username variable.
  if (username) {
    getUserRepos(username);
    //clear the form
    nameInputEl.value = '';
  } else {
    alert('Please enter a GitHub username');
  }
}


//var getUserRepos = function () {
var getUserRepos = function (user) {

  //Format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos"

  //HTTP request to the GitHub API using fetch()
  //the request originated from the app, and the response came from the server.
  //fetch() method is asynchronous
  //This kind of asynchronous communication with a server is often referred to as AJAX, which stands for Asynchronous JavaScript and XML
  //fetch("https://api.github.com/users/alexJCturbo/repos")

  //Make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      //check if it was a successful request by using the ok property. When the HTTP request status code is something in the 200s, the ok property will be true.
      if (response.ok) {
        //Before we can use the data in the code, we need to format the response using the json() method to format the response as JSON. Note: sometimes a resource may return non-JSON data. In those cases a different method, like text(), would be used
        response.json()
          //The json() method returns another Promise, hence the extra then() method, whose callback function captures the actual data.
          .then(function (data) {
            displayRepos(data, user);
            //console.log(data)
          });
      } else {
        //If the ok property bundled to the response is false, we know that something is wrong with the HTTP request, so we set a custom response/alert to let the user know that their search was unsuccessful.
        alert('Error: GitHub User Not Found')
      }
      //console.log("inside", response);
    })
    .catch(function (error) {
      //Notice this `.catch()` getting chained onto the end of the `.then()` method. This the Fetch API's way of handling network errors.
      alert("Unable to connect to GitHub");
      //When we use fetch() to create a request, the request might go one of two ways: the request may find its destination URL and attempt to get the data in question, which would get returned into the .then() method; or if the request fails, that error will be sent to the .catch() method.
    });
};

var displayRepos = function (repos, searchTerm) {
  //In the case user has no repositories
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.'
    return;
  }
  //When working with an app that displays data based on user input, we should always clear out the old content before displaying new content.
  repoContainerEl.textContent = '';
  repoSearchTerm.textContent = searchTerm;

  //Loop over repo
  for (var i = 0; i < repos.length; i++) {
    //format repo name
    var repoName = repos[i].owner.login + '/' + repos[i].name

    //Create a container using an <a> element for each repo and adding the 'href' attribute
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    //Create a link for each repo
    repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

    //Create a <span> element to hold the repository name
    var titleEl = document.createElement("span");

    //Write the name of the repository into the <span> element
    titleEl.textContent = repoName;

    //Append <span> to the <div> in the container
    repoEl.append(titleEl);

    //Create a status element
    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    //Check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    //Append issues <span> element to the container
    repoEl.appendChild(statusEl);

    //Append new <div> into existing  results <div id="repos-container"> to the DOM
    repoContainerEl.appendChild(repoEl);
  }
  //In the for loop, we're taking each repository (repos[i]) and writing some of its data to the page. First we format the appearance of the name and repository name. Next we create and style a <div> element. Then we create a <span> to hold the formatted repository name. We add that to the <div> and add the entire <div> to the container we created earlier.

  console.log(repos);
  console.log(searchTerm);
}

userFormEl.addEventListener('submit', formSubmitHandler);
//getUserRepos('alexJCturbo');
//console.log('outside')