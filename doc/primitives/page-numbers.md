## `page-numbers` Component

Displays pagination controls.

![Todos](https://raw.githubusercontent.com/mharris717/ember-cli-pagination/master/screenshots/todos.png) 

Features:

* A clickable link for each page.
* Previous and next buttons, disabled when appropriate.
* The link to the current page receives the .active class.
* Styling with bootstrap, if included.

### Including in your template

There are two ways to use this component. 

#### Backed by a PagedArray

This is the easier and most common way.

```
Ember.ArrayController.extend({
  pagedContent: pagedArray('content')
});
```

```
{{#each pagedContent}}
  {{! your app's display logic}}
{{/each}}

{{page-numbers content=pagedContent}}
```

Clicking a page number will:

* Display the rows on the clicked page.
* Update `pagedContent.page` to the clicked page.

See the pagedArray doc for more information on the pagedArray helper.

#### Bind `currentPage` and `totalPages` to your properties directly

```
Ember.Object.extend({
  page: 1,
  totalPages: 10
});
```

```
{{page-numbers currentPage=page totalPages=totalPages}}
``` 

Clicking a page number will:

* Update the `page` property to the clicked page.