import _ from 'lodash';

var a = 0
_.each([1, 2, 3], (item) => {
  a += item;
  console.log(a);
});