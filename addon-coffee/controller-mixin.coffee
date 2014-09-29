`import Ember from 'ember'`
`import Util from 'ember-cli-pagination/util'`

c = PageControllerMixin = Ember.Mixin.create
  queryParams: ["page"]
  page: "1"

  pageChanged: (->
    Util.log "PageControllerMixin#pageChanged"
    p = parseInt(@get('page'))

    if @get('content') && @get('content').setPage
      @get('content').setPage p).observes('page')

  totalPagesBinding: "content.totalPages"

`export default c`