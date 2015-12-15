import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
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
