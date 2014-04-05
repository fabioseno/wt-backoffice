/*global angular, CacheHandlerProvider*/

/**
    The wt-core module provides basic functionality present in most applications.
    
    @name Core
**/
var wtCore = angular.module('wt-core', []).config(function ($provide, $httpProvider) {
    'use strict';
   
    // set default caching provider
    var cacheHandlerProvider = $provide.provider("cacheHandler", CacheHandlerProvider);
    
    cacheHandlerProvider.setProvider('localStorageProxy');
    
    $httpProvider.interceptors.push('authenticationInterceptor');
    $httpProvider.interceptors.push('accessDeniedInterceptor');
    
});
/*global wtCore*/

/**
    The authentication service is a client proxy to the server authentication mechanism.

    @name authentication
**/
wtCore.factory('accessDeniedInterceptor', ['$rootScope', '$q', function ($rootScope, $q) {
    'use strict';
    
    return {
        
        responseError: function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('UNAUTHORIZED', response);
            }
            
            return $q.reject(response);
        }
        
    };
    
}]);
/*global wtCore*/

/**
    The authentication service is a client proxy to the server authentication mechanism.

    @name authentication
**/
wtCore.factory('authenticationInterceptor', ['authentication', function (authentication) {
    'use strict';
    
    return {
        
        request: function (config) {
            var sessionId = authentication.sessionId;
            
            if (sessionId) {
                config.headers.SessionId = sessionId;
            }
            
            return config;
        }
        
    };
    
}]);
/*global wtCore*/

/**
    The authentication service is a client proxy to the server authentication mechanism.

    @name authentication
**/
wtCore.service('authentication', function () {
    'use strict';
    
    this.sessionId = '';
    
//    this.authenticate = function (callback) {
//        var defer = $q.defer();
//        
//        function onSuccess(result) {
//            this.sessionId = result.sessionId;
//            defer.resolve(sessionId);
//        }
//        
//        function onError(error) {
//            defer.reject(error);
//            $rootScope.$on('UNAUTHORIZED', error);
//        }
//        
//        return defer.promise;
//    };
    
});
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
 * @name CacheHandlerProvider
 * @description The 'CacheHandlerProvider' service provides mechanism to cache data and reduce requests roundtrips.
 *
**/
function CacheHandlerProvider() {
    'use strict';
    
    var cacheProviderName,
        cacheRules = [];
    
    /**
        @name setProvider
        @description Define which provider will be used to cache data. Should implement get and add methods
    
        @param {String} providerName Name of the provider.
    **/
    this.setProvider = function (providerName) {
        cacheProviderName = providerName;
    };
    
    /**
        @name setCacheRules
        @description Define set of rules that will determine the cache expiration time.
    
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
            @name setCacheRules
            @description Get the cached data considering its expiration time.
        
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
                @name enqueueRequest
                @description Enqueue each request to be resolved asynchronously.
            
                @param {Object} options Configuration object used to generate the request.
                @param {Object} updateCache Update cache after data is retrieved.
            **/
            enqueueRequest: function (options, updateCache) {
                var defer = $q.defer();
                
                requestsQueue.put(jsonFormatter.wrap(options), {defer: defer, updateCache: updateCache});
                
                return defer.promise;
            },
            
            /**
                @name dequeueRequest
                @description Dequeue resolved/rejected requests.
            
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
                @name thod cacheData
                @description Add data to the cache.
            
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
                @name getCachedData
                @description Get data from the cache.
            
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
    
    @name eventHub
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

    @name exceptionHandler
**/
wtCore.factory('$exceptionHandler', ['$injector', function ($injector) {
    'use strict';
    
    return function (exception, cause) {
        
        var $log = $injector.get('$log'),
            eventHub = $injector.get('eventHub');
        
        $log.error(exception.message);
        eventHub.fire('APPLICATION_ERROR', exception.message, exception.stack);
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
    
        @name buildKey
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
    
        @name packResponse
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
    
        @name onSuccess
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
    
        @name onError
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
    
        @name hit
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
            param,
            result = url.replace(/:(\w+)/g, function (substring, match) {
                parameters = parameters || {};
                
                var routeValue = parameters[match];
                if (!routeValue) {
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
    
    this.invoke = function (service, action, data, startCallback, successCallback, errorCallback, finallyCallback) {
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
        
        function onSuccess(result) {
            if (successCallback) {
                successCallback(result);
            }
        }
        
        function onError(error) {
            //eventHub.fire('APPLICATION_ERROR', error);
            
            if (errorCallback) {
                errorCallback(error);
            }
        }
        
        function onFinally() {
            if (finallyCallback) {
                finallyCallback();
            }
        }
        
        if (startCallback) {
            startCallback();
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
    
        @name isJSON
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
    
        @name wrap
        @param {String | Object} data Value to be converted.
    **/
    this.wrap = function (data) {
        return (angular.isString(data) ? data : (this.isJSON(data) ? JSON.stringify(data) : data.toString()));
    };
    
    /**
        Convert data from string format to its json representation.
    
        @name unwrap
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
    
        @name clear
    **/
    this.clear = function () {
        $window.localStorage.clear();
    };
    
    /**
        Retrieve a specific entry in the local storage.
    
        @name get
        @param {Object} key Value that uniquely identifies the data stored.
        @return {Object} Value stored in the session storage entry.
    **/
    this.get = function (key) {
        return jsonFormatter.unwrap($window.localStorage.getItem(jsonFormatter.wrap(key)));
    };
    
    /**
        Retrieve all entries in the local storage.
    
        @name getAll
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
    
        @name add
        @param {String | Object} key Value that uniquely identifies the data stored.
        @param {Object} value Object that represents the object stored.
    **/
    this.add = function (key, value) {
        $window.localStorage.setItem(jsonFormatter.wrap(key), jsonFormatter.wrap(value));
    };
    
    /**
        Remove an entry from the local storage.
    
        @name remove
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
    
        @name clear
    **/
    this.clear = function () {
        $window.sessionStorage.clear();
    };
    
    /**
        Retrieve a specific entry in the session storage.
    
        @name get
        @param {Object} key Value that uniquely identifies the data stored.
        @return {Object} Value stored in the session storage entry.
    **/
    this.get = function (key) {
        return jsonFormatter.unwrap($window.sessionStorage.getItem(jsonFormatter.wrap(key)));
    };
    
    /**
        Retrieve all entries in the session storage.
    
        @name getAll
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
    
        @name add
        @param {String | Object} key Value that uniquely identifies the data stored.
        @param {Object} value Object that represents the object stored.
    **/
    this.add = function (key, value) {
        $window.sessionStorage.setItem(jsonFormatter.wrap(key), jsonFormatter.wrap(value));
    };
    
    /**
        Remove an entry from the session storage.
    
        @name remove
        @param {String | Object} key Value that uniquely identifies the data stored.
    **/
    this.remove = function (key) {
        $window.sessionStorage.removeItem(jsonFormatter.wrap(key));
    };
    
    this.execute = function () {
        
    };
    
}]);
/*global wtCore, angular*/

/**
    Provide operations for the new HTML5 local storage feature.

    @class localStorageProxy
**/
wtCore.service('util', function () {
    'use strict';
    
    this.removeFromList = function (list, property, value) {
        if (list instanceof Array) {
            var i = 0, itemCopy;
            
            for (i = 0; i < list.length; i += 1) {
                if (list[i][property] === value) {
                    itemCopy = list[i];
                    itemCopy.__index = i;
                    list.splice(i, 1);
                    break;
                }
            }
            
            return itemCopy;
        }
    };
});