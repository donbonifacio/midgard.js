midgard.js
==========

[![Build Status](https://secure.travis-ci.org/donbonifacio/midgard.js.png?branch=master)](https://travis-ci.org/donbonifacio/midgard.js)

Midgard.js is a prof of concept for a pipelined MVC framework for Node.js. You can see the default info page at 
[midgard.heroku.com](http://midgard.herokuapp.com). It supports ejs views, layouts, partials and i18n. You can see
an app using midgard.js at [challengerz.net](http://www.challengerz.net/en/).

## Install

     npm install midgard.js
     
Or add it to dependencies on your package.json.

## Hello World

Midgard borrows several concepts and terminologies from rails. The first step is to create a route to process an
endpoint. For example, add the following to **config/routes.js**.

```javascript
(function routes() {
  midgard.route("/hello", "hello#world");
})();  
```
A route maps a regex to a handler id. The handler id thas the following format: **controller#action**. Next we need to 
preconfigure midgard. Add to **app/server.js**:

```javascript
var midgard = require('midgard.js');
require('./config/routes.js');
midgard.start(process.env.PORT || 3000);
```
You will me able to start the port with:

    node app/server.js

But first the need to add content.

### Hello controller

Add to **app/controllers/helloController.js** the following:

```javascript
(function helloController() {
  
  exports.world = function world(context) {
    context.render();
  };
  
})();  
```
Controllers in midgard.js are totally sync. You can't do some async stuff on the controller but you can and you should
queue tasks. The **context.render()** queues the template rendering logic on the pipeline.

Create the following in: **app/views/hello.ejs**:

    Hello World: Midgard version <%= midgard.version %>
    
Now you can start the server and access the configured endpoint.

### Layouts

You can specify a controller/action block to act as a layout. When you do that, midgard will pipeline the controllers
and actions so that everything runs in the proper order. To configure a layout on our sample controller:

```javascript
(function helloController() {
  
  exports.layout = "layout#main";
  
  exports.world = function world(context) {
    context.render();
  };
  
})();  
```

The rendering logic for the layout is the sabe as for the controller. This means that the layout's action will be invoked
and that you can queue rendering and logic functions on the pipeline, that will run before the controller's specific
code.

### Partials

You can add as partial any controller/action. Like the layouts, the controller logic will be run and you can queue
specific partial logic. To prepare a layout for being used, you need to include it on your controller:

```javascript
(function helloController() {
  
  exports.world = function world(context) {
    context.include('panel#latestUser');
    context.render();
  };
  
})();
```

And on your view you will be able to insert the partial output:

    Hello World <%= context.partial('panel#latestUser') %>
    
## More...

Midgard.js is still under development. :-)
