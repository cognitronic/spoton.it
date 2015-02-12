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