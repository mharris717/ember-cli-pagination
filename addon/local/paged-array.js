import { Promise } from 'rsvp';
import { A } from '@ember/array';
import { computed, observer } from '@ember/object';
import Evented from '@ember/object/evented';
import ArrayProxy from '@ember/array/proxy';
import Util from 'ember-cli-pagination/util';
import DivideIntoPages from 'ember-cli-pagination/divide-into-pages';
import LockToRange from 'ember-cli-pagination/watch/lock-to-range';

export default ArrayProxy.extend(Evented, {
  page: 1,
  perPage: 10,

  divideObj: function () {
    return DivideIntoPages.create({
      perPage: this.perPage,
      all: this.content,
    });
  },

  arrangedContent: computed('content.[]', 'page', 'perPage', function () {
    return this.divideObj().objsForPage(this.page);
  }),

  totalPages: computed('content.[]', 'perPage', function () {
    return this.divideObj().totalPages();
  }),

  setPage: function (page) {
    Util.log('setPage ' + page);
    return this.set('page', page);
  },

  watchPage: observer('page', 'totalPages', function () {
    var page = this.page;
    var totalPages = this.totalPages;

    this.trigger('pageChanged', page);

    if (page < 1 || page > totalPages) {
      this.trigger('invalidPage', {
        page: page,
        totalPages: totalPages,
        array: this,
      });
    }
  }),

  then: function (success, failure) {
    var content = A(this.content);
    var me = this;
    var promise;

    if (content.then) {
      promise = content.then(function () {
        return success(me);
      }, failure);
    } else {
      promise = new Promise(function (resolve) {
        resolve(success(me));
      });
    }

    return promise;
  },

  lockToRange: function () {
    LockToRange.watch(this);
  },
});
