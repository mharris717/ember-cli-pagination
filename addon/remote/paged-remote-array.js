import { once } from '@ember/runloop';
import { alias } from '@ember/object/computed';
import { computed, observer } from '@ember/object';
import Evented from '@ember/object/evented';
import ArrayProxy from '@ember/array/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import Mixin from '@ember/object/mixin';
import Util from 'ember-cli-pagination/util';
import LockToRange from 'ember-cli-pagination/watch/lock-to-range';
import { QueryParamsForBackend, ChangeMeta } from './mapping';
import PageMixin from '../page-mixin';
import { tracked } from '@glimmer/tracking';

var ArrayProxyPromiseMixin = Mixin.create(PromiseProxyMixin, {
  then: function (success, failure) {
    var promise = this.promise;
    var me = this;

    return promise.then(function () {
      return success(me);
    }, failure);
  },
});


var ExtendedArrayProxy = ArrayProxy.extend(PageMixin, Evented, ArrayProxyPromiseMixin)

export default class PagedRemoteArray extends ExtendedArrayProxy {
  @tracked page = 1;
  get paramMapping(){
    return {};
  }
  
  contentUpdated = 0;

  constructor () {
    // this._super(...arguments);
    super();
    var initCallback = this.initCallback;
    if (initCallback) {
      initCallback(this);
    }

    /*this.addArrayObserver({
      arrayWillChange(me) {
        me.trigger('contentWillChange');
      },
      arrayDidChange(me) {
        me.incrementProperty('contentUpdated');
        me.trigger('contentUpdated');
      },
    });*/

    try {
      this.promise;
    } catch (e) {
      this.set('promise', this.fetchContent());
    }
  }

  addParamMapping (key, mappedKey, mappingFunc) {
    var paramMapping = this.paramMapping || {};
    if (mappingFunc) {
      paramMapping[key] = [mappedKey, mappingFunc];
    } else {
      paramMapping[key] = mappedKey;
    }
    this.set('paramMapping', paramMapping);
    this.incrementProperty('paramsForBackendCounter');
    //this.pageChanged();
  }

  addQueryParamMapping (key, mappedKey, mappingFunc) {
    return this.addParamMapping(key, mappedKey, mappingFunc);
  }

  addMetaResponseMapping (key, mappedKey, mappingFunc) {
    return this.addParamMapping(key, mappedKey, mappingFunc);
  }

  paramsForBackend() {
    var page = this.getPage();
    if (this.zeroBasedIndex) {
      page--;
    }

    var paramsObj = QueryParamsForBackend.create({
      page: page,
      perPage: this.getPerPage(),
      paramMapping: this.paramMapping,
    });
    var ops = paramsObj.make();

    // take the otherParams hash and add the values at the same level as page/perPage
    ops = Util.mergeHashes(ops, this.otherParams || {});

    return ops;
  }

  rawFindFromStore() {
    var store = this.store;
    var modelName = this.modelName;

    var ops = this.paramsForBackend;
    var res = store.query(modelName, Object.assign({}, ops)); // always create a shallow copy of `ops` in case adapter would mutate the original object

    return res;
  }

  fetchContent() {
    this.set('loading', true);
    var res = this.rawFindFromStore();
    this.incrementProperty('numRemoteCalls');
    var me = this;

    res.then(
      function (rows) {
        var metaObj = ChangeMeta.create({
          paramMapping: me.get('paramMapping'),
          meta: rows.meta,
          page: me.getPage(),
          perPage: me.getPerPage(),
        });

        me.set('loading', false);
        return me.set('meta', metaObj.make());
      },
      function (error) {
        Util.log('PagedRemoteArray#fetchContent error ' + error);
        me.set('loading', false);
      }
    );

    return res;
  }

  @alias ('meta.total_pages') totalPages;

  @tracked lastPage = null;

  get pageChanged() {
    var page = this.page;
    var lastPage = this.lastPage;
    if (lastPage != page) {
      this.set('lastPage', page);
      this.set('promise', this.fetchContent());
    }
  }

  lockToRange () {
    LockToRange.watch(this);
  }

  get watchPage () {
    var page = this.page;
    var totalPages = this.totalPages;
    if (parseInt(totalPages) <= 0) {
      return;
    }

    this.trigger('pageChanged', page);

    if (page < 1 || page > totalPages) {
      this.trigger('invalidPage', {
        page: page,
        totalPages: totalPages,
        array: this,
      });
    }
  }

  reload () {
    var promise = this.fetchContent();
    this.set('promise', promise);
    return promise;
  }

  setOtherParam (k, v) {
    if (!this.otherParams) {
      this.set('otherParams', {});
    }

    this.otherParams[k] = v;
    this.incrementProperty('paramsForBackendCounter');
    once(this, 'pageChanged');
  }
}