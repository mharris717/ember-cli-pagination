## Local Store

This scenario applies if:

* Have all of your records already loaded client-side.
* Wish to display one page of records at a time.
* Want to have a page query parameter (optional).

```javascript
import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

Ember.ArrayController.extend({
  // setup our query params
  queryParams: ["page", "perPage"],

  // can be called anything, I've called it pagedContent
  // remember to iterate over pagedContent in your template
  pagedContent: pagedArray('content'),

  // binding the property on the paged array 
  // to the query params on the controller
  pageBinding: "pagedContent.page",
  perPageBinding: "pagedContent.perPage",
  totalPagesBinding: "pagedContent.totalPages"
});
```

```handlebars
{{#each pagedContent}}
  {{! your app's display logic}}
{{/each}}

{{page-numbers content=pagedContent}}
```

If you don't want to have query params, you may leave them out, along with the 3 bindings. The rest will still work. 

#### Notes

* There is no need to touch the route in this scenario.
* There used to be route and controller mixins, and they may return in the future. For now, they were too much overhead, and they were too much magic. If you think getting rid of the mixins is a mistake, please open an issue and let me know. 