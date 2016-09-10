'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = angular.module('promiseButtons', []).directive('promiseButton', ['promiseButtons', '$parse', '$timeout', function (promiseButtons, $parse, $timeout) {
  return {
    restrict: 'EA',
    scope: {
      promiseButtonOptions: '=?'
    },
    link: function link(scope, element, attrs) {
      var CLICK_EVENT = 'click';
      var CLICK_ATTR = 'ngClick';
      var SUBMIT_EVENT = 'submit';
      var SUBMIT_ATTR = 'ngSubmit';

      var config = promiseButtons.config;
      var promiseWatcher = void 0;

      var handleLoadingStart = function handleLoadingStart(buttonElement) {
        if (config.btnLoadingClass && !config.addClassToCurrentBtnOnly) {
          buttonElement.addClass(config.btnLoadingClass);
        }
        if (config.disableBtn && !config.disableCurrentBtnOnly) {
          buttonElement.attr('disabled', 'disabled');
        }
      };

      var handleLoadingFinished = function handleLoadingFinished(buttonElement) {
        if (config.btnLoadingClass) {
          buttonElement.removeClass(config.btnLoadingClass);
        }
        if (config.disableBtn) {
          buttonElement.removeAttr('disabled');
        }
      };

      var handleLoadingResult = function handleLoadingResult(buttonElement, isRejected) {
        handleLoadingFinished(buttonElement);
        var classname = isRejected ? config.btnRejectedClass : config.btnResolvedClass;

        buttonElement.addClass(classname);
        $timeout(function () {
          return buttonElement.removeClass(classname);
        }, config.resultMessageLength);
      };

      var initPromiseWatcher = function initPromiseWatcher(watchExpressionForPromise, buttonElement) {
        // watch promise to resolve or fail
        scope.$watch(watchExpressionForPromise, function (mVal) {
          if (!mVal) {
            return false;
          }

          var promise = mVal.then ? mVal : mVal.$promise || undefined;
          if (promise) {
            handleLoadingStart(buttonElement);
            promise.then(function () {
              return handleLoadingResult(buttonElement, false);
            }, function () {
              return handleLoadingResult(buttonElement, true);
            });
          }
        });
      };

      var addHandlersForCurrentBtnOnly = function addHandlersForCurrentBtnOnly(buttonElement) {
        // handle current button only options via click
        if (config.addClassToCurrentBtnOnly) {
          buttonElement.on(CLICK_EVENT, function () {
            return buttonElement.addClass(config.btnLoadingClass);
          });
        }

        if (config.disableCurrentBtnOnly) {
          buttonElement.on(CLICK_EVENT, function () {
            return buttonElement.attr('disabled', 'disabled');
          });
        }
      };

      var handleViewPromiseFunctions = function handleViewPromiseFunctions(eventToHandle, attrToParse, buttonElement) {
        // $evalAsync allows ngSubmit/ngClick to be replaced
        scope.$evalAsync(function () {
          // unbind original click event (ngSubmit/ngClick)
          // rebind watching it's return value
          element.unbind(eventToHandle);
          element.bind(eventToHandle, function () {
            return scope.$apply(function () {
              // Get the function(s) that returns a promise from the view
              attrs[attrToParse].split(';').map(function (fn) {
                return $parse(fn);
              }).forEach(function (fn) {
                if (!promiseWatcher) {
                  (function () {
                    // assign function(s) to promise watcher
                    // to be called on parent scope (current scope is isolate)
                    var promise = fn(scope.$parent, { $event: eventToHandle });
                    promiseWatcher = initPromiseWatcher(function () {
                      return promise;
                    }, buttonElement);
                  })();
                }
              });
            });
          });
        });
      };

      var getSubmitBtnChildren = function getSubmitBtnChildren(el) {
        var submitBtnEls = [];
        var allButtonEls = el.find('button');

        for (var i = 0; i < allButtonEls.length; i++) {
          var btnEl = allButtonEls[i];
          if (angular.element(btnEl).attr('type') === 'submit') {
            submitBtnEls.push(btnEl);
          }
        }
        return angular.element(submitBtnEls);
      };

      if (attrs.hasOwnProperty(CLICK_ATTR)) {
        addHandlersForCurrentBtnOnly(element);
        handleViewPromiseFunctions(CLICK_EVENT, CLICK_ATTR, element);
      } else if (attrs.hasOwnProperty(SUBMIT_ATTR)) {
        // get child submits for form elements
        var btnElements = getSubmitBtnChildren(element);
        addHandlersForCurrentBtnOnly(btnElements);
        handleViewPromiseFunctions(SUBMIT_EVENT, SUBMIT_ATTR, btnElements);
      }

      // watch and update options being changed
      scope.$watch('promiseButtonOptions', function (newVal) {
        if (angular.isObject(newVal)) {
          config = angular.extend({}, config, newVal);
        }
      }, true);
    }
  };
}]).provider('promiseButton', function () {
  // DEFAULTS & CONFIG
  var config = {
    disableBtn: true,
    btnLoadingClass: 'is-loading',
    btnResolvedClass: 'is-resolved',
    btnRejectedClass: 'is-rejected',
    resultMessageLength: 1500,
    addClassToCurrentBtnOnly: false,
    disableCurrentBtnOnly: false
  };

  // PROVIDER-CONFIG-FUNCTIONS
  return {
    extendConfig: function extendConfig(newConfig) {
      return config = angular.extend(config, newConfig);
    },
    $get: function $get() {
      return { config: config };
    }
  };
}).name;