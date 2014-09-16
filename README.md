# Ember CLI Pagination

Addon for Ember CLI to do simple pagination. Compatible with the kaminari API in Rails

The current page is represented in Ember by the "page" query parameter

The page is passed to the backend via a "page" query parameter.

## Adding to your application

### Component

There's a page-numbers component with two properties, currentPage and totalPages

```handlebars
// your template
{{page-numbers currentPage=page totalPages=numPages}}
```

### Mixins

There are mixins for your controller and route.

```
// controller

import PageControllerMixin from 'ember-cli-pagination/controller-mixin';

export default Ember.ArrayController.extend(PageControllerMixin, {
  // your controller code...
});
```

```
// route
import PageRouteMixin from 'ember-cli-pagination/route-mixin';

export default Ember.Route.extend(PageRouteMixin, {
  model: function(params) {
    return this.findPaged('model-name',params);
  }
});
```