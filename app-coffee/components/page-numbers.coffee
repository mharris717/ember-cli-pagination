`import Ember from 'ember'`

c = Ember.Component.extend
  currentPage: null
  totalPages: null
 
  pageItems: (->
    currentPage = Number @get "currentPage"
    totalPages = Number @get "totalPages"
 
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
      console.debug "pageClicked"
      @set "currentPage", number

    incrementPage: (num) ->
      console.debug "incrementPage #{num}"
      @incrementProperty 'currentPage',num

`export default c`