import Validate from '../validate';
import Util from '../util';

export function getInt (prop) {
  var raw = this.get(prop);
  if (raw === 0 || raw === '0') {
    // do nothing
  } else if (Util.isBlank(raw)) {
    Validate.internalError('no int for ' + prop + ' val is ' + raw);
  }
  return parseInt(raw);
}
