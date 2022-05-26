import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteMixin from 'ember-cli-pagination/remote/route-mixin';

const RouteMixed = Route.extend(RouteMixin);

export default class SecretRoute extends RouteMixed {
  @service store;

  model(params) {
    return this.findPaged('todo', params, { zeroBasedIndex: false });
  }
}
