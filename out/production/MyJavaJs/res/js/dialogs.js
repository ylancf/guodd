/*
 * @Author: 大柒
 * @QQ: 531310591@qq.com
 * @Date: 2020-08-22 21:49:03
 * @Version: EasyClick RC19
 * @LastEditors: 大柒
 * @LastEditTime: 2020-08-23 08:47:16
 * @Description: dialogs 有Bug
 */
importClass(android.view.Gravity);
importClass(android.view.ViewGroup);
importClass(android.view.WindowManager);
importClass(android.widget.TextView);
importClass(android.widget.EditText);
importClass(android.widget.ListView);
importClass(android.widget.CheckBox);
importClass(android.widget.ProgressBar);
importClass(android.widget.LinearLayout);
importClass(android.widget.ArrayAdapter);
importClass(android.widget.SimpleAdapter);
importClass(java.util.HashMap);
importClass(java.util.ArrayList);
importClass(java.util.concurrent.CountDownLatch);
importClass(android.graphics.Color);
importClass(android.app.AlertDialog);
importClass(android.content.DialogInterface);

var dialogs = {};

/**
 * ToDo: UI模式下 所有函数会返回一个Promise。
 * 用 .then()接收返回参数
 * 例: confirm('确定吗').then(value=>{
 *   //ToDo: 对话框消失后会执行这里 value为true或false, 表示点击"确定"或"取消"
 * });
 *
 */

/**
 * 显示一个只包含“确定”按钮的提示对话框。直至用户点击确定脚本才继续运行。
 * @returns {null|void|Promise<PaymentResponse>|*}
 */
function alert() {
    return DialogsBuilder(arguments).setButtonText('positive', '确定').show();
}

/**
 * 显示一个包含“确定”和“取消”按钮的提示对话框。如果用户点击“确定”则返回 true ，否则返回 false 。
 * @returns {null|void|Promise<PaymentResponse>|*}
 */
function confirm() {
    return DialogsBuilder(arguments)
        .setButtonText('positive', '确定')
        .setButtonText('negative', '取消')
        .show();
}

/**
 * 显示一个包含输入框的对话框，等待用户输入内容，并在用户点击确定时将输入的字符串返回。如果用户取消了输入，返回null。
 * @param title {string} 对话框的标题。
 * @param prefill {string} 输入框的初始内容，可选，默认为空。
 * @returns {null|void|Promise<PaymentResponse>|*}
 */
function rawInput(title, prefill) {
    prefill = prefill || null;
    return new Dialogs()
        .title(title)
        .inputText(prefill)
        .setButtonText('positive', '确定')
        .show();
}

/**
 * 显示一个带有选项列表的对话框，等待用户选择，返回用户选择的选项索引(0 ~ item.length - 1)。如果用户取消了选择，返回-1。
 * @param title {string} 对话框的标题。
 * @param items {Array} 对话框的选项列表，是一个字符串数组。
 * @returns {null|void|Promise<PaymentResponse>|*}
 */
dialogs.select = function (title, items) {
    return new Dialogs()
        .title(title)
        .select(items)
        .show();
}

/**
 * 显示一个单选列表对话框，等待用户选择，返回用户选择的选项索引(0 ~ item.length - 1)。如果用户取消了选择，返回-1。
 * @param title {string} 对话框的标题。
 * @param items {Array} 对话框的选项列表，是一个字符串数组。
 * @param index {number} 对话框的初始选项的位置，默认为0。
 * @returns {number|void|Promise<PaymentResponse>|*}
 */
dialogs.singleChoice = function (title, items, index) {
    return new Dialogs()
        .title(title)
        .singleChoice(items, index)
        .setButtonText('positive', '确定')
        .show();
}

/**
 * 显示一个多选列表对话框，等待用户选择，返回用户选择的选项索引的数组。如果用户取消了选择，返回[]。
 * @param title {string} 对话框的标题。
 * @param items {Array} 对话框的选项列表，是一个字符串数组。
 * @param indices {Array} 选项列表中初始选中的项目索引的数组，默认为空数组。
 * @returns {[]|void|Promise<PaymentResponse>|*}
 */
dialogs.multiChoice = function (title, items, indices) {
    return new Dialogs()
        .title(title)
        .multiChoice(items, indices)
        .setButtonText('positive', '确定')
        .show();
}

/**
 * 创建一个可自定义的对话框
 *
 * @param properties {Object} 对话框属性，用于配置对话框。
 * @returns {Dialog}
 */
dialogs.build = function (properties) {
    return new Dialogs().build(properties);
}


function DialogsBuilder() {
    let ary = arguments[0];
    if (ary.length === 1) {
        return new Dialogs().title(ary[0]);
    } else if (ary.length === 2) {
        return new Dialogs().title(ary[0]).content(ary[1]);
    }
}


