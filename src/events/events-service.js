/**
 * Created by Danny Schreiber on 2/11/2015.
 */

(function(){ 'use strict';
    var EventsService = function(RestService, $q, $http, Constants){

	    var _getEvents = function(url){
		    var deferred = $q.defer();
		    $http.get(url).success(function(data){
			    deferred.resolve(_buildEventsJSON(url, data));
		    }).
			    error(function(data){
				    deferred.resolve(data);
				    console.log('oh no!!');
			    });
		    return deferred.promise;
	    };

	    var _buildEventsJSON = function(url, data){
		    switch(url){
			    case Constants.MOCK_URLS.STANFORD:
				    return _buildStanfordEvents(data);
			    case Constants.MOCK_URLS.EVENT_BRITE:
				    return _buildEventbriteEvents(data);
			    case Constants.MOCK_URLS.MEETUP:
				    return _buildMeetupEvents(data);
			    case Constants.MOCK_URLS.SFMOMA:
				    return _buildSfMomaEvents(data);
		    }
	    };

	    var _buildStanfordEvents = function(data){
		    var elements = $('<div>').html(data)[0].getElementsByClassName("postcard-link");
		    var events = [];

		    $(elements).each(function(i, element){
			    var link = $(this).attr('href');
			    var body = $(this).children('div');
			    var poster = $(body).eq(0).children("div[class='postcard-image']").children().eq(0).attr('src');
			    var title = $(body).eq(0).children("div[class='postcard-text']").children("H3").text().replace(/\r?\n|\r/g," ").replace(/\s+/g, " ");
			    var time = $(body).eq(0).children("div[class='postcard-text']").children().eq(1).children().eq(0).first().text().split(' ');
			    var dt = '';
			    var location = $(body).eq(0).children("div[class='postcard-text']").children().eq(1).text().split('\n')[1].replace(/\r?\n|\r/g," ").replace(/\s+/g, " ");

			    time.forEach(function(element){
				    dt += element.replace(/\r?\n|\r/g," ").replace(/\s+/g, " ") + ' ';
			    });
			    var event = {
				    link: Constants.URLS.STANFORD + link,
				    poster: Constants.URLS.STANFORD + poster,
				    title: title,
				    time: dt,
				    location: location
			    };
			    events.push(event);
		    });
		    return events;
	    };

	    var _buildEventbriteEvents = function(data){
		    var elements = $('<div>').html(data)[0].getElementsByClassName("event-poster");
		    var events = [];

		    $(elements).each(function(i, element) {
				var time = $(this).children().eq(1).children().eq(0).children();
			    var poster =  $(this).children().eq(1).children().eq(1).children().attr('src');
			    var title = $(this).children().eq(2).children().children().first().text().trim();
			    var link = $(this).children().eq(2).children().attr('href');
			    var location = $(this).children().eq(2).children().children().next().text().trim();

			    var dt = '';
				dt += time.eq(0).text();
			    dt += ' ' + time.eq(1).text();

			    var event = {
				    link: link,
				    poster: poster,
				    title: title,
				    time: dt,
				    location: location
			    };
			    events.push(event);
		    });

		    return events;
	    };

	    var _buildMeetupEvents = function(data){
		    var elements = $('<div>').html(data)[0].getElementsByClassName("event-listing-container-li");
		    var events = [];

		    $(elements).each(function(i, element) {
			    var time = $(this).children(0).find('time[itemprop="startDate"]').first().text();
			    var poster =  $(this).children().eq(1).children().eq(1).children().attr('src') || 'src/common/assets/images/Meetup.png';
			    var title = $(this).children(0).find('div[itemprop="location"]').siblings().first().find('span[itemprop="summary"]').text();
			    var link = $(this).children(0).find('div[itemprop="location"]').first().find('a').attr('href');
			    var location = $(this).children(0).find('div[itemprop="location"]').first().find('span[itemprop="name"]').text();

			    var dt = $(this).children(0).find('time[itemprop="startDate"]').first().attr('datetime');


			    var event = {
				    link: link,
				    poster: poster,
				    title: title,
				    time: dt + ' ' + time,
				    location: location
			    };
			    events.push(event);
		    });

		    return events;
	    };

		var _buildSfMomaEvents = function(data){
			var elements = $('<div>').html(data)[0].getElementsByClassName("mod-link");
			elements = $(elements).has('h4[class="benton"]');
			var events = [];

			$(elements).each(function(i, element) {
				var time = $(this).find('div[class="bd"] div[class="date"]').text();
				var poster = Constants.URLS.SFMOMA +  $(this).find('div[class="image-mat left"]').children().attr('src');
				var title = $(this).find('div[class="bd"] div[class="title benton"]').text();
				var link = $(this).children(0).find('div[itemprop="location"]').first().find('a').attr('href');
				var location = $(this).children("H4").text();

				var event = {
					link: link,
					poster: poster,
					title: title,
					time: time,
					location: location
				};
				events.push(event);
			});

			return events;
		};

	    return {
			getEvents: _getEvents
	    };
    };

	angular.module('spoton.it').factory('EventsService', ['RestService', '$q', '$http', 'Constants', EventsService]);
})();