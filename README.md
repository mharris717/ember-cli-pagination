# Ember CLI Pagination

[![Build Status](https://travis-ci.org/mharris717/ember-cli-pagination.svg?branch=master)](https://travis-ci.org/mharris717/ember-cli-pagination)

Addon for Ember CLI to do simple pagination. Compatible with the kaminari API in Rails

The current page is represented in Ember by the "page" query parameter

The page is passed to the backend via a "page" query parameter.

![Todos](https://raw.githubusercontent.com/mharris717/ember-cli-pagination/master/screenshots/todos.png)

## Adding to your application

### Install

```
npm install ember-cli-pagination --save-dev
```

### Component

There's a page-numbers component with two properties, currentPage and totalPages

```handlebars
// your template
{{page-numbers currentPage=page totalPages=totalPages}}
```

### Controller Mixin

* Adds a "page" query param
* Sets the default page to 1
* Adds a pageChanged method

```
// controller
import PageControllerMixin from 'ember-cli-pagination/controller-mixin';

export default Ember.ArrayController.extend(PageControllerMixin, {
  // your controller code...
});
```

### Route Mixin

Adds a findPaged(modelName,params) method
```
// route
import PageRouteMixin from 'ember-cli-pagination/route-mixin';

export default Ember.Route.extend(PageRouteMixin, {
  model: function(params) {
    return this.findPaged('model-name',params);
  }
});
```