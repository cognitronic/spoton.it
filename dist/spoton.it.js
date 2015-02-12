angular.module('spoton.it.ui', []);
angular.module('spoton.it.services', [
	'spoton.it.rest.service',
	'spoton.it.cache.service',
	'spoton.it.event-bus.service'
]);
/**
 * Created by Danny Schreiber on 2/11/2015.
 */

angular.module('spoton.it', [
	'spoton.it.ui',
	'spoton.it.services',
	'ui.router',
	'ui.bootstrap',
	'ngAnimate',
	'toaster'
])
	.config(function($httpProvider, $stateProvider, $urlRouterProvider) {
		$httpProvider.defaults.transformRequest = function (data) {
			if (data === undefined) {
				return data;
			}
			return $.param(data);
		};

		//sets the content type header globally for $http calls
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		$httpProvider.defaults.headers['delete'] = {'Content-Type': 'application/json; charset=UTF-8'};

		$urlRouterProvider.otherwise('/list');
		$stateProvider
			.state('list', {
				url: '/list',
				views: {
					'header@': {
						templateUrl: 'src/common/layout/header.html',
						controller: 'HeaderController as hc'
					},
					'main-content@': {
						templateUrl: 'src/events/list.html',
						controller: 'EventsListController as lc'
					}
				}
			})
			.state('grid', {
				url: '/grid',
				views: {
					'header@': {
						templateUrl: 'src/common/layout/header.html',
						controller: 'HeaderController as hc'
					},
					'main-content@': {
						templateUrl: 'src/events/grid.html',
						controller: 'EventsGridController as gc'
					}
				}
			});
	});
/**
 * Created by Danny Schreiber on 2/10/2015.
 */

(function(){ 'use strict';
    var ramFixContainer = function() {

	    var link = function (scope, element, attrs) {

		    function resizeContainers(containerId) {
			    var heights = $(containerId).map(function () {
					    return $(this).height();
				    }).get(),

				    maxHeight = Math.max.apply(null, heights) * 2;

			    $(containerId).height(maxHeight);
		    }
		    resizeContainers(element);
	    };
	    return {
		    restrict: 'EA',
		    link: link
	    };
    };

	angular.module('spoton.it').directive('ramFixContainer', [ramFixContainer]);

})();
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
/**
 * Created by Danny Schreiber on 2/11/2015.
 */



(function(){ 'use strict';
	/**
	 * @constructor CacheService
	 * @classdesc The cache service is a wrapper for the sessionStorage object and allows for client side state management.
	 *
	 * @returns {{setItem: _setItem, getItem: _getItem, removeItem: _removeItem, Items: {UserInfo: {orgId: string, selectedOrg: string, userOrgs: string, userData: string, userId: string, browserSupportChecked: string}, Referrals: {selectedReferral: string, selectedStatus: string}, Profile: {loadedProfile: string, allClnServices: string, allNclnServices: string}, Reports: {selectedReport: string}, Codelists: {locList: string, allLists: string, declineReasons: string}, Documents: {showAddNewReferral: string}}, clearCache: _clearCache}}
	 *
	 */
	var CacheService = function(){

		/**
		 * Inserts an item into session storage object
		 * @param {key} string name
		 * @param {val} object value that will be stringified and stored
		 * @function setItem
		 * @memberOf CacheService
		 */
		var _setItem = function(key, val) {
			sessionStorage.setItem(key, JSON.stringify(val));
		};

		/**
		 * Retrieves an item from the cache
		 * @param {item} string name of the key
		 * @function getItem
		 * @memberOf CacheService
		 */
		var _getItem = function(item) {
			if(angular.fromJson){
				return angular.fromJson(sessionStorage.getItem(item));
			}
		};

		/**
		 * Removes an item from the cache
		 *
		 * @param {item} string name of the key
		 * @function removeItem
		 * @memberOf CacheService
		 */
		var _removeItem = function(item) {
			sessionStorage.removeItem(item);
		};

		/**
		 *Clears all data from the local sessionStorage object
		 *
		 * @function clearCache
		 * @memberOf CacheService
		 */
		var _clearCache = function(){
			sessionStorage.clear();
		};



		return {
			setItem: _setItem,
			getItem: _getItem,
			removeItem: _removeItem,
			clearCache: _clearCache
		};
	};

	angular.module('spoton.it.cache.service', []).factory('CacheService', [CacheService]);
})();
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
/**
 * Created by Danny Schreiber on 2/11/2015.
 */

