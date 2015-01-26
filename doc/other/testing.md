## Testing

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