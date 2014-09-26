`import Todo from '../../models/todo'`
`import Helpers from 'ember-cli-pagination/test-helpers'`
`import config from '../../config/environment'`

# assumes always logged in as user 1
todos = -> Todo.FIXTURES

c = ->
  server = new Pretender ->
    @get "/todos", (request) ->
      paginationType = config.paginationType
      res = if paginationType == "local"
        {todos: todos()}
      else if paginationType == "remote"
        Helpers.responseHash(request,todos(),'todo')
      else
        throw "unknown pagination type"
      
      [200, {"Content-Type": "application/json"}, JSON.stringify(res)]

`export default c`