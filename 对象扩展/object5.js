//todo 我们知道，this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。
const proto = {
    foo: 'hello'
  };
  
  const obj = {
    foo: 'world',
    find() {
      return super.foo;//*相当于es5的Object.getPrototypeOf(this)，此方法获取this的原型对象
    }
  };
  
  Object.setPrototypeOf(obj, proto);//*此处的意思为将proto设置为obj的新原型对象
  /* 
  !JavaScript 引擎内部，super.foo等同于Object.getPrototypeOf(this).foo（属性）；super.foo()等同于Object.getPrototypeOf(this).foo.call(this)（方法）。
  */
  obj.find() // "hello"

  const proto = {
    x: 'hello',
    foo() {
      console.log(this);
    },
  };
  
  const obj = {
    x: 'world',
    foo() {
        super.foo;//?Object.getPrototypeOf(this).foo.call(this)
        //!返回给定对象也就是这里的this的原型对象的foo方法,并绑定this指向；这里this指向obj对象
    }
  }
  
  Object.setPrototypeOf(obj, proto);
  
  obj.foo() // "world"