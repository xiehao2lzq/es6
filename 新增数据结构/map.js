//todo 实例的属性和操作方法
//?Map 结构的实例有以下属性和操作方法。

//?（1）size 属性

//?size属性返回 Map 结构的成员总数。

const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
//?（2）Map.prototype.set(key, value)

//?set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。

const m = new Map();

m.set('edition', 6)        // 键是字符串
m.set(262, 'standard')     // 键是数值
m.set(undefined, 'nah')    // 键是 undefined
//?set方法返回的是当前的Map对象，因此可以采用链式写法。

let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
//?（3）Map.prototype.get(key)

//?get方法读取key对应的键值，如果找不到key，返回undefined。

const m = new Map();

const hello = function() {console.log('hello');};
m.set(hello, 'Hello ES6!') // 键是函数

m.get(hello)  // Hello ES6!
//todo（4）Map.prototype.has(key)

//?has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。

const m = new Map();

m.set('edition', 6);
m.set(262, 'standard');
m.set(undefined, 'nah');

m.has('edition')     // true
m.has('years')       // false
m.has(262)           // true
m.has(undefined)     // true
//todo（5）Map.prototype.delete(key)

//?delete方法删除某个键，返回true。如果删除失败，返回false。

const m = new Map();
m.set(undefined, 'nah');
m.has(undefined)     // true

m.delete(undefined)
m.has(undefined)       // false
//todo（6）Map.prototype.clear()

//?clear方法清除所有成员，没有返回值。

let map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
map.clear()
map.size // 0

/* 
todo Map 结构原生提供三个遍历器生成函数和一个遍历方法。

todo Map.prototype.keys()：返回键名的遍历器。
todo Map.prototype.values()：返回键值的遍历器。
todo Map.prototype.entries()：返回所有成员的遍历器。
todo Map.prototype.forEach()：遍历 Map 的所有成员。
todo 需要特别注意的是，Map 的遍历顺序就是插入顺序。
*/

const map = new Map([
    ['F', 'no'],
    ['T',  'yes'],
  ]);
  
  for (let key of map.keys()) {
    console.log(key);
  }
  // "F"
  // "T"
  
  for (let value of map.values()) {
    console.log(value);
  }
  // "no"
  // "yes"
  
  for (let item of map.entries()) {
    console.log(item[0], item[1]);
  }
  // "F" "no"
  // "T" "yes"
  
  // 或者
  for (let [key, value] of map.entries()) {
    console.log(key, value);
  }
  // "F" "no"
  // "T" "yes"
  
  // 等同于使用map.entries()
  for (let [key, value] of map) {
    console.log(key, value);
  }
  // "F" "no"
  // "T" "yes"
  //todo 上面代码最后的那个例子，表示 Map 结构的默认遍历器接口（Symbol.iterator属性），就是entries方法。
  map[Symbol.iterator] === map.entries
// true
//todo Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）。

const map = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
  ]);
  
  [...map.keys()]
  // [1, 2, 3]
  
  [...map.values()]
  // ['one', 'two', 'three']
  
  [...map.entries()]
  // [[1,'one'], [2, 'two'], [3, 'three']]
  
  [...map]
  // [[1,'one'], [2, 'two'], [3, 'three']]
  //todo 结合数组的map方法、filter方法，可以实现 Map 的遍历和过滤（Map 本身没有map和filter方法）。
  const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
// 产生 Map 结构 {1 => 'a', 2 => 'b'}

const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
    );
// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
//?此外，Map 还有一个forEach方法，与数组的forEach方法类似，也可以实现遍历。
map.forEach(function(value, key, map) {
    console.log("Key: %s, Value: %s", key, value);
  });
  //?forEach方法还可以接受第二个参数，用来绑定this。
  
  const reporter = {
    report: function(key, value) {
      console.log("Key: %s, Value: %s", key, value);
    }
  };
  
  map.forEach(function(value, key, map) {
    this.report(key, value);
  }, reporter);
  //!上面代码中，forEach方法的回调函数的this，就指向reporter。
  //todo 与其他数据结构的互相转换
  //?（1）Map 转为数组

//?前面已经提过，Map 转为数组最方便的方法，就是使用扩展运算符（...）。

const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
//?（2）数组 转为 Map

//?将数组传入 Map 构造函数，就可以转为 Map。

new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
//?（3）Map 转为对象

如果所有 Map 的键都是字符串，它可以无损地转为对象。

function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
// { yes: true, no: false }
//!如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。