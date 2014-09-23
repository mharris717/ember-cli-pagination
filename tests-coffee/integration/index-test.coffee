`import startApp from '../helpers/start-app'`
`import pretenderServer from '../helpers/pretender-server'`
`import Ember from 'ember'`

App = null
server = null

module 'Integration - Todo Index',
  setup: -> 
    App = startApp()
    server = pretenderServer()

  teardown: -> 
    Ember.run(App,'destroy')
    server.shutdown()

test 'Should showo todos', ->
  visit("/todos").then ->
    equal find(".todo").length,2