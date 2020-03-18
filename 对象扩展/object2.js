//todo 属性名表达式
// 方法一
obj.foo = true;

// 方法二
obj['a' + 'bc'] = 123;
/* 
!但是，如果使用字面量方式定义对象（使用大括号），在 ES5 中只能使用方法一（标识符）定义属性。
*/
var obj = {
    foo: true,
    abc: 123
  };
/* 
?ES6 允许字面量定义对象时，用方法二（表达式）作为对象的属性名，即把表达式放在方括号内。
*/
let propKey = 'foo';

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};