## Paginating a Filtered List

This scenario applies if:

* Have all of your records already loaded client-side.
* You are filtering those records down to create a subset for display
* Wish to display one page of records at a time.
* Want to have a page query parameter (optional).

```javascript
import Ember from 'ember';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

Ember.ArrayController.extend({
  // setup our query params
  queryParams: ["page", "perPage"],

  // set default values, can cause problems if left out
  // if value matches default, it won't display in the URL
  page: 1,
  perPage: 10,

  // only want records that are not completed
  filteredContent: Ember.computed.filterBy('content', 'isCompleted', false),

  // can be called anything, I've called it pagedContent
  // remember to iterate over pagedContent in your template
  pagedContent: pagedArray('filteredContent'),

  // binding the property on the paged array
  // to the query params on the controller
  page: Ember.computed.alias("pagedContent.page"),
  perPage: Ember.computed.alias("pagedContent.perPage"),
  totalPages: Ember.computed.alias("pagedContent.totalPages")
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
