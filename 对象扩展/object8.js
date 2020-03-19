//todo Null 判断运算符
//!属性的值为null或undefined，默认值就会生效，但是属性的值如果为空字符串或false或0，默认值也会生效。
const headerText = response.settings.headerText || 'Hello, world!';
//!默认值只有在属性值为null或undefined时，才会生效。
const headerText = response.settings.headerText ?? 'Hello, world!';
//!这个运算符的一个目的，就是跟链判断运算符?.配合使用，为null或undefined的值设置默认值。
const animationDuration = response.settings?.animationDuration ?? 300;