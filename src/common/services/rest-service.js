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