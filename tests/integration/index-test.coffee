`import startApp from '../helpers/start-app'`
`import pretenderServer from '../helpers/pretender-server'`

App = null
server = null

module 'Integration - Todo Index',
  setup: -> 
    App = startApp()
    server = pretenderServer()

  teardown: -> 
    Em.run(App,'destroy')
    server.shutdown()

test 'Should showo todos', ->
  visit("/todos").then ->
    equal find(".todo").length,3