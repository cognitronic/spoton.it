/**
 * Created by dschreiber on 12/22/2014.
 */

describe('CacheService', function() {
	var cacheService;

	// Initialization of the AngularJS application before each test case
	beforeEach(module('spoton.it.cache.service'));

	// Injection of dependencies
	beforeEach(inject(function(_CacheService_) {
		cacheService = _CacheService_;
	}));

	it('should store an object in the local cache', function() {

		// create an object to test with
		var test = {
			name: 'Danny Schreiber'
		};

		//store object in cache
		cacheService.setItem('TEST', test);

		//should be set to Danny Schreiber
		expect(cacheService.getItem('TEST').name).toBe('Danny Schreiber');

		//remove object
		cacheService.removeItem('TEST');

		//should be null
		expect(cacheService.getItem('TEST')).toBeNull();
	});

});