/* 
todo Promise 实例具有then方法，也就是说，then方法是定义在原型对象Promise.prototype上的。
todo 它的作用是为 Promise 实例添加状态改变时的回调函数。
todo 前面说过，then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。
*/

//?then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。
//?因此可以采用链式写法，即then方法后面再调用另一个then方法。

getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
});
/* 
?采用链式的then，可以指定一组按照次序调用的回调函数。
?这时，前一个回调函数，有可能返回的还是一个Promise对象（即有异步操作），
?这时后一个回调函数，就会等待该Promise对象的状态发生变化，才会被调用。 
*/

getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function (comments) {
  console.log("resolved: ", comments);
}, function (err){
  console.log("rejected: ", err);
});
/* 上面代码中，第一个then方法指定的回调函数，返回的是另一个Promise对象。
这时，第二个then方法指定的回调函数，就会等待这个新的Promise对象状态发生变化。
如果变为resolved，就调用第一个回调函数，如果状态变为rejected，就调用第二个回调函数。 */