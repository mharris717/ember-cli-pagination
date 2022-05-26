import Controller, { inject } from '@ember/controller';
import { sort, alias } from '@ember/object/computed';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

class QueryParamsObj {
  @tracked page = 1;
}

export default class InfiniteController extends Controller {
  @service router;

  queryParams = [{ 'queryParamsObj.page': 'page' }];

  queryParamsObj = new QueryParamsObj();
  sortingProperties = Object.freeze(['name:asc']);

  @sort('model', 'sortingProperties') arrangedContent;
  sortingOrder = 'asc';

  @pagedArray('arrangedContent', { infinite: 'unpaged' })
  pagedContent;

  @action loadNext() {
    this.pagedContent.loadNextPage();
  }
}
