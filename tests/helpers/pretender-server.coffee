`import Todo from '../../models/todo'`
`import Helpers from 'ember-cli-pagination/test-helpers'`

# assumes always logged in as user 1
todos = -> Todo.FIXTURES

c = ->
  server = new Pretender ->
    @get "/todos", (request) ->
      res = Helpers.responseHash(request,todos(),'todo')
      
      [200, {"Content-Type": "application/json"}, JSON.stringify(res)]

`export default c`