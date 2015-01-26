import DS from 'ember-data';

var Todo = DS.Model.extend({
  name: DS.attr('string'),
  completed: DS.attr('boolean')
});

var makeFixtures = function() {
  var res = [];

  var nextId = 0;
  for (var i=0;i<11;i++) {
    res.push({id: nextId++, name: "Clean Gutters "+i, completed: false});
    res.push({id: nextId++, name: "Make Dinner "+i, completed: true});
    res.push({id: nextId++, name: "More Stuff "+i, completed: false});
  }

  return res;
};

Todo.reopenClass({
  FIXTURES: makeFixtures()
});

export default Todo;
