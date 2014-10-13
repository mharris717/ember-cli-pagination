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