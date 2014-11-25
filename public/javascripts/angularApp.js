angular.module('readItLive', ['ui.router'])
.config([
 '$stateProvider',
 '$urlRouterProvider',
 function($stateProvider, $urlRouterProvider){

 	 $stateProvider
 	 		.state('home', {
 	 			url : '/home',
 	 			templateUrl : '/home.html',
 	 			controller : 'MainCtrl'
 	 		})
      .state('events', {
        url: '/events',
        templateUrl : '/events.html',
        conroller : 'EventsCtrl'
      });

 	 	$urlRouterProvider.otherwise('home');
 }])

.factory('eventsFactory',[function(){
	return {
		events : [{'title' : 'Chess Olympiad', 'link' : 'www.google.com'},
    {'title' : 'Blitz Games', 'link' : 'www.google.com'},
    {'title' : 'Immortal Events', 'link' : 'www.google.com'} ]
	};

}])

.controller('EventsCtrl', ['$scope','eventsFactory', function($scope, eventsFactory){
  $scope.events = eventsFactory.events;
  $scope.str = "Neil";
  $scope.addEvent = function(){
    if(!$scope.title || $scope.title===''){return;}
    $scope.events.push({'title':$scope.title, 'link':'http://firstpost.com'});
    $scope.title='';
  };

}])
.controller('MainCtrl', ['$scope','eventsFactory', function($scope, eventsFactory){
  $scope.events = eventsFactory.events;

  $scope.addEvent = function(){
    if(!$scope.title || $scope.title===''){return;}
    $scope.events.push({'title':$scope.title, 'link':'http://firstpost.com'});
    $scope.title='';
  };

}]);