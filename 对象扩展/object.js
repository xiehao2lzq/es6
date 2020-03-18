//?简洁语法
const foo = 'bar';
const baz = {
    foo
};
baz // {foo: "bar"}

// 等同于
const baz = {
    foo: foo
};

function f(x, y) {
    return {
        x,
        y
    };
}

// 等同于

function f(x, y) {
    return {
        x: x,
        y: y
    };
}

f(1, 2) // Object {x: 1, y: 2}

//?除了属性简写，方法也可以简写。

const o = {
  method() {
    return "Hello!";
  }
};

// 等同于

const o = {
  method: function() {
    return "Hello!";
  }
};

//?属性的赋值器（setter）和取值器（getter），事实上也是采用这种写法。
const cart = {
    _wheels: 4,
  
    get wheels () {
      return this._wheels;
    },
  
    set wheels (value) {
      if (value < this._wheels) {
        throw new Error('数值太小了！');
      }
      this._wheels = value;
    }
  }

//!注意，简写的对象方法不能用作构造函数，会报错。

const obj = {
    f() {
      this.foo = 'bar';
    }
  };
  
  new obj.f() // 报错