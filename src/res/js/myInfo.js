

function myInfoActivity(){



    new CreateImageButton(ui.findViewByTag('myInfo_bt_layout'), function (btn) {
        btn.setText('退出登录');
        btn.setTextColor('#ff4080');
        btn.setPadding(10, 5, 10, 5);
        btn.setTypeface('monospace');
        btn.setTextSize(17)
        //点击事件
        btn.onClick(function (view) {

            confirm('确定退出应用?').then(value=>{
                if (value) {
                    updateConfig("loginState",false); //保存不登录状态
                    android.os.Process.killProcess(android.os.Process.myPid());//结束app
                }
            });
        });
        CreateImageButtonNext(btn,"#00a0ff","#00a0cc");//一半部分
    });

}

myInfoActivity();
