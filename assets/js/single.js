var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector('#limit-warning');

var displayWarning = function (repo) {
  //Add text to warning container
  limitWarningEl.textContent = 'To see more than 30 issues, visit ';

  //Create an <a> element to add the link to the repo issues
  var linkEl = document.createElement('a');

  //Append a link element with an href attribute that points to https://github.com/<repo>/issues
  linkEl.textContent = 'see more issues on GitHub.com';
  linkEl.setAttribute('href', 'https://github.com/' + repo + '/issues');
  linkEl.setAttribute('target', '_blank');

  //Append your link to the warning container
  limitWarningEl.appendChild(linkEl);
}


var getRepoIssues = function (user_repo) {
  //Option to append ?direction=asc to the end of the query URL to specify the sort order to return older issues first.
  var apiUrl = "https://api.github.com/repos/" + user_repo + "/issues?direction=asc";
  fetch(apiUrl)
    .then(function (response) {
      //Request was successful
      if (response.ok) {
        response.json()
          .then(function (data) {
            //Check if API has paginated issues (more than 30 issues)
            if (response.headers.get('Link')) {
              displayWarning(user_repo);
              //console.log('repo has more than 30 issues')
            }

            //Pass response data to DOM function
            displayIssues(data);
            console.log(data);


          })
      } else {
        alert('There was a problem with your request');
      }
    })
  //console.log(user_repo);
}

var displayIssues = function (issues) {
  //Check for no issues and display a message
  if (issues.length === 0) {
    issueContainerEl.textContent = 'This repo has no issues!';
    return;
  }

  for (var j = 0; j < issues.length; j++) {
    //Create a link element to take users to the issue on github
    var issueEl = document.createElement("a");
    issueEl.classList = 'list-item flex-row justify-space-between align-center';
    //Issue objects have an html_url property, which links to the full issue on GitHub
    issueEl.setAttribute('href', issues[j].html_url);
    //Added a target="_blank" attribute to each <a> element, to open the link in a new tab instead of replacing the current webpage.
    issueEl.setAttribute('target', '_blank');

    //Create span to hold the issue title ('title' is a key value pair coming from the GitHub API)
    var titleEl = document.createElement('span')
    titleEl.textContent = issues[j].title;

    //Append the <span> to the <a> element (container)
    issueEl.appendChild(titleEl)

    //Create a type element
    var typeEl = document.createElement('span');

    //Check if issue is an actual issue or a pull request
    if (issues[j].pull_request) {
      typeEl.textContent = '(Pull request)';
    } else {
      typeEl.textContent = '(Issue)';
    }

    //Append to container <a>
    issueEl.append(typeEl);

    //Append to the main issues container <div id="issues-container">
    issueContainerEl.appendChild(issueEl);
  }
}

getRepoIssues('facebook/react');
//getRepoIssues('alexJCturbo/git-it-done');

//facebook/react, expressjs/express, angular/angular, alexJCturbo/taskmaster, alexJCturbo/git-it-done