// import config from '../config/environment';
// import Factory from 'ember-cli-pagination/factory';

// export default Ember.Route.extend(Factory.routeMixin(config), {
//   model: function(params) {
//     var paged = this.findPaged('todo',params);
//     paged.lockToRange();
//     return paged;
//   }
// });

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SecretRoute extends Route {
  @service store;
  
}