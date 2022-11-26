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
      //Before we can use the data in the code, we need to format the response using the json() method to format the response as JSON. Note: sometimes a resource may return non-JSON data. In those cases a different method, like text(), would be used
      response.json()
        //The json() method returns another Promise, hence the extra then() method, whose callback function captures the actual data.
        .then(function (data) {
          console.log(data)
        })
      //console.log("inside", response);
    });
};

getUserRepos('alexJCturbo');
//console.log('outside')