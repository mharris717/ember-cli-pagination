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
