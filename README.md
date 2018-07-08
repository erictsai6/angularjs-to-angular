# angularjs-to-angular
CLI that takes in angularjs files and outputs angular.

Originally written by Grubhub engineers to convert the consumer web application from AngularJS to Angular.  This will not work for you out of the box because every AngularJS application is unique.  We've provided the tools necessary so you can put some sample files and unit test them.

You are also encouraged to hack at the conversion script to get the results you need.

## Getting started ##
* git clone git@github.com:erictsai6/angularjs-to-angular.git
* cd angularjs-to-angular
* npm install
* npm run components
    * This will convert the test component files under tests/data/ and output to upgrade/
* npm run services
    * This will convert the test service files under tests/data/ and output to upgrade/
* npm run serviceSpecs
    * This will convert the test service spec files under tests/data/ and output to upgrade/
* npm run templates
    * This will convert the test template files under tests/data/ and output to upgrade/
* npm test
    * Executes the unit tests using AvaJS

## How to develop with this script ##
The entry point of the script is under src/index.js where it will take commandline arguments that will accept blobs for component, service, service spec and template conversions.  Each specific tool can be found under src/tools/ file.

### Components ###
src/tools/process-components.js
#### Places to hack ####
* imports.get() - reads the AST and based on the code determines what should be imported at the top of the new file
* decorator.get() - reads the AST and based on how the template is defined will set up the component decorator with template or templateUrl.
* removeFromConstructor - takes in a list of arguments that you want to remove from the constructor because they no longer exist in Angular
* processStringReplacements - Has a large 2 x N array with the first column being a REGEX match and the second column representing what you want to replace it with.
* updateReferences - Useful for updating the import references to maintain consistent import paths.

### Services ###
src/tools/process-services.js
#### Places to hack ####
* imports.get() - reads the AST and based on the code determines what should be imported at the top of the new file
* removeFromConstructor - takes in a list of arguments that you want to remove from the constructor because they no longer exist in Angular
* processStringReplacements - Has a large 2 x N array with the first column being a REGEX match and the second column representing what you want to replace it with.
* updateReferences - Useful for updating the import references to maintain consistent import paths.


### Templates ###
src/lib/process-template.js
#### Places to hack ####
* The first section revolves around using cheerio (similar to JQuery) to search for specific elements and add or remove attributes
* The second section is a series of REGEX replace statements

## Running this on your source code ##
* cd angularjs-to-angular
* npm link
* cd <TO YOUR APPLICATION DIRECTORY>
* npm link angularjs-to-angular
* git clone https://github.com/gdi2290/angular-starter upgrade
    * This will create a upgrade directory with an angular starter project
* ./node_modules/.bin/angularjs-to-angular -c="src/**/*.component.ts"
    * Your new source code will be under the upgrade directory.
* Good luck!


