// todo 链判断运算符
//?es5
const firstName = (message
    && message.body
    && message.body.user
    && message.body.user.firstName) || 'default';
//?es6
const firstName = message?.body?.user?.firstName || 'default';

//?链判断运算符有三种用法。

obj?.prop // 对象属性
obj?.[expr] // 同上
func?.(...args) // 函数或对象方法的调用