`import DS from 'ember-data'`

Todo = DS.Model.extend 
  name: DS.attr('string')
  completed: DS.attr('boolean')

Todo.reopenClass
  FIXTURES: [
    {id: 1, name: "Clean Gutters", completed: false}
    {id: 2, name: "Make Dinner", completed: true}
    {id: 3, name: "More Stuff", completed: false}
  ]

`export default Todo`
