import Ember from 'ember';
import Validate from '../validate';
import Util from '../util';

export var QueryParamsForBackend = Ember.Object.extend({
  defaultKeyFor: function(key) {
    if (key === 'perPage') {
      return 'per_page';
    }
    return null;
  },

  paramKeyFor: function(key) {
    return this.getSuppliedParamMapping(key) || this.defaultKeyFor(key) || key;
  },

  getSuppliedParamMapping: function(key) {
    var h = this.get('paramMapping') || {};
    return h[key];
  },

  accumParams: function(key,accum) {
    var val = this.get(key);
    var mappedKey = this.paramKeyFor(key);

    if (Array.isArray(mappedKey)) {
      this.accumParamsComplex(key,mappedKey,accum);
    }
    else {
      accum[mappedKey] = val;
    }
  },

  accumParamsComplex: function(key,mapArr,accum) {
    var mappedKey = mapArr[0];
    var mapFunc = mapArr[1];

    var val = mapFunc({page: this.get('page'), perPage: this.get('perPage')});
    accum[mappedKey] = val;
  },

  make: function() {
    var res = {};

    this.accumParams('page',res);
    this.accumParams('perPage',res);

    return res;
  }
});

export var ChangeMeta = Ember.Object.extend({
  getSuppliedParamMapping: function(targetVal) {
    var h = this.get('paramMapping') || {};

    // have to do this gross thing because mapping looks like this:
    // {total_pages: ['num_pages',function() ...]}
    //
    // but the way the code works, we need to check for an entry where val[0] == num_pages
    // and then return ['total_pages',function() ...]
    //
    // Gross, but that's how it's working for now
    for (var key in h) {
      var val = h[key];
      if (targetVal === val) {
        return key;
      }
      else if (Array.isArray(val) && val[0] === targetVal) {
        return [key,val[1]];
      }
    }

    return null;
  },

  finalKeyFor: function(key) {
    return this.getSuppliedParamMapping(key) || key;
  },

  makeSingleComplex: function(key,mapArr,rawVal,accum) {
    var mappedKey = mapArr[0];
    var mapFunc = mapArr[1];

    var ops = {rawVal: rawVal, page: this.get('page'), perPage: this.get('perPage')};
    var mappedVal = mapFunc(ops);
    accum[mappedKey] = mappedVal;
  },

  make: function() {
    var res = {};
    var meta = this.get('meta');

    for (var key in meta) {
      var mappedKey = this.finalKeyFor(key);
      var val = meta[key];

      if (Array.isArray(mappedKey)) {
        this.makeSingleComplex(key,mappedKey,val,res);
      }
      else {
        res[mappedKey] = val;
      }
    }

    this.validate(res);

    return res;
  },

  validate: function(meta) {
    if (Util.isBlank(meta.total_pages)) {
      Validate.internalError("no total_pages in meta response",meta);
    }
  }
});