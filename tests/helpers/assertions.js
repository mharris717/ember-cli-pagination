import Ember from 'ember';

var f = function() {
  Ember.Test.registerAsyncHelper('hasActivePage', function(app, num, context) {
    var i = 0;
    findWithAssert(".pagination li.page-number", context).each(function() {
      var li = $(this);
      var active = num - 1 === i;
      equal(li.hasClass('active'), active, "Has active page");
      i += 1;
    });
  });
  
  Ember.Test.registerAsyncHelper('hasButtons', function(app, ops, context) {
    for (var name in ops) {
      var present = ops[name];

      if(present) {
        equal(find(".pagination ." + name + ".enabled-arrow").length, 1);
      } else {
        equal(find(".pagination ." + name + ".disabled").length, 1);
      }
    }
  });

  Ember.Test.registerAsyncHelper('hasTodos', function(app, l, context) {
    equal(find("table tr.todo").length, l);
  });

  Ember.Test.registerAsyncHelper('hasPages', function(app, l, context) {
    equal(find(".pagination li.page-number").length, l);
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