const app = angular.module('myApp', ['ui.router'])



app.controller('mainCtrl', function($scope, mainSrvc) {
    $scope.login = function() {

        mainSrvc.login().then(function(response) {
            // console.log(response);
            $scope.data = response.data
            console.log($scope.data);
            mainSrvc.getFollowers($scope.data.username).then(function(response) {
                console.log(response);
            })
        })
    }
})




app.service('mainSrvc', function($http) {
    this.login = function() {
        return $http.get('/user')
    }
    this.getFollowers = function(name) {
        return $http.get(`https://api.github.com/users/${name}/followers`)
        // return $http.get(`/api/github/following`)
    }
})


app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/')

    $stateProvider
        .state('splash', {
            url: '/',
            templateUrl: '/splash.html'
        })
        .state('profile', {
            url: '/home',
            templateUrl: '/home.html'
        })
        .state('friends', {
            url: '/friends',
            templateUrl: './friends.html'
        })
})
