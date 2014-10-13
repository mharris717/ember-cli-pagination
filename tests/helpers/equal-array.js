import toArray from './to-array';

export default function(a,b) {
  a = toArray(a);
  b = toArray(b);

  deepEqual(a,b);
}
