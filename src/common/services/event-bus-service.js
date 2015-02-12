/**
 * Created by Danny Schreiber on 2/12/2015.
 */

(function(){
	'use strict';
	var EventBusService = function($rootScope){
		var _destroyScope = function(scope, unsubscribe){
			$rootScope.$on('$destroy', unsubscribe);
		};

		var _pub = function(name, message){
			$rootScope.$emit(name, message);
		};

		var _sub = function(scope, name, handler){
			var unsubscribe = $rootScope.$on(name, function(event, message){
				handler(message);
			});
			_destroyScope(scope, unsubscribe);
		};

		return {
			pub: _pub,
			sub: _sub
		};
	};


	angular.module('spoton.it.event-bus.service', []).factory('EventBusService', ['$rootScope', EventBusService]);
})();