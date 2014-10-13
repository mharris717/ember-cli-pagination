## PagedRemoteArray

PagedRemoteArray represents a page of records fetched from a remote pagination-enabled API.

It takes four arguments at creation, in a standard options hash passed to PagedRemoteArray#create:

* modelName - singular
* store
* page
* perPage

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