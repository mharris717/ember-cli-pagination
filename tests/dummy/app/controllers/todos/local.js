import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

export default Controller.extend({
  queryParams: ["page","perPage"],
  page: 1,

  pagedContent: pagedArray("model", {
    page: alias('parent.page')
  })
});
