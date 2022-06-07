import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';
import MockStore from '../../helpers/mock-store';

module('Remote Route Mixin', function () {
  test('thing', function (assert) {
    var store = MockStore.create();

    var Something = EmberObject.extend(RouteMixin, {});
    var something = Something.create({ store: store });

    something.findPaged('todo', { name: 'Adam' });
    var findArgs = store.get('findArgs');

    assert.strictEqual(findArgs.length, 1);
    assert.strictEqual(findArgs[0].modelName, 'todo');
    assert.strictEqual(findArgs[0].params.name, 'Adam');
  });

  test('default model name', function (assert) {
    var Route = EmberObject.extend(RouteMixin, {});
    var route = Route.create();

    assert.strictEqual(route._findModelName('route'), 'route');
    assert.strictEqual(route._findModelName('routes'), 'route');
    assert.strictEqual(route._findModelName('route-name'), 'routeName');
    assert.strictEqual(route._findModelName('route-names'), 'routeName');
  });

  test('arguments passed to findPaged', function (assert) {
    var store = MockStore.create();

    var Something = EmberObject.extend(RouteMixin, {});
    var something = Something.create({ store: store });
    something.set('routeName', 'todo');

    something.model({ name: 'Adam' });
    var findArgs = store.get('findArgs');

    assert.strictEqual(findArgs.length, 1);
    assert.strictEqual(findArgs[0].modelName, 'todo');
    assert.strictEqual(findArgs[0].params.name, 'Adam');
  });

  test('can pass param mappings', function (assert) {
    var store = MockStore.create();

    var Something = EmberObject.extend(RouteMixin, {});
    var something = Something.create({ store: store });

    something.findPaged('todo', {}, {}, function (remote) {
      remote.addQueryParamMapping('page', 'current_page');
    });

    //paramMapping: {page: "current_page"}}
    var findArgs = store.get('findArgs');

    assert.strictEqual(findArgs.length, 1);
    assert.strictEqual(findArgs[0].params.current_page, 1);
  });
});
