import Controller, { inject } from '@ember/controller';
import { sort, alias } from '@ember/object/computed';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

class QueryParamsObj {
  @tracked page = 1;
  @tracked perPage = 10;
}

export default class LocalController extends Controller {
  @service router;
  
  queryParams= [
    {'queryParamsObj.page': 'page'},
    {'queryParamsObj.perPage': 'perPage'}
  ];
  
  @tracked queryParamsObj = new QueryParamsObj();
    
  @tracked sortingProperties = Object.freeze(['name:asc']);  
  @sort ('model', 'sortingProperties') arrangedContent;
  sortingOrder = 'asc';

  @pagedArray (
    'arrangedContent',
    { page: alias('parent.queryParamsObj.page'), perPage: alias('parent.queryParamsObj.perPage')}
  ) pagedContent;
  
  @action resetPage() {
    this.queryParamsObj.page = 1;
  }  
  
  @action save(){
    this.pagedContent.forEach((todo)=>{
      todo.save();
    });
  }
}