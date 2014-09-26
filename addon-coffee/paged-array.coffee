`import Ember from 'ember'`
`import Util from 'ember-cli-pagination/util'`

DivideIntoPages = Ember.Object.extend
  perPage: 10

  objsForPage: (page) ->
    perPage = @get('perPage')
    s = (page-1)*perPage
    e = s + perPage - 1
    @get('all')[s..e]

  totalPages: ->
    allLength = parseFloat(@get('all.length'))
    perPage = parseFloat(@get('perPage'))

    res = (allLength+1.99) / perPage
    res = parseInt(res)
    res = 0 if allLength == 0

    Util.log "DivideIntoPages#totalPages, allLength #{allLength}, perPage #{perPage}, res #{res}"

    res

  range: (page) ->
    perPage = @get('perPage')
    s = (page-1)*perPage
    e = s + perPage - 1
    {start: s, end: e}

PagedArray = Ember.ArrayProxy.extend
  page: 1
  perPage: 10

  arrangedContent: (->
    page = @get('page')
    r = DivideIntoPages.create(perPage: @get('perPage')).range(page)
    @get('content').slice(r.start,r.end+1)).property("content.@each","page","perPage")

  totalPages: (->
    DivideIntoPages.create(perPage: @get('perPage'), all: @get('content')).totalPages()).property("content.@each","perPage")

  setPage: (page) ->
    Util.log "setPage #{page}"
    @set 'page', page

`export default PagedArray`