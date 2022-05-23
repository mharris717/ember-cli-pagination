import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route  {
  @service store;

  beforeModel() {
    var nextId = 0;
    for (var i=0;i<11;i++) {
      this.store.createRecord('todo', {id: nextId++, name: "Clean Gutters "+i, completed: false}).save();
      this.store.createRecord('todo', {id: nextId++, name: "Make Dinner "+i, completed: true}).save();
      this.store.createRecord('todo', {id: nextId++, name: "More Stuff "+i, completed: false}).save();
    }
  }  
}
