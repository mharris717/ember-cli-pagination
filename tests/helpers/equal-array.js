import toArray from './to-array';

export default function(assert,a,b) {
  a = toArray(a);
  b = toArray(b);

  assert.deepEqual(a,b);
}
