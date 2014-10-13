## Setup Paginated Rails API

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