/*global app, angular*/
app.controller('uploadController', ['$scope', '$upload', function ($scope, $upload) {
    'use strict';

    //    $scope.onFileSelect = function ($files) {
    //        for (var i = 0; i < $files.length; i++) {
    //            var file = $files[i];
    //            $scope.upload = $upload.upload({
    //                url: '/posts/upload/',
    //                method: 'POST',                 
    //                file: file,
    //            }).progress(function(evt) {
    //                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
    //            }).success(function(data, status, headers, config) {
    //                // file is uploaded successfully
    //                console.log(data);
    //            });
    //
    //        }
    //    };

    $scope.upload = function ($files) {
        var i = 0, file;

        for (i = 0; i < $files.length; i += 1) {
            file = $files[i];

            $scope.upload = $upload.upload({
                url: '/api/files/upload/',
                method: 'POST',
                file: file
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
            });
        }
    };
}]);