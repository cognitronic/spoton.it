/**
 * Created by Danny Schreiber on 2/10/2015.
 */

(function(){ 'use strict';
    var EventsGridController = function(EventsService, Constants, EventBusService, CacheService){
	    var gc = this;
	    gc.events = [];
		gc.pageTitle = '';

	    gc.init = init;
	    gc.getEvents = getEvents;

	    init();

	    function init(){
		    var events = CacheService.getItem(Constants.CACHE.SELECTED_EVENTS);
		    if(events) {
			    gc.events = [];
			    gc.events = events;
		    } else {
			    gc.getEvents(Constants.MOCK_URLS.STANFORD);
		    }
	    }

	    function getEvents(url){
		    var events = CacheService.getItem(Constants.CACHE.SELECTED_EVENTS);
		    if(events){
			    return events;
		    } else{
			    EventsService.getEvents(url)
				    .then(function(data){
					    gc.events = [];
					    gc.events = data;
					    CacheService.setItem(Constants.CACHE.SELECTED_EVENTS, data);
				    });
		    }
	    }

	    EventBusService.sub(gc, Constants.EVENTS.EVENT_SOURCE_CHANGED, function(message){
		    CacheService.removeItem(Constants.CACHE.SELECTED_EVENTS);
		    gc.getEvents(message);
	    });
    };
	angular.module('spoton.it').controller('EventsGridController', ['EventsService', 'Constants', 'EventBusService', 'CacheService', EventsGridController]);
})();