`import startApp from '../helpers/start-app'`
`import pretenderServer from '../helpers/pretender-server'`
`import Todo from '../../models/todo'`

App = null
server = null

module 'Integration - Pagination',
  setup: -> 
    # Expense.setAddlTempFixtures([{id: 4, amount: 30, description: "Lunch for team", expense_dt: (new Date(2014,7,1)), user_id: 1}])

    App = startApp()
    server = pretenderServer()

  teardown: -> 
    # Expense.setAddlTempFixtures []
    Em.run(App,'destroy')
    server.shutdown()

todosTest = (name,f) ->
  test name, ->
    visit("/todos").then(f)

Ember.Test.registerAsyncHelper 'hasActivePage', (app,num,context) ->
  i = 0
  findWithAssert(".pagination li.page-number",context).each ->
    li = $(this)
    active = (num-1 == i)
    equal li.hasClass('active'),active
    i += 1

todosTest "page links", ->
  equal find(".pagination").length,1
  equal find(".pagination li.page-number").length,2

todosTest "first page is active at start", ->
  hasActivePage 1

todosTest "clicking page 2", ->
  click ".pagination li:eq(1) a"
  andThen ->
    equal find("table tr.todo").length,1
    hasActivePage 2

todosTest "next button - proper buttons visible", ->
  hasActivePage 1
  equal find(".pagination .prev").length,0
  equal find(".pagination .next").length,1

todosTest "click next", ->
  click ".pagination .next a"

  andThen ->
    equal find(".pagination .prev").length,1
    equal find(".pagination .next").length,0

    equal find("table tr.todo").length,1
    hasActivePage 2