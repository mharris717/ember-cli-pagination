`import Ember from 'ember'`

c = PageControllerMixin = Ember.Mixin.create
  queryParams: ["page"]
  page: "1"

  pageChanged: (->
    p = parseInt(@get('page'))
    allLength = @get("content.length")
    hasSetPage = !!@get('content').setPage
    console.debug "ControllerLocalMixin#pageChanged page #{p} allLength #{allLength} hasSetPage #{hasSetPage}"

    if hasSetPage
      @get('content').setPage p
    else
      console.debug("ControllerLocalMixin#pageChanged can't set page")).observes("page")

  totalPagesBinding: "content.totalPages"

`export default c`