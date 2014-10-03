# Ember CLI Pagination

[![Build Status](https://travis-ci.org/mharris717/ember-cli-pagination.svg?branch=master)](https://travis-ci.org/mharris717/ember-cli-pagination)

Simple pagination addon for your Ember CLI app.

![Todos](https://raw.githubusercontent.com/mharris717/ember-cli-pagination/master/screenshots/todos.png)

Features: 

 - Default pagination template - but you can write your own
 - Current page bound to the `page` query param
 - Compatible with the Kaminari API Rails gem

**Questions?**

This is a new project, but several people are already using it successfully. If you have any trouble, open an issue, and you should get help quickly.

## Requirements

- ember-cli 0.0.39 or higher

## Installation

```
npm install ember-cli-pagination --save-dev
```

## Usage

`ember-cli-pagination` can paginate an array of models backed by an `ArrayController`. Let's say you have a `PostsRoute` whose `model` hook looks something like this

```js
model: function() {
  return this.store.find('post');
}
```

This returns 1,000 posts, too many to show at once. You'd like to paginate the results.

### Route Mixin

First, add the Route Mixin. This Mixin adds a `findPaged(modelName, params)` method to your route, which will
return a `PagedArray`:

```javascript
// routes/posts.js
import PageFactory from 'ember-cli-pagination/factory';
import config from '../config/environment';

export default Ember.Route.extend(PageFactory.routeMixin(config), {
  model: function(params) {
    return this.findPaged('post', params);
  }
});
```

> Note: be sure to pass the `params`, even if you're not using them currently

### Controller Mixin

Next, add the Controller Mixin. This mixin does several things:  

 - Adds a `page` query param
 - Sets the default page to `1`
 - Adds a `pageChanged` method that observes the `page` property

```javascript
// controllers/posts.js
import PageFactory from 'ember-cli-pagination/factory';
import config from '../config/environment';

export default Ember.ArrayController.extend(PageFactory.controllerMixin(config), {
  // your controller code...
});
```

### Page-Numbers Component

With the `PagedArray` backing your mixed-in controller, you can now use the `page-numbers`
component in your template:

```handlebars
{{!-- templates/posts.hbs --}}
{{#each post in controller}}
  <p>{{post.title}}<p>
{{/each}}

{{page-numbers currentPage=page totalPages=totalPages}}
```

The default template for `page-numbers` will render, and the pagination interface will control
which page of models renders in the `each` code block.

You can also create a custom template for the `page-numbers` component. Create your new template here

```
app/templates/components/page-numbers.hbs
```

and use [the default template](https://github.com/mharris717/ember-cli-pagination/blob/master/app/templates/components/page-numbers.hbs) as an guide. You'll want to use the `currentPage` and `totalPages` variables passed in from your controller.

### Pagination Types

There are two types of pagination: Local and Remote.

* `Local` - All records are loaded at the start, or are already present client-side. 
* `Remote` - Only records for the current page are loaded client-side. New records are loaded when the page changes.

How to set your pagination type is covered in [Setting Configuration Values](#setting-configuration-values)

##### Cases for `Local` Pagination:

* All records are stored in a local database (PouchDB, localState, etc).
* You are using the FixtureAdapter.
* You are querying a backend for records (possible with ActiveModelAdapter), but it does not support pagination, meaning it will return all records. 

##### Cases for `Remote` Pagination:

* You are querying a backend that supports pagination. A backend Rails app with Kaminari would fit here.
* You are using an Ember Data adapter that mimics a pagination-supporting backend by implementing findQuery. 

### Setting Configuration Values

Set your pagination type in your environment.js file. It must be either `local` or `remote`

You may also set a default perPage value here, although it is not required.

```javascript
module.exports = function(environment) {
  var ENV = {
    pagination: {
      type: "remote",
      perPage: 10
    }
    // ....
```

The old method of setting paginationType (instead of a nested pagination.type) still works for now.

### Using Kaminari in Rails

```ruby
# Gemfile
gem 'kaminari'
```

```ruby
# controller
# I'm fairly sure you shouldn't need to set the meta manually, but for now that's what I'm doing.

class TodosController < ApplicationController
  def index
    page = (params[:page] || 1).to_i
    todos = Todo.page(page).per(10)
    render json: todos, meta: {total_pages: todos.total_pages}
  end
end
```


### Testing

We include some helpers to make testing pagination easier. 

The helper used here is responseHash, in the context of a Pretender definition.

It takes the request, all fixtures, and the model name, and returns the appropriate response (with meta tag).

```coffeescript
`import Todo from '../../models/todo'`
`import Helpers from 'ember-cli-pagination/test-helpers'`

c = ->
  server = new Pretender ->
    @get "/todos", (request) ->
      res = Helpers.responseHash(request,Todo.FIXTURES,'todo')
      
      [200, {"Content-Type": "application/json"}, JSON.stringify(res)]

`export default c`
```
