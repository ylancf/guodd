

function myInfoActivity(){

    new CreateImageButton(ui.findViewByTag('myInfo_bt_layout'), function (btn) {
        btn.setText('退出登录');
        btn.setTextColor('#ff4080');
        btn.setPadding(10, 5, 10, 5);
        btn.setTypeface('monospace');
        btn.setTextSize(17);
        //点击事件
        btn.onClick(function (view) {
            toTopEdit.clearFocus();  //使失去聚焦 触发事件
            deleteEdit.clearFocus(); //使失去聚焦 触发事件
            confirm('确定退出应用?').then(value=>{
                if (value) {
                    updateConfig("loginState",false); //保存不登录状态
                    ui.saveAllConfig();
                    android.os.Process.killProcess(android.os.Process.myPid());//结束app
                }
            });
        });
        CreateImageButtonNext(btn,"#00a0ff","#00a0cc");//一半部分
    });


    let toTopEdit=ui.findViewByTag("myself_top_ed");
    let deleteEdit=ui.findViewByTag("myself_delete_ed");
    setEditTextType(toTopEdit,[1,5]);
    setEditTextType(deleteEdit,[1,5]);


    changeShape([toTopEdit,deleteEdit],1,1,"#20ff80");

    toTopEdit.setOnFocusChangeListener({
        onFocusChange: function (view,hasFocus){ //不能使用这里的
            if(!hasFocus){
                myChoose(hasFocus,view,"toTop")
            }
        }
    });
    deleteEdit.setOnFocusChangeListener({
        onFocusChange: function (view,hasFocus){
            myChoose(hasFocus,view,"toDelete")
        }
    });

    ui.findViewByTag("ylan").setOnClickListener({
        onClick: contactQQ
    });
    ui.findViewByTag("gx").setOnClickListener({
        onClick:contactWX
    });

    let pop=null
    ui.findViewByTag("adviceBT").setOnClickListener({
        onClick:()=>{
           if(!pop){pop= new  userAdvicePop()};
            pop.show()
        }
    });


}



//筛选后保存到本地
function myChoose ( hasFocus,view,name){
    if (!hasFocus) {
        let tre = view.getText().toString()+"";// 不知道为什么不是string类型 只能+""使之变成string
        let newList=[];
        if(tre!=""){
            let list=tre.split(/[|｜ ]/);
            list.forEach(x=>{
                if (!isNaN(x)&&x!="") {
                    newList.push(x);
                    logd(newList);
                }
            });
        }
        updateConfig(name,JSON.stringify(newList));
    }
}

myInfoActivity();
