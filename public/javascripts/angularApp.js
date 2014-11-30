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
.factory('eventsFactory',['$http',function($http){

  var obj = {
    events : [],
    fakeData : {'title' : 'Chess Olympics', 'link' : 'www.chess.com'},
    getAll : function(){

     //  return socket.emit('events:get', {}, function(result){
     //    if(!result){
     //      console.log("Error in retrieving events");
     //    } else {
     //      angular.copy(data.data, obj.events);
     //      obj.events.push(obj.fakeData);
     //    }
     // });
       // return socket.on('info', function(data){
       //   console.log(data);
       // });
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
  $scope.events = eventsFactory.events;

  socket.on('info', function(data){
         console.log(data);
  });

  socket.emit('events:get', {}, function(result){
      if(!result){
        console.log("Error in retrieving events");
      } else {
        console.log("Events received", result);
        angular.copy(data.data, obj.events);
        obj.events.push(obj.fakeData);
      }
   });

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