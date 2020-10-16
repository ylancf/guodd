
importClass(android.widget.ListView);
importClass(android.widget.LinearLayout);

execScript(2, readResString('js/object-observe-lite.min.js'));
execScript(2, readResString('js/array-observe.min.js'));


let JsListView = (function () {


    //真正的对象  底部返回这个
    function JsListView(parentView, index) {
        this.contentView;
        this.content;
        this.adapter = null;
        this.event = new Object();
        this.itemEvent = new Object();
        this.data = new Array();
        this.view = initListView(parentView, index || -1); //给布局加一个listView子布局
        this.dataSetObservable = new android.database.DataSetObservable();
    }

    /**
     * 设置控件事件
     * @param eventType {String} 事件名
     * item_click 视图点击
     * @param eventAction {Callback} 事件方法
     */
    JsListView.prototype.on = function (eventType, eventAction) {
        this.event[eventType] = eventAction;  //值得学习的方式
    }

    /**
     * 设置项目控件事件
     * @param tag {String} 控件tag
     * @param eventType {String} 事件类型
     * @param eventAction {Callback} 事件方法
     */
    JsListView.prototype.setItemEvent = function (tag, eventType, eventAction) {
        this.itemEvent[tag] = {};
        this.itemEvent[tag][eventType] = eventAction;
    }

    /**
     * 绑定适配器数据源
     * @param data {Array} 数组
     */
    JsListView.prototype.setDataSource = function (data) {
        this.data = data;
        let mGlobal = this; //this指向JsListView对象
        if (android.os.Build.VERSION.SDK_INT >= 24) {
            //数组变化监听
            Array.observe(data, function (changes) {
                changes.forEach(change => {
                    MainPost(() => mGlobal.dataSetObservable.notifyChanged());//刷新listview界面(内容改变时一样)
                });
            });
        }
    }



    /**
     * 通知适配器刷新列表
     */
    //刷新列表
    JsListView.prototype.notifyDataSetChanged = function () {
        MainPost(() => this.dataSetObservable.notifyChanged());
    }

    /**
     * 设置自定义布局参数
     * @param xmlName {String} xml名称
     * @param action {Callbacak} 回调方法
     *///这里的xml实际是 listConterView
    JsListView.prototype.setContentView = function (xmlName, action) {
        this.contentView = xmlName; //taskJavaScriptList.xml
        initContentView(this);
        this.contentViewAction = function (pos, cv, parent, data) {
            let view = ui.parseView(xmlName);
            let views = findItemView(view, this) //所有tag view  加一个 根CardView
            new CreateItemEventList(view, this, pos, views);
            action(views, data, pos);
            return view;
        };
        if (this.adapter == null) {
            initAdapter(this);
        }
    }

    /**
     * 获取listView视图
     */
    JsListView.prototype.getView = function () {
        return this.view;
    }

    /**
     * 获取适配器
     * @returns {ListAdapter}
     */
    JsListView.prototype.getAdapter = function () {
        return this.baseAdapter.getAdapter();
    }

    /**
     * 获取适配器观察者
     * @returns {android.database.DataSetObservable}
     */
    JsListView.prototype.getDataSetObservable = function () {
        return this.dataSetObservable;
    }


    //给布局加一个listView子布局
    function initListView(parentView, index) {
        let lv = new ListView(context);
        lv.setLayoutParams(new LinearLayout.LayoutParams(-1, -2));
        lv.setTag('js_list');
        parentView.addView(lv, index);
        lv.setDividerHeight(0) //分割线
        return lv;
    }

    function initContentView(mGlobal) {
        mGlobal.content = [];  //所有tag的集合
        let tag, view;
        return (function (parent) {
            try {
                let child = parent.getChildCount();
                for (let i = 0; i < child; i++) {
                    view = parent.getChildAt(i);
                    tag = view.getTag();
                    if (tag) mGlobal.content.push(tag);
                    arguments.callee(view); //调用匿名函数本身
                }
            } catch (error) {
            }
        })(ui.parseView(mGlobal.contentView));  // 这个contentView 即是 xmlName  也就是 taskJavaScriptList.xml
    }

    function initAdapter(mGlobal) {
        mGlobal.adapter = new android.widget.ListAdapter({
            hasStableIds: function () {
                return false;
            },
            registerDataSetObserver: function (observer) {
                mGlobal.dataSetObservable.registerObserver(observer);
            },
            unregisterDataSetObserver: function (observer) {
                mGlobal.dataSetObservable.unregisterObserver(observer);
            },
            notifyDataSetChanged: function () {
                mGlobal.dataSetObservable.notifyChanged();
            },
            notifyDataSetInvalidated: function () {
                mGlobal.dataSetObservable.notifyInvalidated();
            },
            areAllItemsEnabled: function () {
                return true;
            },
            getDropDownView: function (pos, convertView, parent) {
                return this.getView(pos, convertView, parent);
            },
            getItemViewType: function (pos) {
                return 0;
            },
            getViewTypeCount: function () {
                return 1;
            },
            getView: function (pos, cv, parent) {
                return mGlobal.contentViewAction(pos, cv, parent, mGlobal.data[pos]);
            },
            getCount: function () {
                return mGlobal.data.length;
            },
            getItem: function (pos) {
                return mGlobal.data[pos];
            },
            getItemId: function (pos) {
                return pos;
            },
            isEnabled: function (pos) {
                return true;
            },
            isEmpty: function () {
                return this.getCount() == 0;
            }
        });
        mGlobal.view.setAdapter(mGlobal.adapter);
    }

    //CardView 里的内容进行包装
    function findItemView(view, mGlobal) {
        let obj = {};
        let arr = mGlobal.content;  //tag数组
        obj.view = view.getChildAt(0); // CardView
        for (let i in arr) obj[arr[i]] = view.findViewWithTag(arr[i]); //获取指定tag的view
          obj.setViewValue = function (tag, value) {
            ui.setViewValue(obj[tag], value);  //设置view的值 这里应该是值 复选框的值
        }
        obj.getViewValue = function (tag) {
            return ui.getViewValue(obj[tag]);
        }
        return obj; //包含一起 任何 有tag的view  因为mGlobal.content 收集了所有tag
    }


    //真正实现事件的地方
    function CreateItemEventList(view, mGlobal, pos, views) {
        let el = mGlobal.itemEvent;
        for (let tag in el) {
            for (let et in el[tag]) {
                ui.setEvent(view.findViewWithTag(tag), et, function (ve1, ve2, ve3, ve4) {
                    el[tag][et](views, pos, ve1, ve2, ve3, ve4); //执行事件
                });
            }
        }
    }

    function MainPost(action) {
        let Looper = android.os.Looper;  //looper的获取方式
        if (Looper.myLooper() == Looper.getMainLooper()) { //判断这个当前的looper是不是主线的looper
            return action();  //如果是主线程的looper 直接执行
        }
        let result;
        let err = null;
        let cdl = new java.util.concurrent.CountDownLatch(1); //倒数计数的锁 线程通信 当倒数到0时触发事件
        new java.lang.Thread({
            run: function () {
                ui.getHandler().post(function () {  //使用handle 改变主页面控件 线程中只能使用这个方式改变主线程的界面
                    try {
                        result = action();
                        cdl.countDown(); //触发CountDownLatch -1
                    } catch (e) {
                        err = e;
                        cdl.countDown();
                    }
                });
            }
        }).start();
        cdl.await();//CountDownLatch为0时触发
        if (err) {
            throw err;
        }
        return result;
    }

    return JsListView;
})();



