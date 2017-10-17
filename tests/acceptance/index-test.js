import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import pretenderServer from '../helpers/pretender-server';

let server = null;

moduleForAcceptance('Acceptance - Todo Index', {
  beforeEach() {
    server = pretenderServer();
  },
  afterEach() {
    server.shutdown();
  }
});

test('Should showo todos', function(assert) {
  assert.expect(1);
  visit("/todos/remote").then(function() {
    assert.equal(find(".todo").length, 10);
  });
});
