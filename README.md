# Ember CLI Pagination

Addon for Ember CLI to do simple pagination. Compatible with the kaminari API in Rails

The current page is represented in Ember by the "page" query parameter

The page is passed to the backend via a "page" query parameter.

## Adding to your application

There's a page-numbers component with two properties, currentPage and totalPages

```
// your template
{{page-numbers currentPage=page totalPages=numPages}}
```


```
import PageControllerMixin from 'ember-cli-pagination/controller-mixin';

export default Ember.ArrayController.extend PageControllerMixin,
  // your controller code...
```