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
