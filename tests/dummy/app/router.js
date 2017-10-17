import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('todos', function() {
    this.route('infinite');
    this.route('infinite-remote');
    this.route('remote');
    this.route('local');
    this.route('remote-sorted');
  });
});

export default Router;
