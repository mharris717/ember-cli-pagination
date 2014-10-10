## pagedArray computed helper

Creates a computed property representing a PagedArray. 

Takes two arguments:

* A `contentProperty` argument, representing the name of the "all objects" property on the source object.
* An `options` hash. Currently the only allowed options are page and perPage, both integers.

A PagedArray has several properties you may find useful:

* `page`: the current page (Default: 1)
* `perPage`: how many records to have on each page (Default: 10)
* `totalPages`: the total number of pages

```
import pagedArray from 'ember-cli-pagination/computed/paged-array';

Ember.Object.extend({
  // the property that contains all objects
  content: [1,2,3,4,5,6,7,8,9,10],

  // the paged array
  pagedContent: pagedArray('content', {perPage: 5})
});

// In this example, the properties pagedContent.page, pagedContent.perPage and pagedContent.totalPages will be available.
```

The pagedContent property can serve as a backing array for pagination controls. See the page-numbers component for details. 