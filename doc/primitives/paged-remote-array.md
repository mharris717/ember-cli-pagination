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
