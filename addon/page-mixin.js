import Mixin from '@ember/object/mixin';

export default Mixin.create({
  getPage: function () {
    return parseInt(this.page || 1);
  },

  getPerPage: function () {
    return parseInt(this.perPage);
  },
});
