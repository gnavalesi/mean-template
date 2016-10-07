# MEAN Template

A MEAN Stack (Mongo, Express, Angular, Node) application template. It uses:

+ Gulp for quick development with live-reload and tasks for testing and packaging
+ Mongoose as a MongoDB driver
+ Swagger to document your models and routers
+ Bower to manage your client side javascript dependencies

## Usage

Download the code and run:
```bash
npm install
bower install
```

Then run _gulp init_ to describe your application.

### Gulp tasks

+ _gulp_: Same as _gulp dev_.
+ _gulp init_: Asks for the application information (name, version and description) and updates package.json and bower.json
+ _gulp run_: Starts the application.
+ _gulp dev_: Starts the application with live-reload and watch for changes in the client and server to rebuild when necessary.
+ _gulp build_: Makes a development build of the client.
+ _gulp clean_: Cleans the build folders.
+ _gulp dist_: Creates a build folder with the files of the built application.
+ _gulp eslint_: Verifies good practices in code.
+ _gulp test_: Executes the tests and creates a coverage report.
+ _gulp package_: Creates a zip with the full project ready for deployment in the dist folder.
+ _gulp help_: Shows the full list of gulp tasks

### Folder structure

+ **/bin**: Scripts.
    * www: Express initialization script.
+ **/config**: Configuration.
    * **config.js**: General application configuration file.
    * **config-build.js**: Lists the bower files to add to the client. 
    * **config-env.js**: Environment configuration file. MongoDB configuration and application port are listed here.
+ **/controllers**: Server controllers. This folder should contain the server side logic that the routers manage.
+ **/models**: Server models. This folder should contain the mongoose Schemas with its swagger definitions. You may use 
  mongoose Schemas even if the objects won't be stored in mongo, as it allows other things like validations.
+ **/modules**: Custom node modules
+ **/public**: Client side files
    * **/angular**: Angular files (controllers, directives, services). This files are concatenated with _app.js_ when
      the project is built.
    * **/assets**: Images and other assets.
    * **/javascripts**: Custom javascript files.
    * **/stylesheets**: CSS stylesheets.
    * **/views**: Angular route views.
    * **app.js**: Main angular application file.
    * **index.html**: Index of the client
+ **/routes**: Express routers.
+ **/test**: Tests folder
+ **app.js**: Application starting file


### Adding a bower dependency

To add a bower dependency, run:
```bash
bower install --save dependency_name
```

Then add the required files to _config/config-build.js_. The _dev_ object should contain the un-minified version of the
dependencies, and the _dist_ object the minified version. The order is important because this order is kept when 
injecting the dependencies in index.html.

### Auto-routing

When auto-routing is enabled, every file in the _routes_ folder (recursively) is treated as a express Router and used in
the route defined by its location inside the _routes_ folder. _index.js_ files are used as / routes. For example:

+ _routes/index.js_ is used as router for /
+ _routes/posts.js_ is used as router for /posts
+ _routes/api/index.js_ is used as router for /api
+ _routes/api/users.js_ is used as router for /api/users

Auto-routing can be disabled by changing the _config.autorouting_ property in _config/config.js_ file.

### Dependency injection

The _index.html_ file contains two comments where the dependencies will be injected. When the application is built, the
files listed in _config/config-build.js_ are injected, then the files in _public/javascript_ and _public/stylesheets_
are injected, ant then the concatenated version of _public/app.js_ with the files in _public/angular_ folder.
This order is kept to load your dependencies before your scripts and your stylesheets.

