var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector('#language-buttons');


var getFeaturedRepos = function (language) {
  //variable with an API endpoint for the selected language
  var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';
  fetch(apiUrl).then(function (res) {
    if (res.ok) {
      res.json().then(function (data) {
        displayRepos(data.items, language);
        //console.log(data)
      })
    } else {
      alert('Error: GitHub user not found')
    }
  })
}



var buttonClickHandler = function (event) {
  //The browser's event object will have a target property to identify which HTML element was interacted with to create the event
  var language = event.target.getAttribute('data-language');
  //console.log(language);

  if (language) {
    getFeaturedRepos(language);
    //Clear old content
    repoContainerEl.textContent = "";
  }
}


var formSubmitHandler = function (event) {
  //event.preventDefault() stops the browser from performing the default action the event wants it to do. In the case of submitting a form, it prevents the browser from sending the form's input data to a URL.
  event.preventDefault();
  //console.log(event);

  //Get value from input element
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


var getUserRepos = function (user) {
  //Format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos"

  //Make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      //check if it was a successful request by using the ok property
      if (response.ok) {
        response.json()
          //The json() method returns another Promise, hence the extra then() method, whose callback function captures the actual data.
          .then(function (data) {
            displayRepos(data, user);
            //console.log(data)
          });
      } else {
        //If the ok property bundled to the response is false, then something is wrong
        alert('Error: GitHub User Not Found')
      }
    })
    .catch(function (error) {
      alert("Unable to connect to GitHub");
    });
};


var displayRepos = function (repos, searchTerm) {
  //In the case user has no repositories
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.'
    return;
  }
  //Clear out the old content before displaying new content.
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
  // console.log(repos);
  // console.log(searchTerm);
}

languageButtonsEl.addEventListener('click', buttonClickHandler);
userFormEl.addEventListener('submit', formSubmitHandler);