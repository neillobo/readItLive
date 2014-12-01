angular.module('readItLive', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
      // resolve : {
      //   eventsFactory : 'eventsFactory',

      //   events : function(eventsFactory){
      //     return eventsFactory.getAll();
      //   }
      // }
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

      socket.emit('events:get');

      socket.on('events:list', function(eventArray){
        // angular.copy(data.data, obj.events);
          console.log("events received ", eventArray);
            obj.events = eventArray;
            obj.events.push(obj.fakeData);

      });
      }
    };
    //   return $http.get('/events').then(function(data) {
    //     angular.copy(data.data, obj.events);
    //     obj.events.push(obj.fakeData);
    //   },function(err) { console.log("Error"); })}
    // };

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
  // $scope.events = eventsFactory.events;
  // eventsFactory.getEvents();

  socket.on('info', function(data){
         console.log(data);
  });

  socket.emit('events:get');

  socket.on('events:list', function(eventArray){
    // angular.copy(data.data, obj.events);
      console.log("events received ", eventArray);
        $scope.events = eventArray;
  });

}])
.controller('EventDetailCtrl',['$scope','$http', '$stateParams', 'socket', function($scope, $http, $stateParams, socket){

    // $http.get('/events/'+$stateParams.id).then(function(eventObject){
    //     console.log("Retrieving posts for specific event", eventObject);
    //     $scope.posts = eventObject.data.posts;
    //   }, function(err) {console.log("Error in finding event", err); });

    socket.emit('posts:get',{id : $stateParams.id});

    socket.on('posts:list', function(eventObject){
      console.log("posts received ", eventObject);
        $scope.posts = eventObject.posts;
    });

    $scope.addPost = function(){
      // return $http({
      //   method: 'POST',
      //     url: "/events/"+$stateParams.id+"/post",
      //     data: {body : document.getElementById("text").value }
      //   });
      // socket.emit('post:add', {body : document.getElementById("text").value });
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
     socket.emit('events:add', newEvent);
  };

}]);