angular.module('readItLive', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve : {
        eventsFactory : 'eventsFactory',

        events : function(eventsFactory){
          return eventsFactory.getAll().$promise;
        }
      }
    })
    .state('newEvent', {
      url: '/newEvent',
      templateUrl: '/newEvent.html',
      controller: 'CreateEventCtrl'
    })
    .state('eventDetail', {
      url: '/event/:id',
      templateUrl: '/eventDetail.html',
      controller: 'EventDetailCtrl'
    });

  $urlRouterProvider.otherwise('home');
}])
.factory('eventsFactory',['$http',function($http){

  var obj = {
    events : [],
    getAll : function(){
      return $http.get('/events').then(function(data) {
        angular.copy(data.data, obj.events);
      },function(err) { console.log("Error"); })}
    };

    return obj;
}])
.controller('MainCtrl', ['$scope', '$state', 'eventsFactory',function($scope, $state, eventsFactory){
  $scope.events = eventsFactory.events;

}])
.controller('EventDetailCtrl',['$scope','$http', '$stateParams', function($scope, $http, $stateParams){

    $http.get('/events/'+$stateParams.id).then(function(eventObject){
        console.log("Retrieving posts for specific event", eventObject);
        $scope.posts = eventObject.data.posts;
      }, function(err) {console.log("Error in finding event", err); });

    $scope.addPost = function(){
      return $http({
        method: 'POST',
          url: "/events/"+$stateParams.id+"/post",
          data: {body : document.getElementById("text").value }
        });
    };

}])
.controller('CreateEventCtrl', ['$scope', '$http', 'eventsFactory', function($scope, $http, eventsFactory){
  $scope.events = eventsFactory.events;

  $scope.addEvent = function(){
    if(!$scope.title || $scope.title===''){return;}
    var newEvent = {
      title : $scope.title,
      link : $scope.link,
      description : $scope.description
     };
     $scope.title='';
     return $http({
          method: 'POST',
          url: "/events",
          data: newEvent
        });
  };

}]);