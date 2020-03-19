/* 
todo ES5 的Object.getOwnPropertyDescriptor()方法会返回某个对象属性的描述对象（descriptor）。
todo ES2017 引入了Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象。
*/
const obj = {
    foo: 123,
    get bar() {
        return 'abc'
    }
};

Object.getOwnPropertyDescriptors(obj)
// { foo:
//    { value: 123,
//      writable: true,
//      enumerable: true,
//      configurable: true },
//   bar:
//    { get: [Function: get bar],
//      set: undefined,
//      enumerable: true,
//      configurable: true } }
//*es5;es6的方法转换
function getOwnPropertyDescriptors(obj) {
    const result = {};
    for (let key of Reflect.ownKeys(obj)) {
        result[key] = Object.getOwnPropertyDescriptor(obj, key);
    }
    return result;
}
//todo该方法的引入目的，主要是为了解决Object.assign()无法正确拷贝get属性和set属性的问题。
const source = {
    set foo(value) {
        console.log(value);
    }
};

const target1 = {};
Object.assign(target1, source);

Object.getOwnPropertyDescriptor(target1, 'foo')
// { value: undefined,//!无法拷贝set；因为obbject.assign()不会拷贝它背后的赋值方法或取值方法。
//   writable: true,
//   enumerable: true,
//   configurable: true }
//?这时，Object.getOwnPropertyDescriptors()方法配合Object.defineProperties()方法，就可以实现正确拷贝。
const source = {
    set foo(value) {
        console.log(value);
    }
};

const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
Object.getOwnPropertyDescriptor(target2, 'foo')
// { get: undefined,
//   set: [Function: set foo],
//   enumerable: true,
//   configurable: true }

//?合并为一个函数
const shallowMerge = (target, source) => Object.defineProperties(
    target,
    Object.getOwnPropertyDescriptors(source)
);

//todo Object.getOwnPropertyDescriptors()方法的另一个用处，是配合Object.create()方法，将对象属性克隆到一个新对象。这属于浅拷贝。
const clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
/* 
?Object.create(proto[, propertiesObject]) 解释：；
?proto新创建对象的原型对象
?propertiesObject可选。如果没有指定为 undefined，则是要添加到新创建对象的不可枚举（默认）属性（即其自身定义的属性，而不是其原型链上的枚举属性）
?对象的属性描述符以及相应的属性名称。这些属性对应Object.defineProperties()的第二个参数。
*/
//todo Object.getOwnPropertyDescriptors()方法可以实现一个对象继承另一个对象
//?es5继承一个对象的方法
var prot = {
    foo: 456,
    foo1: 789
}
const obj = {
    __proto__: prot,
    foo: 123,
};
//?es6继承一个对象的方法
const obj = Object.create(prot);
obj.foo = 123;

// 或者

const obj = Object.assign(
    Object.create(prot), {
        foo: 123,
    }
);
//或者 用 Object.getOwnPropertyDescriptors()
const obj = Object.create(
    prot,
    Object.getOwnPropertyDescriptors({
      foo: 123,
    })
  );
