export default {
  watch: function(paged) {
    paged.on('invalidPage',function(event) {
      if (event.page < 1) {
        paged.set('page',1);
      }
      else if (event.page > event.totalPages) {
        paged.set('page',event.totalPages);
      }
    });
  }
};