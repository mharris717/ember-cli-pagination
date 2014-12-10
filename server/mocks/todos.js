var makeAllFixtures = function() {
  var res = [];

  var nextId = 0;
  for (var i=0;i<11;i++) {
    res.push({id: nextId++, name: "Clean Gutters "+i, completed: false});
    res.push({id: nextId++, name: "Make Dinner "+i, completed: true});
    res.push({id: nextId++, name: "More Stuff "+i, completed: false});
  }

  return res;
};

var makeDivide = function() {
  return {
    get: function(k) {
      return this[k];
    },

    set: function(k,v) {
      this[k] = v;
    },

    objsForPage: function(page) {
      var range = this.range(page);
      return this.get('all').slice(range.start,range.end+1);
    },

    totalPages: function() {
      var allLength = parseInt(this.get('all').length);
      var perPage = parseInt(this.get('perPage'));
      return Math.ceil(allLength/perPage);
    },

    range: function(page) {
      var perPage = parseInt(this.get('perPage'));
      var s = (parseInt(page) - 1) * perPage;
      var e = s + perPage - 1;

      return {start: s, end: e};
    }
  };
};

var makePagedResponse = function(page) {
  var all = makeAllFixtures();
  var divide = makeDivide();
  divide.set('page',1);
  divide.set('perPage',10);
  divide.set('all',all);

  var objs = divide.objsForPage(page);
  var totalPages = divide.totalPages();

  return {
    "todos": objs, 
    "meta": {
      "total_pages": totalPages
    }
  };
};

var makeResponse = function(req) {
  if (req.query.page && req.query.page != 'all') {
    return makePagedResponse(req.query.page);
  }
  else {
    return {
      "todos": makeAllFixtures()
    };
  }
};

module.exports = function(app) {
  var express = require('express');
  var todosRouter = express.Router();

  todosRouter.get('/', function(req, res) {
    res.send(makeResponse(req));
  });

  todosRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  todosRouter.get('/:id', function(req, res) {
    res.send({
      "todos": {
        "id": req.params.id
      }
    });
  });

  todosRouter.put('/:id', function(req, res) {
    res.send({
      "todos": {
        "id": req.params.id
      }
    });
  });

  todosRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/todos', todosRouter);
};
