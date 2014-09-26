`import Ember from 'ember'`
`import Util from 'ember-cli-pagination/util'`

c = PageControllerMixin = Ember.Mixin.create
  queryParams: ["page"]
  page: "1"

  pageChanged: (->
    p = parseInt(@get('page'))
    allLength = @get("content.length")
    hasSetPage = !!(@get('content') && @get('content').setPage)
    Util.log "ControllerLocalMixin#pageChanged page #{p} allLength #{allLength} hasSetPage #{hasSetPage}"

    if hasSetPage
      @get('content').setPage p
    else
      Util.log("ControllerLocalMixin#pageChanged can't set page")).observes("page")

  totalPagesBinding: "content.totalPages"

`export default c`