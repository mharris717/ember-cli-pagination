import { A } from '@ember/array';
import EmberObject from '@ember/object';

export default class DivideIntoPages extends EmberObject{
  objsForPage (page) {
    var range = this.range(page);
    const all = A(this.all);
    return A(all.slice(range.start, range.end + 1));
  }

  totalPages () {
    var allLength = parseInt(this.get('all.length'));
    var perPage = parseInt(this.perPage);
    return Math.ceil(allLength / perPage);
  }

  range (page) {
    var perPage = parseInt(this.perPage);
    var s = (parseInt(page) - 1) * perPage;
    var e = s + perPage - 1;

    return { start: s, end: e };
  }
}
