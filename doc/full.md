# Primitives

* [`page-numbers` Component](#`page-numbers` Component]
* [`pagedArray` Computed Helper](#`pagedArray` Computed Helper]
* [PagedRemoteArray](#PagedRemoteArray]
* [Google](http://google.com)
* [Including](#Stuff-Here)

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

```
Ember.ArrayController.extend({
  pagedContent: pagedArray('content')
});
```

```
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

```
Ember.Object.extend({
  page: 1,
  totalPages: 10
});
```

```
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

```
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


## PagedRemoteArray

PagedRemoteArray represents a page of records fetched from a remote pagination-enabled API.

It takes four arguments at creation, in a standard options hash passed to PagedRemoteArray#create:

* modelName - singular
* store
* page
* perPage

Once the data is loaded, you may iterate over a PagedRemoteArray as you would a normal array.

The object acts as a promise, with a working `then` method. If you are manually iterating over records outside of the standard workflow, make sure to use `then` with standard promise semantics, just as you would an object returned from a normal `store.find` call. 

```
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

### Stuff Here

Wheee

### Updating

A PagedRecordArray will make a new remote call to update records when the page property is changed. Again, standard promise usage applies here. 

```
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

```
Ember.ArrayController.extend({
  // the content property represents a paged array

  pageBinding: "content.page"
});
```