/**
 * Created by Danny Schreiber on 2/10/2015.
 */

(function(){ 'use strict';
    var EventsListController = function(EventsService, Constants, EventBusService, CacheService){
		var lc = this;
		lc.events = [];

	    lc.init = init;
		lc.getEvents = getEvents;

	    init();

	    function init(){
		    var events = CacheService.getItem(Constants.CACHE.SELECTED_EVENTS);
		    if(events) {
			    lc.events = [];
			    lc.events = events;
		    } else {
			    lc.getEvents(Constants.MOCK_URLS.STANFORD);
		    }
	    }

	    function getEvents(url){
		    var events = CacheService.getItem(Constants.CACHE.SELECTED_EVENTS);
		    if(events){
			   return events;
		    } else{
			    EventsService.getEvents(url)
				    .then(function(data){
					    lc.events = [];
					    lc.events = data;
					    CacheService.setItem(Constants.CACHE.SELECTED_EVENTS, data);
				    });
		    }
	    }

	    EventBusService.sub(lc, Constants.EVENTS.EVENT_SOURCE_CHANGED, function(message){
		    CacheService.removeItem(Constants.CACHE.SELECTED_EVENTS);
		    lc.getEvents(message);
	    });

    };
	angular.module('spoton.it').controller('EventsListController', ['EventsService', 'Constants', 'EventBusService', 'CacheService', EventsListController]);
})();