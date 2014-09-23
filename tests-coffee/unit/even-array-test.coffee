`import Ember from 'ember'`
`import DivideIntoPages from 'ember-cli-pagination/divide-into-pages'`

observer = null
nums = null
even = null

module 'Integration - Pagination', 
  setup: ->
    observer = MyObserver.create()
    nums = Ember.A([1,2,3,4,5])
    even = EvenArray.create(all: nums)
    even.addArrayObserver(observer)

  tearDown: ->
    observer = null
    nums = null
    even = null


FilteredObserver = Ember.Object.extend
  arrayWillChange: (observedObj, start, removeCount, addCount) ->
    @parent.triggerObservers('arrayWillChange',observedObj, start, removeCount, addCount)

  arrayDidChange: (observedObj, start, removeCount, addCount) ->
    for i in [start...(start+addCount)]
      obj = observedObj[i]
      if @parent.filterFunc(obj,i)
        @parent.triggerObservers('arrayDidChange',observedObj, i, 0, 1)


FilteredArray = Ember.Object.extend
  observers: []

  init: ->
    @all.addArrayObserver(FilteredObserver.create(parent: this))

  forEach: (f) ->
    i = 0
    for num in @all
      if @filterFunc(num,i)
        f(num)
      i += 1

  addArrayObserver: (target) ->
    @observers.push(target)

  triggerObservers: (method, observedObj, start, removeCount, addCount) ->
    @observers.forEach (o) -> o[method](observedObj, start, removeCount, addCount)

EvenArray = FilteredArray.extend
  filterFunc: (num) -> num%2 == 0

MyObserver = Ember.Object.extend
  arrayWillChangeCount: 0
  arrayDidChangeCount: 0

  arrayWillChange: (observedObj, start, removeCount, addCount) ->
    @arrayWillChangeCount += 1

  arrayDidChange: (observedObj, start, removeCount, addCount) ->
    @arrayDidChangeCount += 1

to_a = (arr) ->
  res = []
  arr.forEach (x) -> res.push(x)
  res

equalArray = (a,b) ->
  a = to_a(a) if a.forEach
  b = to_a(b) if b.forEach

  equal a.length,b.length
  i = 0
  while i < a.length
    equal a[i],b[i]
    i += 1

test 'basic', ->
  equalArray even,[2,4]

test 'forEach up to date when all changes', ->
  nums.pushObject(8)
  equalArray even,[2,4,8]

test 'observer of EvenArray is updated', ->
  nums.pushObject(8)
  equal observer.get('arrayDidChangeCount'),1

test 'observer of EvenArray is not updated on odd', ->
  nums.pushObject(9)
  equal observer.get('arrayDidChangeCount'),0

test 'filtered array with max size', ->
  observer = MyObserver.create()
  nums = Ember.A([1,2,3,4,5])
  even = FilteredArray.create(all: nums, filterFunc: (num,i) -> i <= 3)
  even.addArrayObserver(observer)

  equalArray even,[1,2,3,4]

  nums.pushObject(9)
  equalArray even,[1,2,3,4]

test 'filtered array with max size 2', ->
  observer = MyObserver.create()
  nums = Ember.A([1,2,3,4,5])
  even = FilteredArray.create(all: nums, filterFunc: (num,i) -> i <= 5)
  even.addArrayObserver(observer)

  equalArray even,[1,2,3,4,5]

  nums.pushObject(6)
  equal observer.get('arrayDidChangeCount'),1

  nums.pushObject(7)
  equal observer.get('arrayDidChangeCount'),1

test 'observer updates when multiple pushed at once', ->
  nums.pushObjects([8,10])
  equal observer.get('arrayDidChangeCount'),2


test 'make FilteredArray on the fly', ->
  observer = MyObserver.create()
  nums = Ember.A([1,2,3,4,5])
  even = FilteredArray.create(all: nums, filterFunc: (num) -> num >= 3)

  even.addArrayObserver(observer)

  equalArray even,[3,4,5]

  nums.pushObject(-4)
  equal observer.get('arrayDidChangeCount'),0

  nums.pushObject(8)
  equal observer.get('arrayDidChangeCount'),1
  equalArray even,[3,4,5,8]




PagedArray = Ember.Object.extend
  perPage: 2
  page: 1

  forEach: (f) ->
    DivideIntoPages.create(all: @all, perPage: @perPage).objsForPage(1).forEach(f)

test 'PagedArray basic', ->
  nums = [1,2,3,4,5]
  paged = PagedArray.create(all: nums)
  equalArray paged, [1,2]

