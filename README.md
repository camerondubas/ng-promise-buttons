  #Angular Promise Buttons
  
  This directive is a re-write of [johannesjo's angular-promise-buttons directive.](https://github.com/johannesjo/angular-promise-buttons)
  This version is slightly simplified, adds support for Success/Failure cases, and is written in ES6. 
  A large part of this project was to help me improve my ability to read and understand others code, to add functionality to an open source project, and to go through the proccess of open sourcing a project.
  Contributions are welcome.
  
  The `promise-button`
  directive allows you to have loading states on promise
  functions without needing to apply a boolean to that function, cluttering up controllers.
  Instead, simply add this directive to any button and the associated promise will be
  watched, and loading, success, and error states will be applied.
  When a promise is invoked, the `is-loading` class is added.
  After the promise is resolved or rejected, either the
  `is-resolved` or `is-rejected`
  class is appended to the button for a period of time.

  ##Installation
  
  Install Via NPM:
  
  ```
  npm i --save-dev ng-promise-buttons
  ```
  
  Import it into your project:
  
  ```
  import promiseButtons from 'ng-promise-buttons';
  
  angular.module('app', 
  [
    promiseButtons // 'promiseButtons'
  ]).name;

  ```
  
  
  ##General Usage:

  Add `promise-button` to any element with an `ng-click="somePromiseFunction()"`.
  This promise with automatically be detected and watched.
  
  ```
    <button ng-click="somePromiseFunction()" promise-button>Click Me</button>;
  ```
    
  ##Form Usage:
  To use the promise buttons on a form, add the `promise-button` directive to the `<form>` element, alongside the `ng-submit` directive.
  
  ```
  <form ng-submit="somePromiseFunction()" promise-button>
    <!-- A Form with various inputs-->
    <button type="submit">Submit</button>
  </form>
  ```
  
  ##Configuration:
  To extend the default configuration, use the `promiseButtonsProvider`. Here is an example demonstrating all the default config options.
  
  ```
  .config(['promiseButtonsProvider', promiseButtonsProvider => {
  
    promiseButtonsProvider.extendConfig({
      disableBtn: true, // Disable the button while the promise is loading.
      btnLoadingClass: 'is-loading', // Class added to the button while promise is loading.
      btnResolvedClass: 'is-resolved', // Class added to the button when promise resolves.
      btnLoadingClass: 'is-rejected', // Class added to the button when promise rejects.
      resultMessageLength: 1500, // After Promise Rejects/Resolves, length (milliseconds) for the resulting class to be added
      addClassToCurrentBtnOnly: false, // If multiple buttons have the same promise, only current button will show loading state
      disableCurrentBtnOnly: false // If multiple buttons have the same promise, only current button will disable
    });
  }]);
  ```
  
  The config can but updated on a per use basis by adding `promise-button-config="{configObject}` to specific button/form.
