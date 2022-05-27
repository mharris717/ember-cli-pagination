## Module Report

### Unknown Global

**Global**: `Ember.deprecate`

**Location**: `addon\computed\paged-array.js` at line 23

```js
//          pagedOps[alias] = Ember.computed.alias('parent.' + value);
          classOpts[alias] = Ember.computed.alias('parent.' + value);
          Ember.deprecate('Using Binding is deprecated, use Ember.computed.alias or Ember.computed.oneWay instead', false, {
            id: 'addon.ember-cli-pagination.paged-array',
            until: '3.0.0',
```
