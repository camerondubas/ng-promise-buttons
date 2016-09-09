  #Angular Promise Buttons
  
  This directive is a re-write of [johannesjo's angular-promise-buttons directive.](https://github.com/johannesjo/angular-promise-buttons)
  This version is slightly simplified, adds support for Success/Failure cases, and is written in ES6. Contributions are welcome.

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
  WORK IN PROGRESS
  