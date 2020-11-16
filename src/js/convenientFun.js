

//存放一下自定义的常用便捷方法


/*
* 正则匹配记录状态并点击,自带前后延迟
*
* target - 要点击的控件
* checkRegular 要记录的状态  比如 "确定" 记录确定是否出现或消失
* addTime 点击后的等待时间
* fun  方法 默认为 textMtch   clz  text id 都可以
*
* */


regularClick = function (target, checkRegular, addTime, fun , upLimit, downLimit) {
    if(!fun){fun=textMatch;}
    if (!target) { toastLog("要点击的目标不存在"); return false; }
    addTime = addTime || 0;
    var temp = checkFun(checkRegular);//记录页面变化用
    sleep(random(800, 1500))
    var i = 0,tre=false;
    do {
        tre= target.click();
        sleep(3000 + addTime);
        if (i > 7) { toastLog("点击超时-" + checkRegular); return false; }  //防止死循环
        i++;
    } while (checkFun(checkRegular) == temp&&tre);

    function checkFun(checkRegular) {
        let result = fun(checkRegular).exist();
        return result;
    }

    return tre;
}


//用于列举对象的 属性 和方法
function ShowObjProperty( obj ) {
    // 用来保存所有的属性名称和值
    var attributes = '' ;
    var methods = ''
    // 开始遍历
    for ( var p in obj ){
        // 方法
        if ( typeof( obj[p] ) === "function" ){
            methods += '方法：' + p + '\r\n'
            // obj[p]();
        } else {
            // p 为属性名称，obj[p]为对应属性的值
            attributes += '属性：' + p + " = " + obj[p] + "\r\n" ;
        }
    }
    // 最后显示所有的属性
    logd("方法"+methods);
    logd("属性"+attributes ) ;
}