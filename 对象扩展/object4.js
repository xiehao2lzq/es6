/* 
todo 对象的每个属性都有一个描述对象（Descriptor），
todo 用来控制该属性的行为。Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。
*/
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,//?数据值
//    writable: true,//?是否可以修改
//    enumerable: true,//?是否可以枚举
//    configurable: true//?是否可以用delete删除
//  }
/* 
!目前，有四个操作会忽略enumerable为false的属性。

?for...in循环：只遍历对象自身的和继承的可枚举的属性。
?Object.keys()：返回对象自身的所有可枚举的属性的键名。
?JSON.stringify()：只串行化对象自身的可枚举的属性。
?Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。
?这四个操作之中，前三个是 ES5 就有的，最后一个Object.assign()是 ES6 新增的。
!其中，只有for...in会返回继承的属性，其他三个方法都会忽略继承的属性，只处理对象自身的属性。
?实际上，引入“可枚举”（enumerable）这个概念的最初目的，就是让某些属性可以规避掉for...in操作，
?不然所有内部属性和方法都会被遍历到。比如，对象原型的toString方法，以及数组的length属性，就通过“可枚举性”，
?从而避免被for...in遍历到。
*/

Object.getOwnPropertyDescriptor(Object.prototype, 'toString').enumerable
// false

Object.getOwnPropertyDescriptor([], 'length').enumerable
// false
//!另外，ES6 规定，所有 Class 的原型的方法都是不可枚举的。
Object.getOwnPropertyDescriptor(class {foo() {}}.prototype, 'foo').enumerable
//false
/* 
!总的来说，操作中引入继承的属性会让问题复杂化，大多数时候，我们只关心对象自身的属性。
!所以，尽量不要用for...in循环，而用Object.keys()代替。
*/

// todo ES6 一共有 5 种方法可以遍历对象的属性。
/* 
?（1）for...in

?for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

?（2）Object.keys(obj)

?Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

?（3）Object.getOwnPropertyNames(obj)

?Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

?（4）Object.getOwnPropertySymbols(obj)

?Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。

?（5）Reflect.ownKeys(obj)

?Reflect.ownKeys返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。
*/
/*
!以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

?首先遍历所有数值键，按照数值升序排列。
?其次遍历所有字符串键，按照加入时间升序排列。
?最后遍历所有 Symbol 键，按照加入时间升序排列。
 */