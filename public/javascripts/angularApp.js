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
          return eventsFactory.getEvents().$promise;
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
.factory('eventsFactory',['$http','socket', function($http, socket){

  var obj = {
    events : [],
    fakeData : {'title' : 'Chess Olympics', 'link' : 'www.chess.com'},
    getEvents : function(){
     return $http.get('/events').then(function(data) {
      angular.copy(data.data, obj.events);
    },function(err) { console.log("Error"); })}
    };
    return obj;
}])
.factory('socket', function($rootScope){
  var socket = io.connect();

  return {
    on: function(eventName, callback){
      socket.on(eventName, function(){
        var args = arguments;
        $rootScope.$apply(function(){
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback){
      socket.emit(eventName, data, function(){
        var args = arguments;
        $rootScope.$apply(function(){
          if(callback){
            callback.apply(socket, args);
          }
        })
      });
    }
  };
})
.controller('MainCtrl', ['$scope', '$state', 'eventsFactory', 'socket', function($scope, $state, eventsFactory, socket){
  $scope.events = eventsFactory.events;

}])
.controller('EventDetailCtrl',['$scope','$http', '$stateParams', 'socket', function($scope, $http, $stateParams, socket){

    socket.emit('posts:get',{id : $stateParams.id});

    socket.on('posts:list', function(eventObject){
        $scope.posts = eventObject.posts;
        $scope.event= eventObject;
    });

    socket.on('posts:add', function(newPost){
      if($stateParams.id === newPost.id){
        $scope.posts.push(newPost.post);
      }
    });

    $scope.addComment = function(){
      socket.emit('comment:add', {
        id : $stateParams.id,
        post : {
          body : document.getElementById("text").value
        }
      });
      document.getElementById("text").value = "";
      // $scope.posts.push({body : document.getElementById("text").value});
    };

}]);