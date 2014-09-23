`import startApp from '../helpers/start-app'`
`import pretenderServer from '../helpers/pretender-server'`
`import Todo from '../../models/todo'`
`import Ember from 'ember'`

App = null
server = null

module 'Integration - Pagination',
  setup: -> 
    # Expense.setAddlTempFixtures([{id: 4, amount: 30, description: "Lunch for team", expense_dt: (new Date(2014,7,1)), user_id: 1}])

    App = startApp()
    server = pretenderServer()

  teardown: -> 
    # Expense.setAddlTempFixtures []
    Ember.run(App,'destroy')
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

hasButtons = (ops) ->
  for name,present of ops
    length = if present then 1 else 0
    equal find(".pagination .#{name}").length,length

hasTodos = (l) ->
  equal find("table tr.todo").length,l

hasPages = (l) ->
  equal find(".pagination li.page-number").length,l

clickPage = (i) ->
  if i == "prev" || i == "next"
    click ".pagination .#{i} a"
  else
    click ".pagination li:eq(#{i-1}) a"

todosTest "page links", ->
  equal find(".pagination").length,1
  hasPages 2

todosTest "first page is active at start", ->
  hasActivePage 1

todosTest "clicking page 2", ->
  clickPage 2
  andThen ->
    hasTodos 1
    hasActivePage 2

todosTest "next button - proper buttons visible", ->
  hasActivePage 1
  hasButtons prev: false, next: true

todosTest "click next", ->
  clickPage "next"

  andThen ->
    hasButtons prev: true, next: false
    hasTodos 1
    hasActivePage 2

todosTest "click prev", ->
  clickPage 2
  andThen ->
    clickPage "prev"

  andThen ->
    hasButtons prev: false, next: true
    hasTodos 2
    hasActivePage 1