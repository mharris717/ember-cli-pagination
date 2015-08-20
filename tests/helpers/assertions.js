import Ember from 'ember';

var f = function() {
  Ember.Test.registerAsyncHelper('hasActivePage', function(app, assert, num, context) {
    var i = 0;
    findWithAssert(".pagination li.page-number", context).each(function() {
      var li = $(this);
      var active = num - 1 === i;
      assert.equal(li.hasClass('active'), active, "Page "+(i+1)+" should have active = "+active+", actual: "+li.hasClass('active'));
      i += 1;
    });
  });

  Ember.Test.registerAsyncHelper('hasButtons', function(app, assert, ops, context) {
    for (var name in ops) {
      var present = ops[name];

      if(present) {
        assert.equal(find(".pagination ." + name + ".enabled-arrow").length, 1);
      } else {
        assert.equal(find(".pagination ." + name + ".disabled").length, 1);
      }
    }
  });

  Ember.Test.registerAsyncHelper('hasTodos', function(app, assert, l, context) {
    assert.equal(find("table tr.todo").length, l);
  });

  Ember.Test.registerAsyncHelper('hasTodo', function(app, assert, num, name, context) {
    assert.equal(find("table tr.todo:eq("+num+") td.name").text().trim(), name);
  });

  Ember.Test.registerAsyncHelper('hasPages', function(app, assert, l, context) {
    assert.equal(find(".pagination li.page-number").length, l);
  });

  Ember.Test.registerAsyncHelper('clickPage', function(app, i, context) {
    if (i === "prev" || i === "next") {
      click(".pagination ." + i + " a");
    } else {
      click(".pagination li.page-number:eq(" + (i - 1) + ") a");
    }
  });
};

f();

export default f;
