/* 
todo finally方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是fulfilled还是rejected。
todo 这表明，finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。
*/
promise
.finally(() => {
  // 语句
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);