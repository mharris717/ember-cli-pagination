# Ember CLI Pagination

[![Build Status](https://travis-ci.org/mharris717/ember-cli-pagination.svg?branch=master)](https://travis-ci.org/mharris717/ember-cli-pagination)

Addon for Ember CLI to do simple pagination. Compatible with the kaminari API in Rails

The current page is represented in Ember by the "page" query parameter

The page is passed to the backend via a "page" query parameter.

![Todos](https://raw.githubusercontent.com/mharris717/ember-cli-pagination/master/screenshots/todos.png)

## NEXT TEN CALLERS ONLY!!!

I'd be happy to help anyone who'd like to use Ember CLI Pagination in their application, so that people can start using it and I can get feedback. We can jump on Skype for an hour and get everything working. For now open up an issue if you'd like me to assist. 

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

To override the page-numbers template, make your own template in your app at app/templates/components/page-numbers.hbs


### Setting Pagination Type

There are two types of pagination: Local and Remote.

* Local - All records are loaded at the start, or are already present client-side. 
* Remote - Only records for the current page are loaded client-side. New records are loaded when the page changes.

Set your pagination type in your environment.js file. It must be either "local" or "remote"

```javascript
module.exports = function(environment) {
  var ENV = {
    paginationType: "remote", 
    // ....
```


### Controller Mixin

* Adds a "page" query param
* Sets the default page to 1
* Adds a pageChanged method that observes the page property

```javascript
// controller
import PageFactory from 'ember-cli-pagination/factory';
import config from '../config/environment';

export default Ember.ArrayController.extend(PageFactory.controllerMixin(config), {
  // your controller code...
});
```

### Route Mixin

Adds a findPaged(modelName,params) method, which returns a PagedArray.

```javascript
// route
import PageFactory from 'ember-cli-pagination/factory';
import config from '../config/environment';

export default Ember.Route.extend(PageFactory.routeMixin(config), {
  model: function(params) {
    return this.findPaged('model-name',params);
  }
});
```

### Rails Side

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
