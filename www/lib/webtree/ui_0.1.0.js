/*global angular*/

/**
    The wt-ui module provides a set of visual components or wrapers to third-party visual components.
    
    @module UI
**/
var wtUI = angular.module('wt-ui', []);
/*global wtUI*/
wtUI.directive('dynamicSlider', ['$timeout', function ($timeout) {
    'use strict';
    
    return {
        template: '<div class="swiper-container"><div class="swiper-wrapper" data-ng-transclude></div></div>',
        
        transclude: true,
        
        replace: true,
        
        link: function (scope, element, attrs) {
            $timeout(function () {
                var mySwiper = new Swiper(element[0], {
                    mode: 'horizontal',
                    loop: true
                });
            });
        }
    };
}]);
/*global wtUI*/
/**
    The keyEnter directive executes specific actions in response to specific keys pressed.

    @class keyEnter
**/
wtUI.directive('keyEnter', ['$timeout', function ($timeout) {
    'use strict';
    
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            var attr,
                pattern = /key\d+/i,
                result;
            
            function bindEvent(callback) {
                
                $timeout(function () {
                    scope.$apply(callback);
                    
                    event.preventDefault();
                });
            }
            
            for (attr in attrs) {
                result = attr.match(pattern);
                
                if (result) {
                    if (event.which === result.input.replace('key', '')) {
                        bindEvent(attrs[result.input]);
                    }
                }
            }
        });
    };
}]);
/*global wtUI*/

/**
    The loader directive displays a loader image in response to executing operations.

    @class loader
**/
wtUI.directive('loader', function () {
    'use strict';
    
    return {
        
        restrict: 'AE',
        
        scope: {
            loader: '='
        },
        
        link: function (scope, element, attrs) {
            
            var opts = {
                lines: 12, // The number of lines to draw
                length: 7, // The length of each line
                width: 5, // The line thickness
                radius: 10, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 100, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: true, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            },
                spinner = new Spinner(opts),
                parent = element[0].parentNode;
            
            element[0].style.position = "absolute";
            element[0].style.width = parent.offsetWidth + 'px';
            element[0].style.height = parent.offsetHeight + 'px';
            
            scope.$watch('loader', function (newValue, oldValue, scope) {
                if (newValue) {
                    element[0].style.display = 'block';
                    spinner.spin(element[0]);
                } else {
                    element[0].style.display = 'none';
                    spinner.stop();
                }
            });
        }
        
    };
});
/*global wtUI*/
wtUI.directive('map', function () {
    'use strict';
    
    return {
        
        restrict: 'EA',
        
        link: function (scope, element, attrs) {
            var mapOptions = {
                center: new google.maps.LatLng(-34.397, 150.644),
                zoom: 8
            },
                map = new google.maps.Map(element[0], mapOptions);
            
        }
        
    };
});
/*global wtUI*/

