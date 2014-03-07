/*global angular, CacheHandlerProvider*/

/**
    The wt-core module provides basic functionality present in most applications.
    
    @module Core
**/
var wtCore = angular.module('wt-core', []).config(function ($provide) {
    'use strict';
   
    // set default caching provider
    var cacheHandlerProvider = $provide.provider("cacheHandler", CacheHandlerProvider);
    
    cacheHandlerProvider.setProvider('localStorageProxy');
    
});
/*global wtCore*/

/**
    The authentication service is a client proxy to the server authentication mechanism.

    @class authentication
**/
wtCore.service('authentication', ['$rootScope', '$http', '$q', 'wtCoreConfig', function ($rootScope, $http, $q, config) {
    'use strict';
    
    this.sessionId = '';
    
//    this.authenticate = function (login, password) {
//        var defer = $q.defer();
//        
//        function onSuccess(result) {
//            sessionId = result.sessionId;
//            defer.resolve(sessionId);
//        }
//        
//        function onError(error) {
//            defer.reject(error);
//            $rootScope.$on('UNAUTHORIZED', error);
//        }
//        
//        $http.post(config.authentication.url, {email: login, password: password}).success(onSuccess).error(onError);
//        
//        return defer.promise;
//    };
//    
//    this.getSessionId = function () {
//        return sessionId;
//    };
//    
//    this.setSessionId = function () {
//        return sessionId;
//    };
    
}]);
/*global wtCore*/

wtCore.service('bootstrapper', ['$q', function ($q) {
    'use strict';
    
    var steps = {};
    
    this.setDependency = function (step, dependencyFunction) {
        var defer = $q.defer(),
            processed = false;
        
        if (!steps[step]) {
            defer = $q.defer();
            steps[step] = {defer: defer, resolved: processed};
        } else {
            defer = steps[step].defer;
        }
        
        if (dependencyFunction && !steps[step].resolved) {
            dependencyFunction();
        }
        
        return defer.promise;
    };
    
    this.resolve = function (step) {
        angular.forEach(steps, function (value, key) {
            if (key === step) {
                value.resolved = true;
                value.defer.resolve();
            }
        });
    };
    
}]);
/*global angular*/

/**
    The 'CacheHandlerProvider' service provides mechanism to cache data and reduce requests roundtrips.

    @class httpProxy
    @constructor
**/
function CacheHandlerProvider() {
    'use strict';
    
    var cacheProviderName,
        cacheRules = [];
    
    /**
        Define which provider will be used to cache data. Should implement get and add methods
    
        @method setProvider
        @param {String} providerName Name of the provider.
    **/
    this.setProvider = function (providerName) {
        cacheProviderName = providerName;
    };
    
    /**
        Define set of rules that will determine the cache expiration time.
    
        Expiration in minutes 
        [ 
            { 
                key: 'value1', 
                expiration: 5 
            }, 
            { 
                key: 'value2',
                expiration: 10
            }
        ]
    
        @method setCacheRules
        @param {Object} rules Object containing expiration times for different request.
    **/
    this.setCacheRules = function (rules) {
        cacheRules = rules;
    };
    
    this.$get = ['$injector', '$cacheFactory', '$timeout', '$q', 'jsonFormatter', function ($injector, $cacheFactory, $timeout, $q, jsonFormatter) {
        
        var requestsQueue = $cacheFactory('CACHED_REQUESTS'),
            cacheProvider = $injector.get(cacheProviderName),
            self = this,
            rule,
            now,
            i;
        
        /**
            Get the cached data considering its expiration time.
        
            @method setCacheRules
            @param {Object} key Value that uniquely identifies the data stored.
            @param {Object} data Object that represents the cached data.
        **/
        self.filterData = function (key, data) {
            
            if (data && data.TIMESTAMP && cacheRules.length > 0) {
                
                now = new Date().getTime();
                
                for (i = 0; i < cacheRules.length; i += 1) {
                    rule = cacheRules[i];
                    
                    if (rule.key.indexOf(key) >= 0) {
                        if (now - data.TIMESTAMP > rule.expiration) {
                            return null;
                        } else {
                            break;
                        }
                    }
                }
            }
            
            return data;
        };
        
        return {
            
            /**
                Enqueue each request to be resolved asynchronously.
            
                @method enqueueRequest
                @param {Object} options Configuration object used to generate the request.
                @param {Object} updateCache Update cache after data is retrieved.
            **/
            enqueueRequest: function (options, updateCache) {
                var defer = $q.defer();
                
                requestsQueue.put(jsonFormatter.wrap(options), {defer: defer, updateCache: updateCache});
                
                return defer.promise;
            },
            
            /**
                Dequeue resolved/rejected requests.
            
                @method dequeueRequest
                @param {boolean} success True for resolved promise or false for rejected promise.
                @param {Object} promiseResult Object that represents the cached data.
                @param {Object} options Configuration object used to generate the request.
            **/
            dequeueRequest: function (success, promiseResult, options) {
                var request = requestsQueue.get(jsonFormatter.wrap(options)),
                    cachedData = this.getCachedData(options);
                
                if (request) {
                    if (success) {
                        request.defer.resolve(promiseResult);
                    } else {
                        request.defer.reject(promiseResult);
                    }
                    
                    // clean up queue
                    requestsQueue.remove(jsonFormatter.wrap(options));
                }
            },
            
            /**
                Add data to the cache.
            
                @method cacheData
                @param {Object} cacheKey Value that uniquely identifies the data stored.
                @param {Object} data Object that represents the cached data.
            **/
            cacheData: function (cacheKey, data) {
                var request = requestsQueue.get(cacheKey);
                
                if (request && request.updateCache) {
                    data.TIMESTAMP = new Date().getTime();
                    
                    cacheProvider.add(cacheKey, data);
                }
            },
            
            /**
                Get data from the cache.
            
                @method getCachedData
                @param {Object} cacheKey Value that uniquely identifies the data stored.
            **/
            getCachedData: function (cacheKey) {
                var cachedData = cacheProvider.get(cacheKey);
                
                return self.filterData(cacheKey, cachedData);
            }
        };
        
    }];
    
}
/*global wtCore*/

