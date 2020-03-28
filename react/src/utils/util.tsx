// 01.秒数转换成00:00:00
export function formatSeconds(value) {
    // console.log('===时间：', value)
    var secondTime = parseInt(value); // 秒
    var minuteTime = 0; // 分
    var hourTime = 0; // 小时
    if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = Math.floor(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = Math.floor(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = Math.floor(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = Math.floor(minuteTime % 60);
        }
    }
    if (minuteTime <= 0) {
        var result =
            "00:00:" +
            (Math.floor(secondTime) <= 9
                ? "0" + Math.floor(secondTime)
                : Math.floor(secondTime));
    } else {
        var result =
            "" +
            (Math.floor(secondTime) <= 9
                ? "0" + Math.floor(secondTime)
                : Math.floor(secondTime));
    }

    if (minuteTime > 0) {
        result =
            "00:" +
            (Math.floor(minuteTime) <= 9
                ? "0" + Math.floor(minuteTime)
                : Math.floor(minuteTime)) +
            ":" +
            result;
    }
    if (hourTime > 0) {
        result =
            "" +
            (Math.floor(hourTime) <= 9
                ? "0" + Math.floor(hourTime)
                : Math.floor(hourTime)) +
            ":" +
            result;
    }
    return result;
}
// 02.时间区段选取
export function timeInterval(type) {
    const dateTime = new Date();
    // console.log('-------------', dateTime)
    switch (type) {
        case 1:
            // console.log(timeForMat(0))
            return timeForMat(0);
        case 2:
            // console.log(timeForMat(1))
            return timeForMat(1);
        case 3:
            // console.log(timeForMat(7))
            return timeForMat(7);
        case 4:
            // console.log(timeForMat(30))
            return timeForMat(30);
        case 30:
            // console.log(timeForMat(30))
            return timeForMat(30);
        case 60:
            // console.log(timeForMat(60))
            return timeForMat(60);
        case 90:
            // console.log(timeForMat(90))
            return timeForMat(90);
        case 180:
            // console.log(timeForMat(180))
            return timeForMat(180);
        default:
            return timeForMat(0);
    }
}

// 时间转换
function timeForMat(count) {
    // 拼接时间
    const time1 = new Date();
    const time2 = new Date();
    if (count === 1) {
        time1.setTime(time1.getTime() - 24 * 60 * 60 * 1000);
    } else {
        if (count >= 0) {
            time1.setTime(time1.getTime());
        } else {
            if (count === -2) {
                time1.setTime(time1.getTime() + 24 * 60 * 60 * 1000 * 2);
            } else {
                time1.setTime(time1.getTime() + 24 * 60 * 60 * 1000);
            }
        }
    }

    const Y1 = time1.getFullYear();
    const M1 =
        time1.getMonth() + 1 > 9
            ? time1.getMonth() + 1
            : "0" + (time1.getMonth() + 1);
    const D1 = time1.getDate() > 9 ? time1.getDate() : "0" + time1.getDate();
    const timer1 = Y1 + "" + M1 + "" + D1;

    time2.setTime(time2.getTime() - 24 * 60 * 60 * 1000 * count);
    const Y2 = time2.getFullYear();
    const M2 =
        time2.getMonth() + 1 > 9
            ? time2.getMonth() + 1
            : "0" + (time2.getMonth() + 1);
    const D2 = time2.getDate() > 9 ? time2.getDate() : "0" + time2.getDate();
    const timer2 = Y2 + "" + M2 + "" + D2;
    const timeObj = {
        start_date: timer2,
        end_date: timer1
    };
    return timeObj;
}

export function BraftEditorIMG(editorState){//富文本图片添加最大宽度
    let State =  editorState.replace(/<img[^>]*>/gi, function (match, capture) {
        return match.replace(/(i?)(\<img)(?!(.*?style=['\"](.*)['\"])[^\>]+\>)/ig, '$2 style=""$3') //为没有style的 img属性加上style
    })
    return State.replace(/(i?)(\<img.*?style=['\"])([^\>]+\>)/ig, "$2 display:block;max-width:100%;height:auto; $3")
} 

// 获取参数
export function getUrlValue(kValue) {
    var url = window.location.href; //当前页面的地址
    var reg = /([^?&=]+)=([^?&=]+)/g,
        obj = {},
        str = url;
    url.replace(reg, function (): any {
        obj[arguments[1]] = arguments[2];
    });
    for (var keyName in obj) {
        if (keyName == kValue) {
            return obj[keyName];
            // break;
        }
    }
}

/**
* @description 获取上一个月，上一个周，昨天的方法,返回一个数组，为所要日期的开始日期-结束日期
* @param {string} type 要获取的类型，可能的值有:month,week,day
*/
export function formatData(type) {
    let month = new Date().getMonth() || 12,   //当前月份的上个月
        years = new Date().getFullYear(),
        day = new Date().getDate(),
        week = new Date().getDay(),
        hasLeap = years % 4 === 0 && years % 100 !== 0 || years % 400 === 0,  //判断是否是闰年
        bigMonthList = [1, 3, 5, 7, 8, 10, 12];
    let typeObj = {
        month: () => { //如果是月份执行的函数
            if (bigMonthList.some((ele) => {
                return ele === month
            })) {
                if (month === 12) {
                    return [`${years - 1}1201`, `${years - 1}1231`]
                } else {
                    return [`${years}${month < 10 ? '0' + month : month}01`, `${years}${month < 10 ? '0' + month : month}31`]
                }
            } else if (month === 2) {
                if (hasLeap) {
                    return [`${years}${month < 10 ? '0' + month : month}01`, `${years}${month < 10 ? '0' + month : month}28`]
                }
                return [`${years}${month < 10 ? '0' + month : month}01`, `${years}${month < 10 ? '0' + month : month}29`]
            }
            return [`${years}${month < 10 ? '0' + month : month}01`, `${years}${month < 10 ? '0' + month : month}30`]
        },
        week: () => { //如果是周执行的函数
            let endDate = new Date(new Date().getTime() - (week || 7) * 24 * 3600 * 1000)
            let startDate = new Date(new Date().getTime() - (6 + (week || 7)) * 24 * 3600 * 1000)
            return [
                `${startDate.getFullYear()}${startDate.getMonth() + 1 < 10 ? '0' + (startDate.getMonth() + 1) : (startDate.getMonth() + 1)}${startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate()}`,
                `${endDate.getFullYear()}${endDate.getMonth() + 1 < 10 ? '0' + (endDate.getMonth() + 1) : (endDate.getMonth() + 1)}${endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate()}`
            ]
        },
        day: () => {  //如果是日执行的函数
            let newMonth = month + 1 === 13 ? 1 : month + 1, newDay = day - 1;
            return [
                `${years}${newMonth < 10 ? '0' + newMonth : newMonth}${newDay < 10 ? '0' + newDay : newDay}`,
                `${years}${newMonth < 10 ? '0' + newMonth : newMonth}${newDay < 10 ? '0' + newDay : newDay}`
            ]
        }
    }
    return typeObj[type]()
}


/**
 *  异步处理 无需try-catch
 * @param {Promise} promise
 */
export function to(promise: Promise<any>): Promise<any> {
    return promise
        .then(function (res) {
            return [null, res]
        })
        .catch(function (err) {
            return [err, null]
        })
}


// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
export function formatDateStr(date, fmt = 'yyyy-MM-dd hh:mm:ss') { //author: meizz   
    if (!(date instanceof Date)) return ''
    var o = {
        "M+": date.getMonth() + 1, //月份   
        "d+": date.getDate(), //日   
        "h+": date.getHours(), //小时   
        "m+": date.getMinutes(), //分   
        "s+": date.getSeconds(), //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}