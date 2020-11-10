//公共脚本界面

let comm_items;
let popSetUp

function commObject() {


    popSetUp = new PopSetUp(); //不能循环new  会出错
    popSetUp.on("hide", function () {
        logd("comm_items:" + comm_items);
        ui.saveConfig('commItems', JSON.stringify(comm_items));//保存参数
    });
    initCommConfig('commItems');//本地保存的列表
}

function initCommConfig(name) {

    //从ui配置中读取指定数据
    let arr = JSON.parse(ui.getConfigJSON())[name];
    if (arr == ""||!arr) {
        arr = []
    } else {
        arr = JSON.parse(arr);
    }

    //此处要使用联网修改

    let progressAct= new ProBarAct();
    progressAct.on("hide", function () {
        let resultInfo = progressAct.result;
        if (resultInfo.msg == "操作成功") {
            logd("进入了")
            let sqlArr = resultInfo.data;
            // let sqlArr =JSON.parse(resultInfo.data);
            comm_items = containArr(sqlArr, arr);
            logd("comm_items:" + comm_items)
            initCommListView();
        }

    });

    progressAct.postShow(function () {
        let getHttpUrl = "http://47.98.194.121:80/system/info/list"
        let getHttpResult = http.httpGetDefault(getHttpUrl, 5 * 1000, {"User-Agent": "test"});
        logd("result ->     " + getHttpResult);
        if(!getHttpResult) {
          toastLog("检查网络");
          exit();
        }
        return JSON.parse(getHttpResult);
        ;
    });

    return;


    //如果数据存在 则转成json数据返回 否则返回默认配置
    // return arr ? JSON.parse(arr) : [
    //
    //     {
    //         title: "微信自动抢红包(需无锁屏密码)",
    //         summary: "",
    //         color: "",
    //         done: false,
    //         prompt:"屏蔽,屏蔽包含",
    //         addInfo:"",
    //         idNumber:7,
    //         path:""  //脚本路径
    //     },
    //     {
    //         title: "旅行世界(邀请码:1857014)",
    //         summary: "",
    //         color: "",
    //         done: false,
    //         prompt:"",
    //         addInfo:"",
    //         idNumber:2,
    //         path:""  //脚本路径
    //     },
    //
    //     {
    //         title: "BUG: ui.parseView()根布局margin, layout_width, layout_height 属性失效",
    //         summary: "",
    //         color: "#f44336",
    //         done: false,
    //         prompt:"",//附加信息的提示
    //         addInfo:"",//附加信息
    //         idNumber:1, //唯一id 即数据库的id
    //         path:""  //脚本路径
    //     },
    //     {
    //         title: "修复dialogs ui模式下无法连续弹出",
    //         summary: "",
    //         color: "#4caf50",
    //         done: false,
    //         prompt:"",
    //         addInfo:"",
    //         idNumber:3,
    //         path:""  //脚本路径
    //     },
    //     {
    //         title: "荒废的一天",
    //         summary: "",
    //         color: "#2196f3",
    //         done: false,
    //         prompt:"年级,班级",
    //         addInfo:"",
    //         idNumber:4,
    //         path:""  //脚本路径
    //     }
    // ];
}


function initCommListView() {

    //创建ListView视图 并将ListView添加到代办事项main_view布局内
    let list = new JsListView(ui.findViewByTag('comm_layout'), 0);
    list.view.setPadding(dp2px(10), 0, dp2px(10), 0);  //设置padding

    list.setDataSource(comm_items);  //只是设置 并不显示  必须先给定资源


    list.setContentView('comJavaScriptList.xml', (itemView, item, position) => {
        //设置参数
        itemView.setViewValue('title', item.idNumber+"."+item.title);
        itemView.setViewValue('summary', (item.summary.indexOf("时间")==-1) ? (item.summary = "时间:,时长:,次数:") : item.summary);
        itemView.setViewValue('done', item.done==true?true:false);
        itemView.setViewValue('idNumber', item.idNumber);
        itemView.setViewValue('comm_prompt', item.prompt ? item.prompt : "");
        itemView.setViewValue('comm_addInfo', item.addInfo ? item.addInfo : "");
        //设置背景色
        itemView.color.setBackgroundColor(Color.parseColor( materialColors[random(0, materialColors.length - 1)]));
        //改变水波纹颜色
        //itemView.card.getBackground().setColor(android.content.res.ColorStateList.valueOf(Color.parseColor('#2F000000')));

        //跑马灯效果
        itemView.title.setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
        itemView.title.setSingleLine(true);
        itemView.title.setSelected(true);
        //刷新视图
        itemView.title.invalidate();

        /** 设置控件事件 */

        //设置根布局点击与复选框联动
        ui.setEvent(itemView.view, 'click', view => {
            itemView.done.checked = !itemView.done.checked;
        });

        //根布局长按事件
        itemView.view.setOnLongClickListener({
            onLongClick: function () {
                popSetUp.show(itemView.view, function (result, _date, r_time, r_number, _prompt, _addInfo) {
                    let str = "时间:" + _date + ",时长:" + r_time + ",次数:" + r_number
                    itemView.setViewValue('summary', str);
                    itemView.setViewValue('prompt', _prompt);
                    itemView.setViewValue('comm_addInfo', _addInfo);
                    comm_items[position].summary = str; //更新数据
                    comm_items[position].prompt = _prompt;
                    comm_items[position].addInfo = _addInfo;
                })
                return false;
            }
        });

        //复选框改变选中
        ui.setEvent(itemView.done, 'checkedChange', (view, isChecked) => {
            comm_items[position].done = isChecked;//更新数组数据

            itemView.title.invalidate();
        });
    });


}

commObject();