/**
    The eventHub service logs and broadcasts all events used throughout the application.
    
    @class eventHub
**/
wtCore.service('eventHub', ['$rootScope', '$log', 'jsonFormatter', function ($rootScope, $log, jsonFormatter) {
    'use strict';
    
    this.fire = function (eventName, params) {
        var paramsMessage = '';
        
        if (arguments.length === 1) {
            paramsMessage = ' with no arguments';
        } else {
            paramsMessage = ' with arguments ' + jsonFormatter.wrap(Array.prototype.slice.call(arguments, 1));
        }
        
        $log.debug('[EVENT] - Calling event [' + eventName + ']' + paramsMessage);
        
        $rootScope.$broadcast.apply($rootScope, arguments);
    };
    
}]);
/*global wtCore*/

/**
    The '$exceptionHandler' service overrides the default Angular's exception handler behaviour.
    This service is purposely named with the same name as the Angular's exception handler service (ng.$exceptionHandler) which allows the default service behaviour to be extended.

    @class exceptionHandler
**/
wtCore.factory('$exceptionHandler', ['$injector', function ($injector) {
    'use strict';
    
    return function (exception, cause) {
        
        var $log = $injector.get('$log'),
            eventHub = $injector.get('eventHub');
        
        $log.error(exception.message);
        eventHub.fire('APPLICATION_ERROR', exception.message);
    };
}]);

/*global wtCore*/