/**
    The pager directive displays a pager navigation component.

    @class pager
**/
wtUI.directive('pager', function () {
    'use strict';
    
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            action: '&'
        },
        template: '<ul class="pagination" data-ng-show="pages.length > 0">' +
            '<li><a data-ng-click="previous();">{{ previousText }}</a></li>' +
            '<li data-ng-class="{active: page === currentPage}" data-ng-repeat="page in pages"><a data-ng-click="changePage(page);">{{ page }}</a></li>' +
            '<li><a data-ng-click="next();">{{ nextText }}</a></li>' +
            '</ul>',
        link: function (scope, element, attrs) {
            var i = 0;
            
            scope.totalPages = 0;
            scope.visiblePages = 0;
            scope.currentPage = 1;
            
            function buildPager() {
                
                if (scope.visiblePages) {
                    scope.visiblePages = parseInt(scope.visiblePages);
                } else {
                    scope.visiblePages = scope.totalPages < 9 ? scope.totalPages : 9;
                }
                
                //                if (attrs.currentPage) {
                //                    currentPage = parseInt(attrs.currentPage);
                //                }
                
                scope.previousText = attrs.previousText || '<';
                scope.nextText = attrs.nextText || '>';
                //scope.currentPage = currentPage;
                scope.pages = [];
                
                var fromPage = (scope.currentPage - Math.floor(scope.visiblePages / 2)),
                    toPage;
                
                if (fromPage < 1) {
                    fromPage = 1;
                } else if (scope.totalPages - fromPage < scope.visiblePages) {
                    fromPage = scope.totalPages - scope.visiblePages + 1;
                }
                
                toPage = fromPage + scope.visiblePages - 1;
                
                if (toPage > scope.totalPages) {
                    toPage = scope.totalPages;
                }
                
                scope.pages = [];
                
                for (i = fromPage; i <= toPage; i += 1) {
                    scope.pages.push(i);
                }
            }
            
            scope.previous = function () {
                if (scope.currentPage > 1) {
                    scope.currentPage -= 1;
                    
                    scope.changePage(scope.currentPage);
                }
            };
            
            scope.next = function () {
                if (scope.currentPage < scope.totalPages) {
                    scope.currentPage += 1;
                    
                    scope.changePage(scope.currentPage);
                }
            };
            
            scope.changePage = function (page) {
                scope.currentPage = page;
                scope.action({ page: scope.currentPage});
                
                buildPager();
            };
            
            attrs.$observe('totalPages', function (value) {
                if (value) {
                    scope.totalPages = parseInt(value);
                    buildPager();
                }
            });
            
            attrs.$observe('currentPage', function (value) {
                if (value) {
                    scope.currentPage = parseInt(value);
                    buildPager();
                }
            });
            
            attrs.$observe('visiblePages', function (value) {
                if (value) {
                    scope.visiblePages = parseInt(value) < 9 ? parseInt(value) : 9;
                    buildPager();
                }
            });
        }
    };
});
/*global wtUI*/
/*
 tags {Array}
 data-show-remove-tag-button {true | false}
 show-input-field {true | false}
 data-on-click {function}
 data-on-add {function}
 data-on-remove {function}
 
 usage: 
 <pillbox tags="tags" data-show-remove-tag-button="true" data-show-input-field="true" data-on-click="onTagClick(tag)" data-on-add="onTagAdd(tag)" ></pillbox>
 
*/
wtUI.directive('pillbox', function () {
    'use strict';
    
    return {
        restrict: 'AE',
        
        replace: true,
        
        template:   '<ul class="pillbox-container">' +
                        '<li data-ng-repeat="tag in tags" data-ng-click="clickTag(tag);">' +
                            '<span data-ng-bind="tag"></span>' +
                            '<a data-ng-show="showRemoveTagButton" data-ng-click="removeTag(tag);">x</a></li>' +
                        '<li class="new-tag" data-ng-show="showInputField">' +
                            '<input type="text" data-key-enter data-key13="addTag();" data-key188="addTag();" placeholder="Add a tag" data-ng-model="newTagValue" />' +
                        '</li>' +
                    '</ul>',
        
        scope: {
            tags: '=',
            onClick: '&',
            onAdd: '&',
            onRemove: '&'
        },
        
        link: function (scope, element, attrs) {
            
            scope.showRemoveTagButton = true;
            
            if (attrs.showRemoveTagButton) {
                scope.showRemoveTagButton = (attrs.showRemoveTagButton === 'true');
            }
            
            scope.showInputField = true;
            
            if (attrs.showInputField) {
                scope.showInputField = (attrs.showInputField === 'true');
            }
            
            scope.clickTag = function (tag) {
                scope.onClick({ tag: tag });
            };
            
            scope.addTag = function () {
                var i = 0, found = false;
                
                if (!scope.tags) {
                    scope.tags = [];
                }
                
                for (i = 0; i < scope.tags.length; i += 1) {
                    if (scope.tags[i] === scope.newTagValue) {
                        found = true;
                        break;
                    }
                }
                
                if (!found && scope.newTagValue) {
                    scope.tags.push(scope.newTagValue);
                    
                    scope.onAdd({ tag: scope.newTagValue });
                }
                
                scope.newTagValue = '';
            };
            
            scope.removeTag = function (tag) {
                var i = 0;
                
                for (i = 0; i < scope.tags.length; i += 1) {
                    if (scope.tags[i] === tag) {
                        scope.tags.splice(i, 1);
                        
                        scope.onRemove({ tag: tag });
                        
                        break;
                    }
                }
            };
            
        }
    };
    
});
/*global wtUI*/
wtUI.directive('scroller', function () {
    'use strict';
    
    return {
        link: function (scope, element, attrs) {
            var offset = parseInt(attrs.threshold) || 0,
                e = element[0];
            
            element.bind('scroll', function () {
                if (scope.$eval(attrs.canLoad) && e.scrollTop + e.offsetHeight >= e.scrollHeight - offset) {
                    scope.$apply(attrs.scroller);
                }
            });
        }
    };
});
/*global wtUI*/

