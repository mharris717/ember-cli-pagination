import Component from '@glimmer/component';
import { action, get, defineProperty } from '@ember/object';
import { alias } from '@ember/object/computed';

import Util from 'ember-cli-pagination/util';
import PageItems from 'ember-cli-pagination/lib/page-items';
import Validate from 'ember-cli-pagination/validate';
import layout from '../templates/components/page-numbers';

export default class PageNumbersComponent extends Component {
  layout = '';
  
  @alias("args.content.page") currentPage;
  @alias("args.content.totalPages")totalPages;
  
  get hasPages(){
    if(this.totalpages > 1){
      return true;
    }
    return false;
  }

  watchInvalidPage(){
    const c = this.args.content;
    if (c && c.on) {
      c.on('invalidPage', (e) => {
        this._runAction('invalidPageAction', e);
      });
    }
  }

  // only run if a closure action has been passed
  _runAction(key, ...args) {
    const action = get(this, key);
    if (typeof action === 'function') {
      action(...args);
    }
  }

  truncatePages = true;
  numPagesToShow = 10;

  validate() {
    if (Util.isBlank(this.currentPage)) {
      Validate.internalError("no currentPage for page-numbers");
    }
    if (Util.isBlank(this.totalPages)) {
      Validate.internalError('no totalPages for page-numbers');
    }
  }

  get pageItemsObj() {
    let result = PageItems.create({
      parent: this
    });

    defineProperty(result, 'currentPage', alias("parent.currentPage"));
    defineProperty(result, 'totalPages', alias("parent.totalPages"));
    defineProperty(result, 'truncatePages', alias("parent.truncatePages"));
    defineProperty(result, 'numPagesToShow', alias("parent.numPagesToShow"));
    defineProperty(result, 'showFL', alias("parent.showFL"));

    return result;
  }

  get pageItems() {
    this.validate();
    return this.pageItemsObj.pageItems;
  }

  get canStepForward() {
    const page = Number(this.currentPage);
    const totalPages = Number(this.totalPages);
    return page < totalPages;
  }

  get canStepBackward(){
    const page = Number(this.currentPage);
    return page > 1;
  } 


  @action pageClicked(number) {
    Util.log('PageNumbers#pageClicked number ' + number);
    this.currentPage = number;
    this._runAction('action', number);
  }

  @action incrementPage(num) {
    const currentPage = Number(this.currentPage),
      totalPages = Number(this.totalPages);

    if (currentPage === totalPages && num === 1) {
      return false;
    }
    if (currentPage <= 1 && num === -1) {
      return false;
    }
    this.currentPage = this.currentPage + num;

    const newPage = this.currentPage;
    this._runAction('action', newPage);
  }
}
