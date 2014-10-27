# Ember CLI Pagination

[![Build Status](https://travis-ci.org/mharris717/ember-cli-pagination.svg?branch=master)](https://travis-ci.org/mharris717/ember-cli-pagination)

Simple pagination addon for your Ember CLI app.

![Todos](https://raw.githubusercontent.com/mharris717/ember-cli-pagination/master/screenshots/todos.png)

Features: 

 - Default pagination template - but you can write your own
 - Current page bound to the `page` query param
 - Compatible with the Kaminari API Rails gem

**Questions?**

This is a new project, but several people are already using it successfully. If you have any trouble, open an issue, and you should get help quickly.

## Requirements

- ember-cli 0.0.39 or higher
- ember-cli-pagination 0.3.0 or higher (to match current docs)

## Installation

```
npm install ember-cli-pagination --save-dev
```

## Usage

#### Scenarios

* [Local Store](#local-store)
* [Remote Paginated API](#remote-paginated-api)
* [Remote Unpaginated API](#remote-unpaginated-api)
* [Paginating a Filtered List](#paginating-a-filtered-list)

#### Primitives

* [`page-numbers` Component](#page-numbers-component)
* [`pagedArray` Computed Helper](#pagedarray-computed-helper)
* [PagedLocalArray](#pagedlocalarray)
* [PagedRemoteArray](#pagedremotearray)

#### Other

* [Setup Paginated Rails API](#setup-paginated-rails-api)
* [Testing](#testing)

# Scenarios

## Local Store

This scenario applies if:

* Have all of your records already loaded client-side.
* Wish to display one page of records at a time.
* Want to have a page query parameter (optional).

```javascript
import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

Ember.ArrayController.extend({
  // setup our query params
  queryParams: ["page", "perPage"],

  // can be called anything, I've called it pagedContent
  // remember to iterate over pagedContent in your template
  pagedContent: pagedArray('content'),

  // binding the property on the paged array 
  // to the query params on the controller
  pageBinding: "pagedContent.page",
  perPageBinding: "pagedContent.perPage",
  totalPagesBinding: "pagedContent.totalPages"
});
```

```handlebars
{{#each pagedContent}}
  {{! your app's display logic}}
{{/each}}

{{page-numbers content=pagedContent}}
```

If you don't want to have query params, you may leave them out, along with the 3 bindings. The rest will still work. 

#### Notes

* There is no need to touch the route in this scenario.
* There used to be route and controller mixins, and they may return in the future. For now, they were too much overhead, and they were too much magic. If you think getting rid of the mixins is a mistake, please open an issue and let me know. 

--------------

## Remote Paginated API

This scenario applies if:

* Loading your records from a remote pagination-enabled API.
* Wish to display one page of records at a time.
* Want to have a page query parameter (optional).

```javascript
import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {
  // optional. default is 10
  perPage: 25,

  model: function(params) {
    // todo is your model name
    // returns a PagedRemoteArray
    return this.findPaged('todo',params);
  }
});
```

```javascript
import Ember from 'ember';

Ember.ArrayController.extend({
  // setup our query params
  queryParams: ["page", "perPage"],

  // binding the property on the paged array 
  // to the query params on the controller
  pageBinding: "content.page",
  perPageBinding: "content.perPage",
  totalPagesBinding: "content.totalPages"
});
```

```handlebars
{{#each this}}
  {{! your app's display logic}}
{{/each}}

{{page-numbers content=content}}
```

If you don't want to have query params, you may leave them out, along with the 3 bindings. The rest will still work. 

### Passing other params to findPaged

If your params object has other params, they will be passed to your backend.

```javascript
Ember.Route.extend({
  model: function(params) {
    // params is {page: 1, name: "Adam"}

    return this.findPaged("post",params);

    // server will receive params page=1, name=Adam
  }
});
```

#### Notes

* There used to be a controller mixin, and they may return in the future. For now, it was too much overhead, and it was too much magic. If you think getting rid of the mixin is a mistake, please open an issue and let me know. 
* Related: [Setup a Paginated Rails API](#setup-paginated-rails-api)

--------------

## Remote Unpaginated API

This scenario applies if:

* Loading your records from a remote API that is not pagination-enabled.
* You are ok with loading all records from the API in order to display one page at a time.
* Wish to display one page of records at a time.
* Want to have a page query parameter (optional).

This scenario is identical to the [Local Store](#local-store) scenario. 

--------------

## Paginating a Filtered List

This scenario applies if:

* Have all of your records already loaded client-side.
* You are filtering those records down to create a subset for display
* Wish to display one page of records at a time.
* Want to have a page query parameter (optional).

```javascript
import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

Ember.ArrayController.extend({
  // setup our query params
  queryParams: ["page", "perPage"],

  // only want records that are not completed
  filteredContent: Ember.computed.filterBy('content', 'isCompleted', false),

  // can be called anything, I've called it pagedContent
  // remember to iterate over pagedContent in your template
  pagedContent: pagedArray('filteredContent'),

  // binding the property on the paged array 
  // to the query params on the controller
  pageBinding: "pagedContent.page",
  perPageBinding: "pagedContent.perPage",
  totalPagesBinding: "pagedContent.totalPages"
});
```

```handlebars
{{#each pagedContent}}
  {{! your app's display logic}}
{{/each}}

{{page-numbers content=pagedContent}}
```

If you don't want to have query params, you may leave them out, along with the 3 bindings. The rest will still work. 

#### Notes

* There is no need to touch the route in this scenario.

# Primitives

## `page-numbers` Component

Displays pagination controls.

![Todos](https://raw.githubusercontent.com/mharris717/ember-cli-pagination/master/screenshots/todos.png) 

Features:

* A clickable link for each page.
* Previous and next buttons, disabled when appropriate.
* The link to the current page receives the .active class.
* Styling with bootstrap, if included.

### Including in your template

There are two ways to use this component. 

#### Backed by a PagedArray

This is the easier and most common way.

```javascript
Ember.ArrayController.extend({
  pagedContent: pagedArray('content')
});
```

```handlebars
{{#each pagedContent}}
  {{! your app's display logic}}
{{/each}}

{{page-numbers content=pagedContent}}
```

Clicking a page number will:

* Display the rows on the clicked page.
* Update `pagedContent.page` to the clicked page.

See the pagedArray doc for more information on the pagedArray helper.

#### Bind `currentPage` and `totalPages` to your properties directly

```javascript
Ember.Object.extend({
  page: 1,
  totalPages: 10
});
```

```handlebars
{{page-numbers currentPage=page totalPages=totalPages}}
``` 

Clicking a page number will:

* Update the `page` property to the clicked page.

### Customization

You can use your own template for the pagination controls. Create it in your app at app/templates/components/page-numbers.hbs and it will be used automatically.

See [the default template](https://github.com/mharris717/ember-cli-pagination/blob/master/app/templates/components/page-numbers.hbs) for an example.

### Future Additions

* Don't show links for every page if there are a large number of pages. 
* <</>> links to move more than one page at a time.
* Configuration settings to change behavior, remove arrows, etc.

--------------

## `pagedArray` Computed Helper

Creates a computed property representing a PagedArray. 

A PagedArray acts just like a normal array containing only the records on the current page.

Takes two arguments:

* A `contentProperty` argument, representing the name of the "all objects" property on the source object.
* An optional `options` hash. Currently the only allowed options are page and perPage, both integers

A PagedArray has several properties you may find useful:

* `page`: the current page (Default: 1)
* `perPage`: how many records to have on each page (Default: 10)
* `totalPages`: the total number of pages

```javascript
import pagedArray from 'ember-cli-pagination/computed/paged-array';

Ember.Object.extend({
  // The property that contains all objects
  // In a real app, often set by the route
  content: [1,2,3,4,5,6,7,8,9,10],

  // the PagedArray
  pagedContent: pagedArray('content', {perPage: 5})
});
```

In this example, these properties will be available:

* `pagedContent.page`
* `pagedContent.perPage`
* `pagedContent.totalPages`

The pagedContent property can serve as a backing array for pagination controls. See the page-numbers component for details. 

--------------

## PagedLocalArray

PagedLocalArray represents a page of records from the list of all records.  

All records must be loaded client-side in order to use PagedArray.

It takes three arguments at creation, in a standard options hash passed to PagedArray#create:

* content - list of all records
* page - Optional (Default 1)
* perPage - Optional (Default 10)

Once the data is loaded, you may iterate over a PagedArray as you would a normal array.

The object acts as a promise, with a working `then` method.

```javascript
import PagedArray from 'ember-cli-pagination/local/paged-array';

var all = Ember.A([1,2,3,4,5]);
var paged = PagedArray.create(content: all, perPage: 2);

equal(paged.get('length'),2);
deepEqual(paged.toArray(),[1,2]);

paged.set("page",3);
deepEqual(paged.toArray(),[5]);

all.pushObject(6);
deepEqual(paged.toArray(),[5,6]);
```

### Updating

A Paged will be updated when the page property is changed.

### Binding

You may bind PagedArray#page like any property. 

To update records when a page property changes:

```javascript
Ember.ArrayController.extend({
  // the content property represents a paged array

  pageBinding: "content.page"
});
```

--------------

## PagedRemoteArray

PagedRemoteArray represents a page of records fetched from a remote pagination-enabled API.

It takes five arguments at creation, in a standard options hash passed to PagedRemoteArray#create:

* modelName - singular
* store
* page
* perPage
* otherParams - optional. If provided, will be passed on to server at same level as page and perPage

Once the data is loaded, you may iterate over a PagedRemoteArray as you would a normal array.

The object acts as a promise, with a working `then` method. If you are manually iterating over records outside of the standard workflow, make sure to use `then` with standard promise semantics, just as you would an object returned from a normal `store.find` call. 

```javascript
import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';

Ember.Route.extend({
  model: function(params) {
    // possible params are params.page and params.per_page
    // Ember's query param logic converts perPage to per_page at some point, for now just dealing with it.

    return PagedRemoteArray.create({modelName: 'post', 
                                    store: this.store,
                                    page: params.page || 1,
                                    perPage: params.per_page || 10});
  }
});
```

### Updating

A PagedRecordArray will make a new remote call to update records when the page property is changed. Again, standard promise usage applies here. 

```javascript
// pagedArray represents a PagedRemoteArray, already created and loaded with data, with page=1
// var pagedArray = ....

// this will trigger the remote call for new data
pagedArray.set("page",2);

pagedArray.then(function() {
  // the data is loaded.
  pagedArray.forEach(function(obj) {
    // your logic
  });
});
```

### Binding

You may bind PagedRemoteArray#page like any property. 

To update records when a page property changes:

```javascript
Ember.ArrayController.extend({
  // the content property represents a paged array

  pageBinding: "content.page"
});
```

### `otherParams`

PagedRemoteArray takes an optional otherParams arg. These params will be passed to the server when the request is made.

```javascript
var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2, otherParams: {name: "Adam"}});

// server will receive params page=1, perPage=2, name=Adam
```

# Other

## Setup Paginated Rails API

```ruby
# Gemfile
gem 'kaminari'
```

```ruby
# controller
# I'm fairly sure you shouldn't need to set the meta manually, but for now that's what I'm doing.

class TodosController < ApplicationController
  def index
    page = (params[:page] || 1).to_i
    todos = Todo.page(page).per(10)
    render json: todos, meta: {total_pages: todos.total_pages}
  end
end
```

--------------

## Testing

We include some helpers to make testing pagination easier. 

The helper used here is responseHash, in the context of a Pretender definition.

It takes the request, all fixtures, and the model name, and returns the appropriate response (with meta tag).

```coffeescript
`import Todo from '../../models/todo'`
`import Helpers from 'ember-cli-pagination/test-helpers'`

c = ->
  server = new Pretender ->
    @get "/todos", (request) ->
      res = Helpers.responseHash(request,Todo.FIXTURES,'todo')
      
      [200, {"Content-Type": "application/json"}, JSON.stringify(res)]

`export default c`
```