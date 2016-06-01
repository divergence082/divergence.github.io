
var divergenceApp = angular.module('divergence', []);

divergenceApp.controller('ProfileCtrl', function($scope, $http) {
  $scope.profile = {};

  $http.get('data/profile.json')
      .success(function(data) {
        $scope.profile = data;
      });
});

divergenceApp.controller('ProjectsCtrl', function($scope, $http) {
  $scope.projects = {};

  function getProjectsNames(complete) {
    $http.get('data/projects.json').success(complete);
  }

  function getRepositories(complete) {
    $http.get('https://api.github.com/users/divergence082/repos?type=owner').success(complete);
  }

  function filterTechnology(name, lang) {
    var tech = lang.toLowerCase();
    var projectName = name.toLowerCase();

    if (projectName.indexOf('node') !== -1 && tech === 'javascript' ||
        projectName === 'http.io') {
      return 'node';
    } else if (projectName.indexOf('docker') !== -1) {
      return 'docker';
    } else if (projectName.indexOf('gulp') !== -1) {
      return 'gulp';
    } else {
        return tech;
    }
  }

  function filterRepos(repos, names) {
    var projects = [];

    console.log(repos);
    for (var i = 0; i < repos.length; i++) {
      var repo = repos[i];
      var repoName = repo['name'] || '';

      if (names.indexOf(repoName) !== -1) {
        projects.push({
          'name': repoName,
          'html_url': repo['html_url'],
          'description': repo['description'],
          'technology': filterTechnology(repoName, repo['language'])
        })
      }
    }

    console.log(projects);
    return projects;
  }

  getProjectsNames(function(projectNames) {
    getRepositories(function(repos) {
      $scope.projects = filterRepos(repos, projectNames);
    });
  });
});