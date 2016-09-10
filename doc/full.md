# Usage

#### Scenarios

* [Local Store](#local-store)
* [Remote Paginated API](#remote-paginated-api)
* [Remote Unpaginated API](#remote-unpaginated-api)
* [Paginating a Filtered List](#paginating-a-filtered-list)
* [Infinite Pagination with All Records Present Locally](#infinite-pagination-with-all-records-present-locally)
* [Infinite Pagination with a Remote Paginated API](#infinite-pagination-with-a-remote-paginated-api)

#### Primitives

* [`page-numbers` Component](#page-numbers-component)
* [`pagedArray` Computed Helper](#pagedarray-computed-helper)
* [PagedLocalArray](#pagedlocalarray)
* [PagedRemoteArray](#pagedremotearray)

#### Other

* [Testing](#testing)
* [Setup Paginated Rails API](#setup-paginated-rails-api)
* [Contributors](#contributors)

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

  // set default values, can cause problems if left out
  // if value matches default, it won't display in the URL
  page: 1,
  perPage: 10,

  // can be called anything, I've called it pagedContent
  // remember to iterate over pagedContent in your template
  pagedContent: pagedArray('content', {pageBinding: "page", perPageBinding: "perPage"}),

  // binding the property on the paged array
  // to a property on the controller
  totalPages: Ember.computed.alias("pagedContent.totalPages")
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
  totalPagesBinding: "content.totalPages",

  // set default values, can cause problems if left out
  // if value matches default, it won't display in the URL
  page: 1,
  perPage: 10
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

### Using other names for page/perPage/total_pages

You may pass an optional paramMapping arg. This is a hash that allows you to change the param names for page/perPage/total_pages.

Note that the default param name for perPage is per_page.

`page` and `perPage` control what is sent to the backend. `total_pages` controls where we expect to find the total pages value in the response from the backend.

```javascript
import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {
  model: function(params) {
    params.paramMapping = {page: "pageNum",
                           perPage: "limit",
                           total_pages: "num_pages"};
    return this.findPaged('todo',params);
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

  // set default values, can cause problems if left out
  // if value matches default, it won't display in the URL
  page: 1,
  perPage: 10,

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

--------------

## Infinite Pagination with All Records Present Locally

The infinite pagination sections of the docs is not yet up to my preferred quality level. If you have any questions or problems, please do not hesitate to make an issue.

The example below does not use a page query param, although that is certainly possible.

Controller:

```javascript
import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.ArrayController.extend({
  pagedContent: pagedArray('content', {infinite: "unpaged"}),

  actions: {
    loadNext: function() {
      this.get('pagedContent').loadNextPage();
    }
  }
});
```

`"unpaged"` in this example indicates the source array (the `content` property) is a regular (unpaged) array, as opposed to a PagedArray.

--------------

## Infinite Pagination with a Remote Paginated API

The example below does not use a page query param, although that is certainly possible.

```javascript
// controller

import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Ember.ArrayController.extend({
  pagedContent: pagedArray("content", {infinite: true}),

  actions: {
    loadNext: function() {
      this.get('pagedContent').loadNextPage();
    }
  }
});
```

 `{infinite: true}` in this example indicates the source array (the `content` property) is a paged array, in this case a PagedRemoteArray.

```javascript
// route

import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {
  model: function(params) {
    return this.findPaged('todo',params);
  }
});
```


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

To always show the first and last pages (in addition to the pages that would be shown normally), set the showFL property

```javascript
{{page-numbers content=content showFL=true}}
```

### Future Additions

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

  page: Ember.computed.alias("content.page")
});
```

--------------

## PagedRemoteArray

PagedRemoteArray represents a page of records fetched from a remote pagination-enabled API.

It takes six arguments at creation, in a standard options hash passed to PagedRemoteArray#create:

* modelName - singular
* store
* page
* perPage
* otherParams - optional. If provided, will be passed on to server at same level as page and perPage
* paramMapping - optional. Allows configuration of param names for page/perPage/total_pages

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

  page: Ember.computed.alias("content.page")
});
```

### `otherParams`

PagedRemoteArray takes an optional otherParams arg. These params will be passed to the server when the request is made.

```javascript
var paged = PagedRemoteArray.create({store: store, modelName: 'number', page: 1, perPage: 2, otherParams: {name: "Adam"}});

// server will receive params page=1, perPage=2, name=Adam

### `paramMapping`

PagedRemoteArray takes an optional paramMapping arg. This is a hash that allows you to change the param names for page/perPage/total_pages.

Note that the default param name for perPage is per_page.

`page` and `perPage` control what is sent to the backend. `total_pages` controls where we expect to find the total pages value in the response from the backend.

```javascript
// This will send a request with pageNum and limit params,
// and expect a response with a num_pages param in the meta.
var paged = PagedRemoteArray.create({/* ..., */
                                    paramMapping: {page: "pageNum",
                                                   perPage: "limit",
                                                   total_pages: "num_pages"}});
```

# Other

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

--------------

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

## Contributors

You guys rock!

* @broerse
* @robdel12
* @samselikoff
* @pedrokiefer
* @gcollazo
* @johanneswuerback
* @tonycoco
* @dlameri
* @piotrpalek
* @robertleib
