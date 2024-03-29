import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import Util from 'ember-cli-pagination/util';
import TruncatePages from './truncate-pages';
import SafeGet from '../util/safe-get';

export default class PageItemsObject extends EmberObject.extend(SafeGet) {
  
  get pageItemsAll() {
    const currentPage = this.getInt('currentPage');
    const totalPages = this.getInt('totalPages');
    Util.log(
      `PageNumbers#pageItems, currentPage ${currentPage}, totalPages ${totalPages}`
    );

    let res = A([]);

    for (let i = 1; i <= totalPages; i++) {
      res.push({
        page: i,
        current: currentPage === i,
        dots: false,
      });
    }
    return res;
  }
  
  get pageItemsTruncated () {
    const currentPage = this.getInt('currentPage');
    const totalPages = this.getInt('totalPages');
    const toShow = this.getInt('numPagesToShow');
    const showFL = this.showFL;

    const t = TruncatePages.create({
      currentPage: currentPage,
      totalPages: totalPages,
      numPagesToShow: toShow,
      showFL: showFL,
    });
    const pages = t.get('pagesToShow');
    let next = pages[0];

    return pages.map(function (page) {
      var h = {
        page: page,
        current: currentPage === page,
        dots: next !== page,
      };
      next = page + 1;
      return h;
    });
  }
    
  get pageItems() {
    if (this.truncatePages) {
      return this.pageItemsTruncated;
    } else {
      return this.pageItemsAll;
    }
  }
}
