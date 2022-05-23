import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('todos', function() {
    this.route('infinite');
    this.route('infinite-remote');
    this.route('remote');
    this.route('local');
    this.route('remote-sorted');
  });
});