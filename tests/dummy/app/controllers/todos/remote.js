import Controller, { inject } from '@ember/controller';
import { tracked } from '@glimmer/tracking';

class QueryParamsObj {
  @tracked page = 1;
  @tracked perPage = 10;
}

export default class RemoteController extends Controller {

  queryParams = [
    { 'queryParamsObj.page': 'page' },
    { 'queryParamsObj.perPage': 'perPage' },
  ];

  queryParamsObj = new QueryParamsObj();
}