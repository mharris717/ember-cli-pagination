`import Ember from 'ember'`
`import DivideIntoPages from 'ember-cli-pagination/divide-into-pages'`

module 'Integration - Pagination',
  setup: -> 
    console.debug "setup"

test "stuff", ->
  equal 2,2

EvenObserver = Ember.Object.extend
  arrayWillChange: (observedObj, start, removeCount, addCount) ->
    console.debug "arrayWillChange observedObj: #{observedObj} #{start}"

  arrayDidChange: (observedObj, start, removeCount, addCount) ->
    console.debug "arrayDidChange observedObj: #{observedObj} #{start}"
    obj = observedObj[start]
    if obj%2 == 0
      @parent.triggerObservers(observedObj, start, removeCount, addCount)


EvenArray = Ember.Object.extend
  observers: []
  
  init: ->
    @all.addArrayObserver(EvenObserver.create(parent: this))

  forEach: (f) ->
    for num in @all
      if num%2 == 0
        f(num)

  addArrayObserver: (target) ->
    @observers.push(target)

  triggerObservers: (observedObj, start, removeCount, addCount) ->
    @observers.forEach (o) -> o.arrayDidChange(observedObj, start, removeCount, addCount)

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
  nums = Ember.A([1,2,3,4,5])
  even = EvenArray.create(all: nums)
  equalArray even,[2,4]

test 'forEach up to date when all changes', ->
  nums = Ember.A([1,2,3,4,5])
  even = EvenArray.create(all: nums)

  nums.push(8)

  equalArray even,[2,4,8]

MyObserver = Ember.Object.extend
  arrayWillChangeCount: 0
  arrayDidChangeCount: 0

  arrayWillChange: (observedObj, start, removeCount, addCount) ->
    @arrayWillChangeCount += 1

  arrayDidChange: (observedObj, start, removeCount, addCount) ->
    @arrayDidChangeCount += 1


test 'observer of EvenArray is updated', ->
  observer = MyObserver.create()
  nums = Ember.A([1,2,3,4,5])
  even = EvenArray.create(all: nums)

  even.addArrayObserver(observer)

  nums.pushObject(8)
  equal observer.get('arrayDidChangeCount'),1

test 'observer of EvenArray is not updated on odd', ->
  observer = MyObserver.create()
  nums = Ember.A([1,2,3,4,5])
  even = EvenArray.create(all: nums)

  even.addArrayObserver(observer)

  nums.pushObject(9)
  equal observer.get('arrayDidChangeCount'),0


PagedArray = Ember.Object.extend
  perPage: 2
  page: 1

  forEach: (f) ->
    DivideIntoPages.create(all: @all, perPage: @perPage).objsForPage(1).forEach(f)

test 'PagedArray basic', ->
  nums = [1,2,3,4,5]
  paged = PagedArray.create(all: nums)
  equalArray paged, [1,2]

