import Mixin from '@ember/object/mixin';

export default Mixin.create({
  findPaged: function (name) {
    return this.store.find(name);
  },
});
