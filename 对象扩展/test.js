const proto = {
    foo: 'hello',
    foo1:"惊呆了"
  };
  
  const obj = {
    foo: 'world',
    foo2:"原来如此",
    find() {
        console.log(Object.getPrototypeOf(this));
      //return Object.getPrototypeOf(this).foo;
    }
  };
  
  Object.setPrototypeOf(obj, proto);//
  //console.log(obj.__proto__ ===proto)
   // "hello"
 console.log(obj.find())
 /* const proto = {
    x: 'hello',
    foo() {
      console.log(this);
    },
  };
  
  const obj = {
    x: 'world',
    foo() {
        Object.getPrototypeOf(this).foo.call(this)//返回给定对象也就是这里的this原型的foo方法,并绑定this指向
    }
  }
  
  Object.setPrototypeOf(obj, proto);
  
  obj.foo() // "world" */