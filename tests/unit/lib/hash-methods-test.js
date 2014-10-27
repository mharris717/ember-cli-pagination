import Util from 'ember-cli-pagination/util';
import toArray from '../../helpers/to-array';
import equalArray from '../../helpers/equal-array';

module("Hash Methods");

test("hash property explore", function() {
  var params = {page: 1, name: "Adam"};
  var keys = Util.keysOtherThan(params,["page","perPage"]);
  equalArray(keys,["name"]);

  var other = Util.paramsOtherThan(params,["page","perPage"]);
  deepEqual(other,{name: "Adam"});
});