function Dialogs() {
    var dialog;
    var mGlobal;
    var builder = new AlertDialog.Builder(ui.getActivity());
    var countDownLatch;
    var result = null;
    var input = null;
    var listView = null;
    var DIALOG_TYPE = 0;
    var mCallback = function () {
    };
    var isShow = false;

    const listConfig = {
        '2': {
            layout: android.R.layout.simple_list_item_1,
            mode: ListView.CHOICE_MODE_NONE
        },
        '3': {
            layout: android.R.layout.simple_list_item_single_choice,
            mode: ListView.CHOICE_MODE_SINGLE
        },
        '4': {
            layout: android.R.layout.simple_list_item_multiple_choice,
            mode: ListView.CHOICE_MODE_MULTIPLE
        }
    }
    var Config = {
        positive: {
            key: 'setPositiveButton',
            onClick: function () {
                result = true;
                countDownLatch.countDown();
            },
            textColor: Color.parseColor('#0883C3'),
            callback: function () {
            }
        },
        negative: {
            key: 'setNegativeButton',
            onClick: function () {
                result = false;
                countDownLatch.countDown();
            },
            textColor: Color.parseColor('#0883C3'),
            callback: function () {
            }
        },
        neutral: {
            key: 'setNeutralButton',
            onClick: function () {
                result = null;
                countDownLatch.countDown();
            },
            textColor: Color.parseColor('#0883C3'),
            callback: function () {
            }
        }
    }

    this.title = function (title) {
        builder.setTitle(title);
        return this;
    }

    this.content = function (content) {
        builder.setMessage(content);
        return this;
    }

    this.setButtonText = function (key, name) {
        builder[Config[key].key](name, {onClick: Config[key].onClick});
        return this;
    }

    this.inputText = function (text) {
        initEditText(text);
        return this;
    }

    this.select = function (items) {
        initListView(2, items);
        return this;
    }

    this.singleChoice = function (items, index) {
        initListView(3, items, index = index || 0);
        return this;
    }

    this.multiChoice = function (items, indices) {
        initListView(4, items, indices = indices || []);
        return this;
    }

    this.show = function () {
        if (isUiThread()) {
            new java.lang.Thread({
                run: function () {
                    countDownLatch = new CountDownLatch(1);
                    show();
                    countDownLatch.await();
                    mCallback(getResult());
                    return;
                }
            }).start();
            return new Promise();
        }
        countDownLatch = new CountDownLatch(1);
        show();
        countDownLatch.await();
        return getResult();
    }

    function Promise() {

        this.then = function (callback) {
            mCallback = callback;
        }

        return this;
    }

    function show() {
        MainPost(() => {
            isShow = true;
            dialog = builder.create()
            if (android.os.Build.VERSION.SDK_INT >= 26) {
                dialog.getWindow().setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY);
            } else {
                dialog.getWindow().setType(WindowManager.LayoutParams.TYPE_SYSTEM_ALERT);
            }
            dialog.show();
            dialog.getButton(dialog.BUTTON_POSITIVE).setTextColor(Config.positive.textColor);
            dialog.getButton(dialog.BUTTON_NEGATIVE).setTextColor(Config.negative.textColor);
            dialog.getButton(dialog.BUTTON_NEUTRAL).setTextColor(Config.neutral.textColor);
        });
    }

    function getResult() {
        var mResult = result;
        switch (DIALOG_TYPE) {
            case 1:
                mResult = result ? new String(input.getText().toString()) : null;
                break
            case 2:
                mResult = result === false ? -1 : result;
                break
            case 3:
                mResult = result === false ? -1 : listView.getCheckedItemPosition();
                break
            case 4:
                mResult = result === false ? [] : getCheckedItemPositions();
                break
        }
        return mResult;
    }

    function getCheckedItemPositions() {
        var mResult = [];
        var positions = listView.getCheckedItemPositions();
        for (i = 0; i < listView.getCount(); i++) {
            if (positions.get(i)) {
                mResult.push(i);
            }
        }
        return mResult
    }

    function initEditText(text) {
        DIALOG_TYPE = 1;
        let view = new android.widget.LinearLayout(context);
        input = new EditText(context);
        input.setText(text);
        view.addView(input);
        builder.setView(view);
        let lp = new android.widget.LinearLayout.LayoutParams(-1, -2);
        lp.setMargins(dp2px(20), 0, dp2px(20), 0);
        input.setLayoutParams(lp);
    }

    function initListView(type, items, index) {
        DIALOG_TYPE = type;
        if (listView == null) listView = new ListView(context);
        listView.setChoiceMode(listConfig[DIALOG_TYPE].mode);
        listView.setPadding(dp2px(10), 0, dp2px(10), 0);
        builder.setView(listView);
        ListAdapter(items, index);
        if (DIALOG_TYPE != 2) return;
        listView.setOnItemClickListener({
            onItemClick: function (parent, view, position, id) {
                result = position;
                countDownLatch.countDown();
                dialog.dismiss();
            }
        });
    }

    function ListAdapter(items, index) {
        let listAdapter = new ArrayAdapter(context, listConfig[DIALOG_TYPE].layout, items);
        listView.setAdapter(listAdapter);
        if (typeof (index) == 'number') index = [index];
        listView.post({
            run: function () {
                for (i in index) listView.setItemChecked(index[i], true);
            }
        });
        return;
    }

    function isUiThread() {
        let Looper = android.os.Looper;
        return Looper.myLooper() == Looper.getMainLooper()
    }

    function MainPost(action) {
        let Looper = android.os.Looper;
        if (isUiThread()) {
            return action();
        }
        let result;
        let err = null;
        let cdl = new java.util.concurrent.CountDownLatch(1);
        new java.lang.Thread({
            run: function () {
                ui.getHandler().post(function () {
                    try {
                        result = action();
                        cdl.countDown();
                    } catch (e) {
                        err = e;
                        cdl.countDown();
                    }
                });
            }
        }).start();
        cdl.await();
        if (err) {
            throw err;
        }
        return result;
    }

    builder.setOnDismissListener({
        onDismiss: function (dialog) {
            try {
                result = false;
                isShow = false;
                countDownLatch.countDown();
            } catch (error) {
            }
        }
    });

    mGlobal = this;

    return mGlobal;
}
