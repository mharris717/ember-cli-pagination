`import Ember from 'ember'`
`import Util from 'ember-cli-pagination/util'`

c = Ember.Component.extend
  currentPage: null
  totalPages: null

  pageItems: (->
    currentPage = Number @get "currentPage"
    totalPages = Number @get "totalPages"

    Util.log "PageNumbers#pageItems, currentPage #{currentPage}, totalPages #{totalPages}"

    for pageNumber in [1..totalPages]
      page: pageNumber
      current: currentPage == pageNumber
  ).property "currentPage", "totalPages"

  canStepForward: (->
      page = Number @get "currentPage"
      totalPages = Number @get "totalPages"
      page < totalPages
  ).property "currentPage", "totalPages"

  canStepBackward: (->
    page = Number @get "currentPage"
    page > 1
  ).property "currentPage"

  actions:
    pageClicked: (number) ->
      Util.log "PageNumbers#pageClicked number #{number}"
      @set "currentPage", number

    incrementPage: (num) ->
      currentPage = Number(@get("currentPage"))
      totalPages = Number(@get("totalPages"))

      return false  if currentPage is totalPages
      return false  if currentPage <= 1

      @incrementProperty 'currentPage',num

`export default c`