/**
    The 'httpProxy' service provides operations to access resources using the http protocol.

    @class httpProxy
**/
wtCore.service('httpProxy', ['$http', '$timeout', 'cacheHandler', 'jsonFormatter', function ($http, $timeout, cacheHandler, jsonFormatter) {
    'use strict';
    
    /**
        Convert the http request options to a string representation to be used as a unique identifier (except for the same requests) in the cache key.
    
        @method buildKey
        @private
        @param {Object} config Request configuration.
    **/
    function buildKey(config) {
        
        if (!config.data) {
            config.data = '';
        }
            
        var token = config.url + jsonFormatter.wrap(config.data);
        return token;
    }
    
    /**
        Create a new object based on parameters returned by the response.
    
        @method packResponse
        @private
        @param {Object} data Response body.
        @param {Number} status Http status code of the response.
        @param {Object} headers Header getter function.
        @param {Object} config Configuration object used to generate the request.
    **/
    function packResponse(data, status, headers, config) {
        return {
            data: data,
            status: status,
            headers: headers,
            config: config
        };
    }
    
    /**
        Success callback associated with the request. It caches response data if indicated to do so in the request config options.
    
        @method onSuccess
        @private
        @param {Object} data Response body.
        @param {Number} status Http status code of the response.
        @param {Object} headers Header getter function.
        @param {Object} config Configuration object used to generate the request.
    **/
    function onSuccess(data, status, headers, config) {
        cacheHandler.cacheData(buildKey(config), data);
        
        cacheHandler.dequeueRequest(true, packResponse(data, status, headers, config), buildKey(config));
    }
    
    /**
        Error callback associated with the request
    
        @method onError
        @private
        @param {Object} data Response body.
        @param {Number} status Http status code of the response.
        @param {Object} headers Header getter function.
        @param {Object} config Configuration object used to generate the request.
    **/
    function onError(data, status, headers, config) {
        cacheHandler.dequeueRequest(false, packResponse(data, status, headers, config), buildKey(config));
    }
    
    /**
        Execute the http request.
    
        @method hit
        @param {Object} options Configuration object used to generate the request.
        @param {boolean} forceHit Force request ignoring cached data.
        @param {boolean} updateCache Update cache after data is retrieved.
    **/
    this.hit = function (options, forceHit, updateCache) {
        
        var cachedData = cacheHandler.getCachedData(buildKey(options));
        
        //updateCache = forceHit || updateCache;
        forceHit = forceHit || !cachedData;
        
        if (forceHit) {
            $http(options).success(onSuccess).error(onError);
        } else {
            $timeout(function () {
                cacheHandler.dequeueRequest(true, packResponse(cachedData, 304, function () {}, options), buildKey(options));
            });
        }
        
        return cacheHandler.enqueueRequest(buildKey(options), updateCache);
    };
    
}]);
/*global wtCore*/
wtCore.service('invoker', ['httpProxy', 'eventHub', 'wtCoreConfig', function (httpProxy, eventHub, wtCoreConfig) {
    'use strict';
    
    function mapParameters(url, parameters) {
        var extra = [],
            param;
        
        // I first find the extras / query string parameters
//        for (param in parameters) {
//            if (url.indexOf(param) < 0) {
//                extra.push(param + '=' + parameters[param]);
//            }
//        }
        // then I generate the url, if I get a falsey value
        var result = url.replace(/:(\w+)/g, function (substring, match) {
            var routeValue = parameters[match];
            if (!routeValue) {
                //throw "missing route value for " + match + ' in "' + url + '"';
                routeValue = ':' + match;
            }
            return routeValue;
        });
        
        // if we missed a value completely, then throw again
        if (result.indexOf("/:") > 0) {
            throw "not all route values were matched";
        }
        
        // finally attach query string parameters if necessary
        return (extra.length === 0) ? result : result + "?" + extra.join("&");
    }
    
    this.invoke = function (service, action, data, successCallback, errorCallback, finallyCallback, options) {
        var parameters = wtCoreConfig[service][action],
            forceHit = false,
            updateCache = false,
            config = {
                url: parameters.url,
                method: parameters.method,
                data: data
            },
            promise,
            param;
        
        // replace route paramaters with parameters coming from post parameters
        config.url = mapParameters(config.url, data);
        
        // default value for access type
        if (!parameters.access_type) {
            parameters.access_type = 'ONLINE';
        }
        
        if (parameters.access_type === 'ONLINE') {
            forceHit = true;
        } else if (parameters.access_type === 'ONLINE_WITH_CACHE') {
            updateCache = true;
        }
        
        // cache_duration
        
        function onSuccess(result) {
            if (successCallback) {
                successCallback(result);
            }
        }
        
        function onError(error) {
            if (errorCallback) {
                errorCallback(error);
            } else {
                // default error handler
                eventHub.fire('APPLICATION_ERROR');
            }
        }
        
        function onFinally(error) {
            if (finallyCallback) {
                finallyCallback();
            } else {
                if (options && options.loaderObject && options.loaderProperty) {
                    options.loaderObject[options.loaderProperty] = false;
                }
            }
        }
        
        if (options && options.loaderObject && options.loaderProperty) {
            options.loaderObject[options.loaderProperty] = true;
        }
        
        promise = httpProxy.hit(config, forceHit, updateCache);
        promise.then(onSuccess, onError);
        promise['finally'](onFinally);
    };
}]);
/*global wtCore*/

