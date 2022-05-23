import { get } from '@ember/object';
import DS from 'ember-data';

export function initialize(/* application */) {
  //ember-data 3-3.12 has a bug that results in an explosive dependency update issue on application destroy
  //this work around fixes that 'infinite' loop
  if (DS.VERSION.match(/^3\.(\d|1[012])(\..*)?$/)) {
    DS.RecordArray.reopen({
      _removeInternalModels(internalModels) {
        if (!this.isDestroying)
          this.content.removeObjects(internalModels);
      }
    })
  }
}

export default {
  initialize
};
