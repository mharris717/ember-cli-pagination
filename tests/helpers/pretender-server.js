import Todo from '../../models/todo';
import Helpers from 'ember-cli-pagination/test-helpers';
import Factory from 'ember-cli-pagination/factory';
import config from '../../config/environment';

var todos = function() {
  var res = [];
  Todo.FIXTURES.forEach(function(todo) {
    res.push(todo);
  });
  return res;
};

export default function() {
  return new Pretender(function() {
    return this.get("/api/todos", function(request) {
      request.queryParams.per_page = request.queryParams.per_page || (config.pagination || {}).perPage;

      var paginationType = "remote";
      if (request.queryParams.page === 'all' || !request.queryParams.page) {
        paginationType = "local";
      }
      else if (request.queryParams.sortByField === 'name') {
        paginationType = 'remote-sorted';
      }

      var getRes = function() {
        if (paginationType === "local") {
          return {
            todos: todos()
          };
        } else if (paginationType === "remote") {
          return Helpers.responseHash(request, todos(), 'todo');
        }
        else if (paginationType === 'remote-sorted') {
          var list = todos();
          // list = _.sortBy(list,function(todo) {
          //   return todo.name;
          // });

          list = list.sort(function(a,b) {
            return a.name.localeCompare(b.name);
          });
          return Helpers.responseHash(request, list, 'todo');
        } else {
          throw "unknown pagination type";
        }
      };
      return [200, {"Content-Type": "application/json"}, JSON.stringify(getRes())];
    });
  });
}
