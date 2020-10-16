

// 任务界面



let items; //适配器源  以后用数据库内容初始化
//颜色
let materialColors = ["#e91e63", "#ab47bc", "#5c6bc0", "#7e57c2", "#2196f3", "#00bcd4",
    "#26a69a", "#4caf50", "#8bc34a", "#ffeb3b", "#ffa726", "#78909c", "#8d6e63"];



function mainObj() {

    items = initConfig('todoItems');//本地保存的列表
    //初始化ListView
    initTaskListView();

}



function initConfig(name) {
    //从ui配置中读取指定数据
    let arr = JSON.parse(ui.getConfigJSON())[name];
    //如果数据存在 则转成json数据返回 否则返回默认配置
    return arr ? JSON.parse(arr) : [
        {
            title: "BUG: ui.parseView()根布局margin, layout_width, layout_height 属性失效",
            summary: "紧急",
            color: "#f44336",
            done: false,
            id_number:1
        },
        {
            title: "让老猫给ui增加若干Bug",
            summary: "无限期",
            color: "#ff5722",
            done: false,
            id_number:2
        },
        {
            title: "修复dialogs ui模式下无法连续弹出",
            summary: "2099年12月",
            color: "#4caf50",
            done: false,
            id_number:3
        },
        {
            title: "荒废的一天",
            summary: "每天",
            color: "#2196f3",
            done: true,
            id_number:4
        }
    ];
}

//初始化 listView
function initTaskListView(){

    //创建ListView视图 并将ListView添加到代办事项main_view布局内
   let list = new JsListView(ui.findViewByTag('main_view'), 0);
    list.view.setPadding(dp2px(10), 0, dp2px(10), 0);  //设置padding
    /**
     * 设置适配器数据源
     * 添加删除数据,适配器会自动更新
     * 修改数据需要手动刷新列表
     * 注:安卓7.0以下 无法自动刷新数据
     * 需要手动调用JsListView.notifyDataSetChanged()刷新列表
     * items: {Array} Js数组
     */
    list.setDataSource(items);  //只是设置 并不显示  必须先给定资源

    /**
     * 设置适配器布局内容
     * xmlName: Xml布局名称
     * action: 创建项目布局时调用方法
     * 在此方法内设置项目属性
     *  itemView: {Object} 项目Tag标签视图集合
     *
     *   itemView.view: {View} 项目根布局视图
     *   itemView.setViewValue(tag,value): 设置视图的值
     *       tag: {String} 视图的tag
     *       value: {StringOrBoolean} 值，字符串或者是布尔型
     *   itemView.getViewValue(tag): 取得视图的值
     *       tag: {String} 视图的tag
     *
     *  item: {Object} 该项目数据
     *
     *  position: {Int} 项目在列表中的索引
     */
    list.setContentView('taskJavaScriptList.xml', (itemView, item, position) => {
        //设置参数
        itemView.setViewValue('title', item.title);
        itemView.setViewValue('summary', item.summary);
        itemView.setViewValue('done', item.done);
        itemView.setViewValue('id_number', item.id_number);

        //设置背景色
        itemView.color.setBackgroundColor(Color.parseColor(item.color));
        //改变水波纹颜色
        itemView.card.getBackground().setColor(android.content.res.ColorStateList.valueOf(Color.parseColor('#2F000000')));
        // //设置选中或取消  这里不需要这个功能
        // let paint = itemView.title.paint;
        // if (item.done) {
        //     paint.flags |= Paint.STRIKE_THRU_TEXT_FLAG;
        // } else {
        //     paint.flags &= ~Paint.STRIKE_THRU_TEXT_FLAG;
        // }
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
                confirm('确定要删除吗?', item.title).then(value => {
                    if (value) items.splice(position, 1);
                });
                return false;
            }
        });

        //复选框改变选中
        ui.setEvent(itemView.done, 'checkedChange', (view, isChecked) => {
            items[position].done = isChecked;//更新数组数据
            // //设置选中或取消
            // if (isChecked) {
            //     paint.flags |= Paint.STRIKE_THRU_TEXT_FLAG;
            // } else {
            //     paint.flags &= ~Paint.STRIKE_THRU_TEXT_FLAG;
            // }
            //刷新视图
            itemView.title.invalidate();
        });
    });


}
var scale = context.getResources().getDisplayMetrics().density;
var dp2px = dp => {
    return Math.floor(dp * scale + 0.5)
};

mainObj();