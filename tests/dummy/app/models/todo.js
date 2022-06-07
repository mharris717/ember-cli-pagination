import Model, { attr } from '@ember-data/model';

export default class RentalModel extends Model {
  @attr('string', { defaultValue: '' }) name;
  @attr('boolean', { defaultValue: false }) completed;   
}
