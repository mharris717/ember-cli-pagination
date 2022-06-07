import { observer } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['page', 'perPage', 'sortByField'],
  page: 1,

  updatePaged: observer('sortByField', function () {
    var field = this.sortByField;
    var paged = this.model;
    if (paged && paged.setOtherParam) {
      paged.setOtherParam('sortByField', field);
    }
  }),
});