/**
    The pageBuffer factory manages paged data.

    @class pageBuffer
**/
wtUI.factory('pageBuffer',  ['$q', '$timeout', function ($q, $timeout) {
    'use strict';
    
    return function PageBuffer(pageSize, pagesToBuffer) {
        var bufferedPages = {};
        
        return {
            
            getData: function getData(currentPage, callback) {
                var i = 0, startPage = 1, endPage, items = [], defer, promise;
                
                defer = $q.defer();
                
                startPage = currentPage - pagesToBuffer;
                endPage = currentPage + pagesToBuffer;
                
                if (startPage < 1) {
                    startPage = 1;
                }
                
                // primeiro serve a página corrente
                if (!bufferedPages['page' + currentPage]) {
                    promise = callback(currentPage);
                    promise.then(function (result) {
                        bufferedPages['page' + result.currentPage] = result.items;
                        defer.resolve(result.items);
                    });
                } else {
                    $timeout(function () {
                        defer.resolve(bufferedPages['page' + currentPage]);
                    });
                }
                
                // demais páginas
                for (i = startPage; i <= endPage; i += 1) {
                    if (i !== currentPage && !bufferedPages['page' + i]) {
                        promise = callback(i);
                        promise.then(function (result) {
                            bufferedPages['page' + result.currentPage] = result.items;
                        });
                    }
                }
                
                return defer.promise;
            }
        };
    };
}]);
/*global wtUI, toastr*/
// Component Dependency: Toastr

// USAGE
// scope.messager.show('my message', 'info', { positionClass: 'toast-bottom-left' });

wtUI.service('toastr', ['$log', function ($log) {
    'use strict';
    
    this.options = {
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "fadeIn": 300,
        "fadeOut": 1000,
        "timeOut": 5000,
        "extendedTimeOut": 1000
    };
    
    this.clear = function () {
        toastr.clear();
    };
    
    this.show = function (message, type, options) {
        if (options) {
            if (options.positionClass) { toastr.options.positionClass = options.positionClass; }
            if (options.fadeIn) { toastr.options.fadeIn = options.fadeIn; }
            if (options.fadeOut) { toastr.options.fadeOut = options.fadeOut; }
            if (options.timeOut) { toastr.options.timeOut = options.timeOut; }
            if (options.extendedTimeOut) { toastr.options.extendedTimeOut = options.extendedTimeOut; }
        }
        
        switch (type) {
        case 'success':
            $log.log(message);
            toastr.success(message);
            break;
        case 'info':
            $log.info(message);
            toastr.info(message);
            break;
        case 'warning':
            $log.warn(message);
            toastr.warning(message);
            break;
        case 'error':
            $log.error(message);
            toastr.error(message);
            break;
        default:
            $log.info(message);
            toastr.info(message);
            break;
        }
    };
}]);