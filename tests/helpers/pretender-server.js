import Todo from '../../models/todo';
import Helpers from 'ember-cli-pagination/test-helpers';
var c, todos;

todos = function() {
  return Todo.FIXTURES;
};

c = function() {
  var server;
  return server = new Pretender(function() {
    return this.get("/todos", function(request) {
      var res;
      res = Helpers.responseHash(request, todos(), 'todo');
      return [
        200, {
          "Content-Type": "application/json"
        }, JSON.stringify(res)
      ];
    });
  });
};

export default c;
