/*global angular*/
var wtUI = angular.module('wt-ui', []);
/*global wtUI*/
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
wtUI.directive('loader', function () {
    'use strict';
    
    return {
        
        restrict: 'AE',
        
        scope: {
            loader: '='
        },
        
        link: function (scope, element, attrs) {
            
            var opts = {
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: true, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            },
                spinner = new Spinner(),
                parent = element[0].parentNode;
            
            element[0].style.position = "absolute";
            element[0].style.width = parent.offsetWidth + 'px';
            element[0].style.height = parent.offsetHeight + 'px';
            
            scope.$watch('loader', function (newValue, oldValue, scope) {
                if (newValue) {
                    spinner.spin(element[0]);
                } else {
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
wtUI.directive('pager', function () {
    'use strict';
    
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            currentPage: '=',
            totalPages: '=',
            action: '&'
        },
        template: '<ul class="pagination">' +
                    '<li><a data-ng-click="previous();">{{ previousText }}</a></li>' +
                    '<li data-ng-class="{active: page === currentPage}" data-ng-repeat="page in pages"><a data-ng-click="changePage(page);">{{ page }}</a></li>' +
                    '<li><a data-ng-click="next();">{{ nextText }}</a></li>' +
                  '</ul>',
        link: function (scope, element, attrs) {
            var i = 0;
            
            scope.previousText = element.previousText ? element.previousText : '<';
            scope.nextText = element.nextText ? element.nextText : '>';
            scope.visiblePages = element.visiblePages ? parseFloat(element.visiblePages) : 9;
            scope.currentPage = scope.currentPage ? scope.currentPage : 1;
            
            scope.pages = [];
            
            function buildPager() {
                var fromPage = (scope.currentPage - Math.floor(scope.visiblePages / 2));
                
                if (fromPage < 1) {
                    fromPage = 1;
                } else if (scope.totalPages - fromPage < scope.visiblePages) {
                    fromPage = scope.totalPages - scope.visiblePages + 1;
                }
                
                var toPage = fromPage + scope.visiblePages - 1;
                
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
            
            buildPager();
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
        restrict: 'AECM',
        scope: {
            
        },
        link: function (scope, element, attrs) {
            
        }
    };
});