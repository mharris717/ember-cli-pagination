import Todo from '../../models/todo';
import Helpers from 'ember-cli-pagination/test-helpers';
import Factory from 'ember-cli-pagination/factory';
import config from '../../config/environment';
var c, todos;

todos = function() {
  return Todo.FIXTURES;
};

c = function() {
  var server;
  return server = new Pretender(function() {
    return this.get("/todos", function(request) {
      var paginationType, res;
      request.queryParams.per_page = request.queryParams.per_page || (config.pagination || {}).perPage;
      paginationType = Factory.create({
        config: config
      }).paginationType();
      res = (function() {
        if (paginationType === "local") {
          return {
            todos: todos()
          };
        } else if (paginationType === "remote") {
          return Helpers.responseHash(request, todos(), 'todo');
        } else {
          throw "unknown pagination type";
        }
      })();
      return [
        200, {
          "Content-Type": "application/json"
        }, JSON.stringify(res)
      ];
    });
  });
};

export default c;
