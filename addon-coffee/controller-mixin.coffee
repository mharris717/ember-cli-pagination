`import Ember from 'ember'`

c = PageControllerMixin = Ember.Mixin.create
  queryParams: ["page"]
  page: "1"

  pageChanged: (-> 
    console.debug "page changed"
    p = parseInt(@get('page'))
    @store.find('todo', page: p, randInd: Math.random()).then (res) =>
      l = res.get('length')
      console.debug "setting content length #{l}"
      @set 'content',res).observes('page')

  pageMetaBinding: "content.meta"
  totalPagesBinding: "pageMeta.total_pages"

`export default c`