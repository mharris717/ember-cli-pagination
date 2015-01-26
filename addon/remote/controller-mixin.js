import Ember from 'ember';


export default Ember.Mixin.create({
  queryParams: ["page", "perPage"],
  
  pageBinding: "content.page",

  totalPagesBinding: "content.totalPages",

  pagedContentBinding: "content"
});