/**
    Set of operations to manipulate json data.

    @class jsonFormatter
**/
wtCore.service('jsonFormatter', function () {
    'use strict';
    
    /**
        Validate if the data passed is a valid json.
    
        @method isJSON
        @param {String | Object} data Object to be validated.
    **/
    this.isJSON = function (data) {
        var isValid = true;
        
        if (typeof (data) !== 'object') {
            try {
                JSON.parse(data);
            } catch (e) {
                isValid = false;
            }
        }
        
        return isValid;
    };
    
    /**
        Convert data in json format to its string representation.
    
        @method wrap
        @param {String | Object} data Value to be converted.
    **/
    this.wrap = function (data) {
        return (angular.isString(data) ? data : (this.isJSON(data) ? JSON.stringify(data) : data.toString()));
    };
    
    /**
        Convert data from string format to its json representation.
    
        @method unwrap
        @param {String | Object} data Value to be converted.
    **/
    this.unwrap = function (data) {
        return (this.isJSON(data) ? JSON.parse(data) : data);
    };
    
});
/*global wtCore*/

/**
    Provide operations for the new HTML5 local storage feature.

    @class localStorageProxy
**/
wtCore.service('localStorageProxy', ['$window', 'jsonFormatter', function ($window, jsonFormatter) {
    'use strict';
    
    /**
        Clear all entries in the local storage.
    
        @method clear
    **/
    this.clear = function () {
        $window.localStorage.clear();
    };
    
    /**
        Retrieve a specific entry in the local storage.
    
        @method get
        @param {Object} key Value that uniquely identifies the data stored.
        @return {Object} Value stored in the session storage entry.
    **/
    this.get = function (key) {
        return jsonFormatter.unwrap($window.localStorage.getItem(jsonFormatter.wrap(key)));
    };
    
    /**
        Retrieve all entries in the local storage.
    
        @method getAll
        @return {Object} Object containing all the values stored in the local storage.
    **/
    this.getAll = function () {
        var i, result = {}, key;
        
        for (i = 0; i < $window.localStorage.length; i += 1) {
            key = $window.localStorage.key(i);
            
            result[key] = $window.localStorage.getItem(key);
        }
        
        return result;
    };
    
    /**
        Add an entry to the local storage.
    
        @method add
        @param {String | Object} key Value that uniquely identifies the data stored.
        @param {Object} value Object that represents the object stored.
    **/
    this.add = function (key, value) {
        $window.localStorage.setItem(jsonFormatter.wrap(key), jsonFormatter.wrap(value));
    };
    
    /**
        Remove an entry from the local storage.
    
        @method remove
        @param {String | Object} key Value that uniquely identifies the data stored.
    **/
    this.remove = function (key) {
        $window.localStorage.removeItem(jsonFormatter.wrap(key));
    };
    
    this.execute = function () {
        
    };
    
}]);
/*global wtCore*/

/**
    Provide operations for the new HTML5 session storage feature.

    @class sessionStorageProxy
**/
wtCore.service('sessionStorageProxy', ['$window', 'jsonFormatter', function ($window, jsonFormatter) {
    'use strict';
    
    /**
        Clear all entries in the session storage.
    
        @method clear
    **/
    this.clear = function () {
        $window.sessionStorage.clear();
    };
    
    /**
        Retrieve a specific entry in the session storage.
    
        @method get
        @param {Object} key Value that uniquely identifies the data stored.
        @return {Object} Value stored in the session storage entry.
    **/
    this.get = function (key) {
        return jsonFormatter.unwrap($window.sessionStorage.getItem(jsonFormatter.wrap(key)));
    };
    
    /**
        Retrieve all entries in the session storage.
    
        @method getAll
        @return {Object} Object containing all the values stored in the session storage.
    **/
    this.getAll = function () {
        var i, result = {}, key;
        
        for (i = 0; i < $window.sessionStorage.length; i += 1) {
            key = $window.sessionStorage.key(i);
            
            result[key] = $window.sessionStorage.getItem(key);
        }
        
        return result;
    };
    
    /**
        Add an entry to the session storage.
    
        @method add
        @param {String | Object} key Value that uniquely identifies the data stored.
        @param {Object} value Object that represents the object stored.
    **/
    this.add = function (key, value) {
        $window.sessionStorage.setItem(jsonFormatter.wrap(key), jsonFormatter.wrap(value));
    };
    
    /**
        Remove an entry from the session storage.
    
        @method remove
        @param {String | Object} key Value that uniquely identifies the data stored.
    **/
    this.remove = function (key) {
        $window.sessionStorage.removeItem(jsonFormatter.wrap(key));
    };
    
    this.execute = function () {
        
    };
    
}]);