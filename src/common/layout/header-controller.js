/**
 * Created by Danny Schreiber on 2/9/2015.
 */
(function(){ 'use strict';
    var HeaderController = function($state, Constants, EventsService, EventBusService){
		var hc = this;

	    hc.dropdownTitle = 'Find Events In Your Area!';

	    hc.init = init;
	    hc.showGrid = _showGrid;
	    hc.showList = _showList;
	    hc.loadEvents = _loadEvents;
	    hc.listActive = true;
	    init();
	    
	    function init(){
		    if($state.is('grid')){
			    hc.listActive = false;
		    }
	    }

	    function _showGrid(){
		    $state.go('grid');
		    hc.listActive = false;
	    }

	    function _showList(){
		    $state.go('list');
		    hc.listActive = true;
	    }

	    function _loadEvents(site){
		    hc.dropdownTitle = site;
		    switch(site){
			    case 'Eventbrite':
				    EventBusService.pub(Constants.EVENTS.EVENT_SOURCE_CHANGED, Constants.MOCK_URLS.EVENT_BRITE);
				    break;
			    case 'Stanford Events':
				    EventBusService.pub(Constants.EVENTS.EVENT_SOURCE_CHANGED, Constants.MOCK_URLS.STANFORD);
				    break;
			    case 'Meetup':
				    EventBusService.pub(Constants.EVENTS.EVENT_SOURCE_CHANGED, Constants.MOCK_URLS.MEETUP);
				    break;
			    case 'SF MOMA':
				    EventBusService.pub(Constants.EVENTS.EVENT_SOURCE_CHANGED, Constants.MOCK_URLS.SFMOMA);
				    break;

		    }
	    }
    };
	angular.module('spoton.it').controller('HeaderController', ['$state', 'Constants', 'EventsService', 'EventBusService', HeaderController]);
})();