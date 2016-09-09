export default angular.module('promiseButtons', [])
.directive('promiseButton', ['promiseButtons', '$parse', '$timeout', (promiseButtons, $parse, $timeout) => {
  return {
    restrict: 'EA',
    scope: {
      promiseBtn: '=',
      promiseBtnOptions: '=?'
    },
    link: (scope, element, attrs) => {
      const CLICK_EVENT = 'click';
      const CLICK_ATTR = 'ngClick';
      const SUBMIT_EVENT = 'submit';
      const SUBMIT_ATTR = 'ngSubmit';

      let config = promiseButtons.config;
      let promiseWatcher;

      let handleLoadingStart = buttonElement => {
        if (config.btnLoadingClass && !config.addClassToCurrentBtnOnly) {
          buttonElement.addClass(config.btnLoadingClass);
        }
        if (config.disableBtn && !config.disableCurrentBtnOnly) {
          buttonElement.attr('disabled', 'disabled');
        }
      };

      let handleLoadingFinished = buttonElement => {
        if (config.btnLoadingClass) {
          buttonElement.removeClass(config.btnLoadingClass);
        }
        if (config.disableBtn) {
          buttonElement.removeAttr('disabled');
        }
      };

      let handleLoadingResult = (buttonElement, isRejected) => {
        handleLoadingFinished(buttonElement);
        let classname = isRejected ? config.btnRejectedClass : config.btnResolvedClass;

        buttonElement.addClass(classname);
        $timeout(() => buttonElement.removeClass(classname), config.resultMessageLength);
      };

      let initPromiseWatcher = (watchExpressionForPromise, buttonElement) => {
        // watch promise to resolve or fail
        scope.$watch(watchExpressionForPromise, mVal => {
          if (!mVal) {
            return false;
          }

          let promise = mVal.then ? mVal : mVal.$promise || undefined;
          if (promise) {
            handleLoadingStart(buttonElement);
            promise.then(
              () => handleLoadingResult(buttonElement, false),
              () => handleLoadingResult(buttonElement, true)
            );
          }
        });
      };

      let addHandlersForCurrentBtnOnly = buttonElement => {
        // handle current button only options via click
        if (config.addClassToCurrentBtnOnly) {
          buttonElement.on(CLICK_EVENT, () => buttonElement.addClass(config.btnLoadingClass));
        }

        if (config.disableCurrentBtnOnly) {
          buttonElement.on(CLICK_EVENT, () => buttonElement.attr('disabled', 'disabled'));
        }
      };

      let handleViewPromiseFunctions = (eventToHandle, attrToParse, buttonElement) => {
        // $evalAsync allows ngSubmit/ngClick to be replaced
        scope.$evalAsync(() => {
          // unbind original click event (ngSubmit/ngClick)
          // rebind watching it's return value
          element.unbind(eventToHandle);
          element.bind(eventToHandle, () => scope.$apply(() => {
            // Get the function(s) that returns a promise from the view
            attrs[attrToParse].split(';').map(fn => $parse(fn)).forEach(fn => {
              if (!promiseWatcher) {
                // assign function(s) to promise watcher
                // to be called on parent scope (current scope is isolate)
                let promise = fn(scope.$parent, {$event: eventToHandle});
                promiseWatcher = initPromiseWatcher(() => promise, buttonElement);
              }
            });
          }));
        });
      };

      let getSubmitBtnChildren = el => {
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

      // INIT
      if (attrs.promiseBtn) {
        addHandlersForCurrentBtnOnly(element);
        initPromiseWatcher(() => scope.promiseBtn, element);

      } else if (attrs.hasOwnProperty(CLICK_ATTR)) {
        addHandlersForCurrentBtnOnly(element);
        handleViewPromiseFunctions(CLICK_EVENT, CLICK_ATTR, element);

      } else if (attrs.hasOwnProperty(SUBMIT_ATTR)) {
        // get child submits for form elements
        var btnElements = getSubmitBtnChildren(element); // TODO: Needs some work

        addHandlersForCurrentBtnOnly(btnElements);
        handleViewPromiseFunctions(SUBMIT_EVENT, SUBMIT_ATTR, btnElements);
      }

      // watch and update options being changed
      scope.$watch('promiseBtnOptions', newVal => {
        if (angular.isObject(newVal)) {
          config = angular.extend({}, config, newVal);
        }
      }, true);
    }
  };
}])
.provider('promiseButtons', () => {
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
    extendConfig: newConfig => config = angular.extend(config, newConfig),
    $get: () => ({config})
  };
}).name;