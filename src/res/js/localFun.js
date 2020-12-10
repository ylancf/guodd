
//联系qq
function contactQQ(v){
    let qq=v.getText()+"";
    utils.setClipboardText(qq);
   if(utils.isAppExist("com.tencent.mobileqq")){
       confirm("已复制,是否现在打开QQ?").then((result)=>{
           if(result){
               utils.openActivity({
                   action: "android.intent.action.VIEW",
                   uri:"mqqwpa://im/chat?chat_type=wpa&uin=" + qq,
                   packageName: "com.tencent.mobileqq",
               });
           }
       })
   }else{
       toast("复制QQ成功");
   }
}

//联系微信
function contactWX(v){
    let vx=v.getText()+"";
    utils.setClipboardText(vx);
    if(utils.isAppExist("com.tencent.mobileqq")){
        confirm("已复制,是否现在打开微信?").then((result)=>{
            if(result){
               utils.openApp("com.tencent.mm");
            }
        })
    }else{
        toast("复制微信成功");
    }
}

//给服务器发送消息
function sendAdviceMsg(msg,userName){

    if(!msg||msg.length==0){ return  false ;}
    //mysql 的地址
    let mysqlUrl ="jdbc:mysql://116.62.46.10:3306/test?characterEncoding=utf8&autoReconnect=true"
    let inited = jdbc.init("com.mysql.jdbc.Driver",mysqlUrl,"root","Wl2016822");
    logd("inited "+inited);
    let conn = jdbc.connect();
    logd("connect "+conn);
    if (!conn) {
        logd(jdbc.getLastError());
        return  false;
    }
    //插入数据
   let q = "insert userAdvice(`userMsg`,`userName`)values(?,?);"
   let qur = jdbc.createPreparedStatement(q)
    if (qur) {
        //设置第一个索引的参数
        jdbc.psqlSetString(1,msg);
        //设置第二个索引参数
        jdbc.psqlSetString(2,userName);
    }
    let rowcount = jdbc.psqlExecuteUpdate();
    logi("插入语句执行影响行数 -> " + rowcount);
    if (rowcount<=0) {
        loge("插入错误: "+jdbc.getLastError())
    }
    jdbc.connectionClose();
    return  rowcount>0;

}