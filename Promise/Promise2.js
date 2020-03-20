const promise = new Promise(function(resolve, reject) {
    throw new Error('test');
  });
  promise.catch(function(error) {
    console.log(error);
  });
  // Error: test
  // todo上面代码中，promise抛出一个错误，就被catch方法指定的回调函数捕获。注意，上面的写法与下面两种写法是等价的。
  
  // 写法一
  const promise = new Promise(function(resolve, reject) {
    try {
      throw new Error('test');
    } catch(e) {
      reject(e);
    }
  });
  promise.catch(function(error) {
    console.log(error);
  });
  
  // 写法二
  const promise = new Promise(function(resolve, reject) {
    reject(new Error('test'));
  });
  promise.catch(function(error) {
    console.log(error);
  });