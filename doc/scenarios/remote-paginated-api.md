## Remote Paginated API

This scenario applies if:

* Loading your records from a remote pagination-enabled API.
* Wish to display one page of records at a time.
* Want to have a page query parameter (optional).

```
import Ember from 'ember';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

export default Ember.Route.extend(RouteMixin, {
  model: function(params) {

    // todo is your model name
    // returns a PagedRemoteArray
    return this.findPaged('todo',params);
  }
});
```

```
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

```
{{#each this}}
  {{! your app's display logic}}
{{/each}}

{{page-numbers content=content}}
```

If you don't want to have query params, you may leave them out, along with the 3 bindings. The rest will still work. 

### Notes

* There used to be a controller mixin, and they may return in the future. For now, they were too much overhead, and they were too much magic. If you think getting rid of the mixins is a mistake, please open an issue and let me know. 