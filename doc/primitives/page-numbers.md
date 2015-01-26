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

```javascript
Ember.ArrayController.extend({
  pagedContent: pagedArray('content')
});
```

```handlebars
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

```javascript
Ember.Object.extend({
  page: 1,
  totalPages: 10
});
```

```handlebars
{{page-numbers currentPage=page totalPages=totalPages}}
``` 

Clicking a page number will:

* Update the `page` property to the clicked page.

### Customization

You can use your own template for the pagination controls. Create it in your app at app/templates/components/page-numbers.hbs and it will be used automatically.

See [the default template](https://github.com/mharris717/ember-cli-pagination/blob/master/app/templates/components/page-numbers.hbs) for an example.

To always show the first and last pages (in addition to the pages that would be shown normally), set the showFL property

```javascript
{{page-numbers content=content showFL=true}}
```

### Future Additions

* <</>> links to move more than one page at a time.
* Configuration settings to change behavior, remove arrows, etc.