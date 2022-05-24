import { alias } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: ['page', 'perPage'],

  page: alias('model.page'),

  totalPages: alias('model.totalPages'),

  pagedContent: alias('model'),
});
