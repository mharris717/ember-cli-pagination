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