(function(){
	'use strict';

	/**
	 * @classdesc Rest service is a collection of utility functions that wrap the Angular $http service and make REST calls easier to work with.
	 * @constructor RestService
	 */
	var RestService = function($http, $q, $rootScope){

		/**
		 * Utility function for constructing urls
		 * @param {string} url The url with parameter placeholders
		 * @param {array} argList List of url parameters
		 * @returns {*} string Url with parameters in place
		 * @memberOf RestService
		 * @function buildUrl
		 */
		var _buildUrl = function(url, argList) {

			var finalURL = url;
			if (argList || argList == []) {
				var replaceStr = "";
				for (var i = 0; i < argList.length; i++) {
					replaceStr = "{" + i + "}";
					finalURL = finalURL.replace(replaceStr, argList[i]);
				}
			}
			return finalURL;
		};

		/**
		 * Executes a http request with the given method, URL, and parameters. If successful, it will execute the successFunction. Otherwise it will display the errorMsg and execute the errorFunction (if defined)
		 *
		 * @param {string} method Service action type
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @private
		 */
		var _executeHttpRequest = function(method, url, urlReplaceList, params, successFunction,  errorMsg, errorFunction, config) {

			if(config && config.hasOwnProperty('showLoader')){
				$rootScope.showLoader = config.showLoader;
			}
			if (urlReplaceList) {
				url = _buildUrl(url, urlReplaceList);
			}

			$http({
				method: method,
				url: url,
				params: params,
				cache: false
			})
				.success(function(data, status, headers, config) {
					$rootScope.showLoader = false;
					if (successFunction === undefined) {
						_defaultSuccessFunction(data, status, headers, config);
					}
					else {
						successFunction(data, status, headers, config);
					}
				})
				.error(function (data, status, headers, config) {
					$rootScope.showLoader = false;
					if (status !== 0){
						_processError(data, status, headers, config, errorMsg, errorFunction);
					}
				});
		};

		var _defaultSuccessFunction = function(data, status, headers, config) {
			console.log("Successfully received data, no functionality defined to proccess it. ", data);
		};

		var _processError = function(data, status, headers, config, errorMsg, errorFunction) {

			if (errorMsg) {
				AlertService.addErrorMessage(errorMsg, true);
			}

			// TODO: log error here?

			if (errorFunction)
				errorFunction(data,status,headers,config);
		};

		/**
		 *HTTP.GET
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function getData
		 */
		var _getData = function(url, urlReplaceList, params, successFunction, errorMsg, errorFunction, config) {

			_executeHttpRequest('GET', url, urlReplaceList, params, successFunction, errorMsg, errorFunction, config);
		};

		/**
		 *HTTP.PUT
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function putData
		 */
		var _putData = function(url, urlReplaceList, params, successFunction, errorMsg, errorFunction, config) {

			_executeHttpRequest('PUT', url, urlReplaceList, params, successFunction, errorMsg, errorFunction, config);
		};

		/**
		 *HTTP.DELETE
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function deleteData
		 */
		var _deleteData = function(url, urlReplaceList, params, successFunction,  errorMsg, errorFunction, config) {

			_executeHttpRequest('DELETE', url, urlReplaceList, params, successFunction,  errorMsg, errorFunction, config);
		};

		/**
		 *HTTP.PUT
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {object} data Data to be sent as the request message data
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function putPostData
		 */
		var _putPostData = function(url, urlReplaceList, params, data, successFunction,  errorMsg, errorFunction, config) {

			if(config && config.hasOwnProperty('showLoader')){
				$rootScope.showLoader = config.showLoader;
			}

			if (urlReplaceList) {
				url = _buildUrl(url, urlReplaceList);
			}

			$http({
				method: 'PUT',
				url: url,
				params: params,
				data: data,
				cache: false
			})
				.success(function(postData, status, headers, config) {
					$rootScope.showLoader = false;
					if (successFunction === undefined) {
						_defaultSuccessFunction(postData, status, headers, config);
					}
					else {
						successFunction(data, status, headers, config);
					}
				})
				.error(function (postData, status, headers, config) {
					$rootScope.showLoader = false;
					if (status !== 0){
						_processError(postData, status, headers, config, errorMsg, errorFunction);
					}
				});
		};

		/**
		 *HTTP.POST
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {array} params Map of strings or objects that will be turned into querystring parameters
		 * @param {object} data Data to be sent as the request message data
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function postData
		 */
		var _postData = function(url, urlReplaceList, params, data, successFunction,  errorMsg, errorFunction, config) {

			if(config && config.hasOwnProperty('showLoader')){
				$rootScope.showLoader = config.showLoader;
			}

			if (urlReplaceList) {
				url = _buildUrl(url, urlReplaceList);
			}

			$http({
				method: 'POST',
				url: url,
				params: params,
				data: data,
				cache: false
			})
				.success(function(postData, status, headers, config) {
					$rootScope.showLoader = false;
					if (successFunction === undefined) {
						_defaultSuccessFunction(postData, status, headers, config);
					}
					else {
						successFunction(postData, status, headers, config);
					}
				})
				.error(function (postData, status, headers, config) {
					$rootScope.showLoader = false;
					if (status !== 0){
						_processError(postData, status, headers, config, errorMsg, errorFunction);
					}
				});
		};

		/**
		 *HTTP.POST
		 *
		 * @param {string} url The URL with parameter placeholders
		 * @param {array} urlReplaceList List of URL parameters
		 * @param {object} data Data to be sent as the request message data
		 * @param {object} headers Map of strings or functions which return strings representing HTTP headers to send to the server. If the return value of a function is null, the header will not be sent
		 * @param {function} transformRequest The transform function takes the http request body and headers and returns its transformed (typically serialized) version
		 * @param {function} successFunction Success callback
		 * @param {string} errorMsg Error message passed into error callback
		 * @param {function} errorFunction Error callback
		 * @param {object} config Optional configuration options
		 * @param {boolean} config.showLoader Allows a user to toggle a loading spinner if available.
		 * @memberOf RestService
		 * @function postData
		 */
		var _postDataWithHeaders = function(url, urlReplaceList, data, headers, transformRequest, successFunction,  errorMsg, errorFunction, config) {

			if(config && config.hasOwnProperty('showLoader')){
				$rootScope.showLoader = config.showLoader;
			}

			if (urlReplaceList) {
				url = _buildUrl(url, urlReplaceList);
			}

			$http({
				method: 'POST',
				url: url,
				data: data,
				headers: headers,
				transformRequest: transformRequest
			})
				.success(function(data, status, headers, config) {
					$rootScope.showLoader = false;
					if (successFunction === undefined) {
						_defaultSuccessFunction(data, status, headers, config);
					}
					else {
						successFunction(data, status, headers, config);
					}
				})
				.error(function (data, status, headers, config) {
					$rootScope.showLoader = false;
					if (status !== 0){
						_processError(data, status, headers, config, errorMsg, errorFunction);
					}
				});
		};

		return {
			getData: _getData,
			postData: _postData,
			putData: _putData,
			deleteData: _deleteData,
			putPostData: _putPostData
		};
	};


	angular.module('spoton.it.rest.service', []).factory('RestService', ['$http', '$q','$rootScope', RestService]);
})();
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