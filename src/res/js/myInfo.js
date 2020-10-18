

function myInfoActivity(){

    new CreateImageButton(ui.findViewByTag('myInfo_bt_layout'), function (btn) {
        btn.setText('退出登录');
        btn.setTextColor('#ff4080');
        btn.setPadding(10, 5, 10, 5);
        btn.setTypeface('monospace');
        btn.setTextSize(17)
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
    setEditTextType("myself_top_ed",[1,5]);
    setEditTextType("myself_delete_ed",[1,5]);
    let dp1 = dp2px(1);
    //设置输入框的形状
    var states = [[android.R.attr.state_focused], [-android.R.attr.state_focused]];
    var top_sld = new StateListDrawable();
    top_sld.addState(states[0], new CreateShape(dp1, 0, null, [dp1, "#20ff80"]));
    top_sld.addState(states[1], new CreateShape(dp1, 0, null, [dp1, "#5F000000"]));
    toTopEdit.setBackground(top_sld);

    var delete_sld = new StateListDrawable();
    delete_sld.addState(states[0], new CreateShape(dp1, 0, null, [dp1, "#20ff80"]));
    delete_sld.addState(states[1], new CreateShape(dp1, 0, null, [dp1, "#5F000000"]));
    deleteEdit.setBackground(delete_sld);


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
