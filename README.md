# Ember CLI Pagination

[![Build Status](https://travis-ci.org/mharris717/ember-cli-pagination.svg?branch=master)](https://travis-ci.org/mharris717/ember-cli-pagination)

Addon for Ember CLI to do simple pagination. Compatible with the kaminari API in Rails

The current page is represented in Ember by the "page" query parameter

The page is passed to the backend via a "page" query parameter.

![Todos](https://raw.githubusercontent.com/mharris717/ember-cli-pagination/master/screenshots/todos.png)

## Adding to your application

### Install

```
npm install ember-cli-pagination --save-dev
```

### Component

There's a page-numbers component with two properties, currentPage and totalPages

```handlebars
// your template
{{page-numbers currentPage=page totalPages=totalPages}}
```

### Controller Mixin

* Adds a "page" query param
* Sets the default page to 1
* Adds a pageChanged method

```
// controller
import PageControllerMixin from 'ember-cli-pagination/controller-mixin';

export default Ember.ArrayController.extend(PageControllerMixin, {
  // your controller code...
});
```

### Route Mixin

Adds a findPaged(modelName,params) method
```
// route
import PageRouteMixin from 'ember-cli-pagination/route-mixin';

export default Ember.Route.extend(PageRouteMixin, {
  model: function(params) {
    return this.findPaged('model-name',params);
  }
});
```

### Rails Side

```
# Gemfile
gem 'kaminari'
```

```
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

```
`import Todo from '../../models/todo'`
`import Helpers from 'ember-cli-pagination/test-helpers'`

c = ->
  server = new Pretender ->
    @get "/todos", (request) ->
      res = Helpers.responseHash(request,Todo.FIXTURES,'todo')
      
      [200, {"Content-Type": "application/json"}, JSON.stringify(res)]

`export default c`
```