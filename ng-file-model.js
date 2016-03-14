(function () {
  'use strict';

  angular
    .module('ng-file-model', [])
    .directive('ngFileModel', ngFileModelFactory);

  function ngFileModelFactory () {
    return {
      scope: {
        ngFileModel: '=',
        ngMultiple:  '='
      },
      link:  function (scope, element, attributes) {
        scope.$watch('ngMultiple', function (newValue) {
          element.get(0).multiple = !!newValue;
        });

        element.bind('change', function (changeEvent) {
          var files         = [],
              filesReady    = 0,
              rawFiles      = changeEvent.target.files,
              rawFilesCount = rawFiles.length,
              onFilesReady  = function () {
                scope.$apply(function () {
                  scope.ngFileModel = (attributes.multiple) ? files : files[0];
                });
              };

          [].forEach.call(rawFiles, function (file) {
            var reader    = new FileReader();
            reader.onload = (function (file) {
              return function (loadEvent) {
                if (loadEvent.type == 'load') {
                  files.push({
                    lastModified:     file.lastModified,
                    lastModifiedDate: file.lastModifiedDate,
                    name:             file.name,
                    size:             file.size,
                    type:             file.type,
                    data:             loadEvent.currentTarget.result
                  });
                }

                if (++filesReady == rawFilesCount) {
                  onFilesReady();
                }
              };
            })(file);
            reader.readAsDataURL(file);
          });
        });
      }
    }
  }
})();
