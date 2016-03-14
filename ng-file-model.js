(function () {
    'use strict';
    angular.module('ng-file-model', [])
    .directive('ngFileModel', [function () {
        return {
            scope: {
                ngFileModel: "="
            },
            link: function (scope, element, attributes) {
                element.bind('change', function (changeEvent) {
                    var files           = [],
                        filesReady      = 0,
                        rawFiles        = changeEvent.target.files,
                        rawFilesCount   = rawFiles.length,
                        onFilesReady    = function () {
                            $scope.$apply(function () {
                                scope.ngFileModel = (attributes.multiple) ? files : files[0];
                            });
                        };

                    rawFiles.forEach(function (file) {
                        var reader = new FileReader();
                        reader
                            .readAsDataURL(file)
                            .onload = (function (file) {
                                return function (loadEvent) {
                                    files.push({
                                        lastModified: file.lastModified,
                                        lastModifiedDate: file.lastModifiedDate,
                                        name: file.name,
                                        size: file.size,
                                        type: file.type,
                                        data: file.result
                                    });
                            
                                    if (++filesReady == rawFilesCount) {
                                        onFilesReady();
                                    }
                                };
                            })(file);
                    });
                });
            }
        }
    }]);
})();
