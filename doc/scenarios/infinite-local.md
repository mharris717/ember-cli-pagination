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