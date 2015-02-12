/**
 * Created by Danny Schreiber on 2/11/2015.
 */

(function(){ 'use strict';
	/*jslint smarttabs:true */
	angular.module('spoton.it').constant('Constants', {
		URLS: {
			STANFORD: 'http://events.stanford.edu/',
			EVENT_BRITE: 'https://www.eventbrite.com/',
			SFMOMA: 'http://www.sfmoma.org/',
			MEETUP: 'http://www.meetup.com/find/events/?allMeetups=true&radius=5&userFreeform=Redwood+City%2C+CA&mcId=z94061&mcName=Redwood+City%2C+CA'
		},
		MOCK_URLS: {
			STANFORD: 'src/common/data/stanford.html',
			EVENT_BRITE: 'src/common/data/eventbrite.html',
			SFMOMA: 'src/common/data/sfmoma.html',
			MEETUP: 'src/common/data/meetup.html'
		},
		EVENTS: {
			EVENT_SOURCE_CHANGED: 'eventSourceChanged'
		},
		CACHE: {
			SELECTED_EVENTS: 'selectedEvents'
		}
	});
})();