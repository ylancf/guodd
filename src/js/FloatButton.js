importClass(android.widget.ImageView);
importClass(android.widget.FrameLayout);
importClass(android.widget.LinearLayout);
importClass(android.view.Gravity);
importClass(android.view.ViewGroup);
importClass(android.view.WindowManager);
importClass(android.view.animation.BounceInterpolator);
importClass(android.graphics.Color);
importClass(android.graphics.drawable.ColorDrawable);
importClass(android.graphics.drawable.BitmapDrawable);
importClass(android.graphics.drawable.GradientDrawable);
importClass(android.animation.Animator);
importClass(android.animation.AnimatorSet);
importClass(android.animation.ObjectAnimator);
importClass(android.os.Looper);
importClass(android.os.Handler);

/**
 * AJ悬浮按钮
 * @constructor
 */
function FloatButton() {
    Looper.prepare();//在线程中创建 自己的looper
    const scale = context.getResources().getDisplayMetrics().density;//获取密度
    let dp2px = dp => parseInt(Math.floor(dp * scale + 0.5));
    let px2dp = px => parseInt(Math.floor(px / scale + 0.5));
    let mWindowLogo, mWindowAnim, mWindowMenu;
    let mFloatPositionY = 0.5;
    let mLogoAlphas = [0.4, 0.8]; //透明度
    let mButtonSize = dp2px(40); //按钮大小
    let mButtonPadding = dp2px(8);
    let mMenuRadius = dp2px(80);//扇形大小
    let mBitmapUtil = new BitmapUtil();
    let myHandler = new Handler(Looper.myLooper());//绑定handler 等价于  let myHandler = new Handler();
    let mHandler = ui.getHandler();//获得UI线程的handler  ?这样是不是就可以在java里和ui通信了?
    let mItemUtil = new Object();
    let mXYList = new Array();
    let isShow = false;
    let isMenuOpen = false;
    let isAnimState = false; //动画
    let isInitWindow = false;
    let mFloatPosition = false; //悬浮窗靠哪边 false 左 true 右
    let mAnim = new FloatAnimUtil();
    let mEventList = {
        show: new Function(),
        hide: new Function(),
        item_click: new Function(),
        menu_state_change: new Function()
    }

    initWindow();

    this.setIcon = function (path) {  //设置主按钮的颜色 即展开按钮的颜色
        mWindowLogo.util.setIcon(path);
        mWindowAnim.util.setIcon(path);
    }

    this.setTint = function (colorstr) { //设置按钮颜色
        MainPost(() => {
            mWindowLogo.util.setTint(colorstr);
            mWindowAnim.util.setTint(colorstr);
        });
    }

    this.setColor = function (colorstr) { //设置背景颜色
        MainPost(() => {
            mWindowLogo.util.setColor(colorstr);
            mWindowAnim.util.setColor(colorstr);
        });
    }


    let changeName=""
    //设置name对应的颜色为黑色
    this.setItemBtColor=function (name){

        if(changeName==name){
            return ;
        }else{
            logd("不相等");
            changeName=name;
        }
        for (let i in mItemUtil){
            mItemUtil[i].setTint("#FFFFFF");
        }
        if(mItemUtil[name]){
            mItemUtil[name].setTint("#222222");
        }
    }




    this.addItem = function (name) {
        if (name == 'logo') {
            this.close();
            throw 'Error: FloatButton.addItem(Item名称不能为logo)';
        } else if (mItemUtil[name]) {
            this.close();
            throw 'Error: FloatButton.addItem(Item按钮名称重复,参数:' + name + ')';
        }
        let view = new ImageButtonView(name);
        view.setLayoutParams(new FrameLayout.LayoutParams(mButtonSize, mButtonSize, Gravity.CENTER_VERTICAL));
        MainPost(() => {
            mWindowMenu.contentView.addView(view);
            updateXYData(); //计算位置
        });
        mItemUtil[name] = new ViewUtil(view);
        return mItemUtil[name];
    }

    this.getItemView = function (name) {
        return findViewTag(mWindowMenu, name);
    }

    this.on = function (eventType, eventCallback) {
        mEventList[eventType] = eventCallback;
    }

    this.show = function (callback) {
        if (mWindowLogo == null) return;
        callback = callback || new Function();
        mAnim.show(callback);
    }

    this.hide = function (callback) {
        if (mWindowLogo == null) return;
        callback = callback || new Function();
        mAnim.hide(callback);
    }

    this.menuShow = function (callback) {
        if (mWindowLogo == null) return;
        callback = callback || new Function();
        if (isMenuOpen) {
            callback();
            return;
        }
        isShow ? menuShow() : mAnim.show(menuShow);

        function menuShow() {
            mAnim.menuShowOrHide(callback);
        }
    }

    this.menuHide = function (callback) {
        if (mWindowLogo == null) return;
        callback = callback || new Function();
        if (!isShow)
            callback();
        else if (!isMenuOpen)
            callback();
        else
            mAnim.menuShowOrHide(callback);
    }

    this.close = function () {
        if (mWindowLogo == null) return;
        mWindowLogo.close();
        mWindowMenu.close();
        mWindowAnim.close();
        myHandler.getLooper().quit();
        mWindowMenu = mWindowLogo = mWindowAnim = null;
    }

    this.loop = function () {
        Looper.loop();
    }


    /** 内部功能区*/

    function initWindow() {
        /** Menu*/
        let flMenu = new FrameLayout(context); //装小按钮的帧布局
        mWindowMenu = new FloatUtil(flMenu);
        mWindowMenu.setSize(mMenuRadius + mButtonSize, mMenuRadius * 2 + mButtonSize);//帧布局的大小
        mWindowMenu.setTouchable(false); //不可用点击
        /** Anim*/
        let flAnim = new FrameLayout(context)
        let ivAnim = new ImageButtonView('logo');
        MainPost(() => flAnim.addView(ivAnim));
        mWindowAnim = new FloatUtil(flAnim);
        mWindowAnim.util = new ViewUtil(ivAnim);
        mWindowAnim.setSize(-1, -1);
        mWindowAnim.setTouchable(false);
        /** Logo*/
        let ivLogo = new ImageButtonView('logo');
        mWindowLogo = new FloatUtil(ivLogo);
        mWindowLogo.util = new ViewUtil(ivLogo);
        mWindowLogo.setSize(mButtonSize, mButtonSize);
        mWindowAnim.setTouchable(false);
        ivLogo.setOnTouchListener(new OnTouchListener());

        MainPost(() => {
            mWindowMenu.contentView.setVisibility(4);
            mWindowAnim.contentView.setVisibility(4);
            mWindowLogo.contentView.setVisibility(4);
            mWindowLogo.contentView.setAlpha(mLogoAlphas[0]);
            ivAnim.setAlpha(mLogoAlphas[0]);
            mWindowLogo.setPosition(-mButtonPadding, parseInt((mWindowAnim.getScreenHeight() - mButtonSize) * mFloatPositionY));
            updateMenuPosition();
        });
    }

    function findViewTag(window, tag) {
        return window.contentView.findViewWithTag(tag);
    }

    function MainPost(action) {
        mHandler.post({run: action});
    }

    /**
     * 圆形图标按钮
     * @param tag
     * @constructor
     */
    function ImageButtonView(tag) {
        let iv = new ImageView(context);//创建图片
        let lp = new LinearLayout.LayoutParams(new ViewGroup.LayoutParams(mButtonSize, mButtonSize));//设置大小
        iv.setLayoutParams(lp);
        MainPost(() => {
            iv.setTag(tag);
            iv.setPadding(mButtonPadding, mButtonPadding, mButtonPadding, mButtonPadding);
        });
        return iv;
    }

    /**
     * 控件工具类
     * @param view
     * @constructor
     */
    function ViewUtil(view) {
        let gd = new GradientDrawable();
        let dr = null; //设置了bmp的图片类
        let bmp = null; //图片
        let tint = null;  // 某种颜色
        let mClickCallback = ItemClickCallbak;
        gd.setShape(1); //边的大小
        gd.setColor(Color.parseColor('#FFFFFF')); //默认颜色
        MainPost(() => {
                view.setBackground(gd);
                view.setOnClickListener({
                    onClick: () => {
                        if (view.getTag() == 'logo') return;
                        if (!mClickCallback(view.getTag(), view)) mAnim.menuShowOrHide();//隐藏扇菜单
                    }
                });
            }
        );

        this.setIcon = function (path) {
            if (bmp != null) bmp.recycle(); //回收图片
            bmp = mBitmapUtil.PathToBitmap(path);
            dr = new BitmapDrawable(bmp); //获得BitmapDrawable对象
            if (tint != null) dr.setTint(Color.parseColor(tint));
            MainPost(() => view.setImageDrawable(dr));
            return this;
        }

        this.setTint = function (colorStr) { //设置按钮颜色
            if (bmp == null) {  //图片不存在时  用于判断 先设置了 setIcon 还是  setTint
                tint = colorStr;
                return this;
            }
            dr.setTint(Color.parseColor(colorStr)); //设置图片颜色
            return this;
        }

        this.setColor = function (colorstr) { //设置背景颜色
            MainPost(() => gd.setColor(Color.parseColor(colorstr)));
            return this;
        }

        this.onClick = function (action) {
            mClickCallback = action;
            return this;
        }
    }

    /**
     * Item按钮点击回调方法
     * @param tag
     * @param view
     * @constructor
     */
    function ItemClickCallbak(tag, view) {
        return mEventList.item_click(tag, view);  //返回false 为关闭菜单,true 为保持菜单
    }

    /**
     * 更新item坐标数据
     */
    function updateXYData() {   //根据数量来摆放位置
        let count = mWindowMenu.contentView.getChildCount();
        let angle = 360 / (count * 2 - 2);
        let degree = 0;
        let x, y;
        mXYList = new Array();
        for (let i = 0; i < count; i++) {
            x = parseInt(0 + Math.cos(Math.PI * 2 / 360 * (degree - 90)) * mMenuRadius);
            y = parseInt(0 + Math.sin(Math.PI * 2 / 360 * (degree - 90)) * mMenuRadius);
            if (Math.abs(x) < 10) x = 0;
            if (Math.abs(y) < 10) y = 0;
            mXYList.push([{x: x, y: y}, {x: -x, y: y}]); //x在这里cos没有负值所有给加了-号
            degree += angle;
        }
    }

    /**
     * 更新Menu菜单位置
     */
    function updateMenuPosition() {
        let mv = mWindowMenu.contentView;
        let y = parseInt(mWindowLogo.getY() - (mWindowMenu.getHeight() - mButtonSize) / 2);
        let x = parseInt(mFloatPosition ? mWindowLogo.getX() - mv.getWidth() + (mButtonSize / 2) : mWindowLogo.getX() + (mButtonSize / 2));
        mWindowMenu.setPosition(x, y);
    }

    /**
     * 监听触摸事件
     * @returns {function(...[*]=)} OnTouchListener
     * @constructor
     */
    function OnTouchListener() {
        let x, y, windowX, windowY, isMove;
        return function (view, event) {
            if (isAnimState) return true;
            switch (event.getAction()) {
                case event.ACTION_DOWN:  //记录用于主按钮的初始位置
                    x = event.getRawX();
                    y = event.getRawY();
                    windowX = mWindowLogo.getX();
                    windowY = mWindowLogo.getY();
                    isMove = false;
                    return true;
                case event.ACTION_MOVE:
                    if (!isMove) {
                        if (Math.abs(event.getRawX() - x) > 30 || Math.abs(event.getRawY() - y) > 30) {
                            MainPost(() => view.setAlpha(mLogoAlphas[1]));  //设置移动时的透明度
                            isMove = true;
                        }
                    } else if (!isMenuOpen) {
                        mWindowLogo.setPosition(windowX + (event.getRawX() - x), windowY + (event.getRawY() - y));
                    }
                    return true;
                case event.ACTION_UP:
                    if (!isMove) {
                        mAnim.menuShowOrHide();
                    } else if (isMove && !isMenuOpen) {
                        mFloatPosition = mWindowAnim.contentView.getWidth() / 2 < event.getRawX();
                        mAnim.position(); //改变靠边方向
                    }
                    return true;
            }
        }
    }

    /**
     * 动画工具类
     * @constructor
     */
    function FloatAnimUtil() {
        let position = false;
        let tx = (v, a) => ObjectAnimator.ofFloat(v, "translationX", a); //平移x
        let ty = (v, a) => ObjectAnimator.ofFloat(v, "translationY", a);
        let ap = (v, a) => ObjectAnimator.ofFloat(v, "alpha", a); //透明度
        let sx = (v, a) => ObjectAnimator.ofFloat(v, "scaleX", a);//缩放
        let sy = (v, a) => ObjectAnimator.ofFloat(v, "scaleY", a);
        let al = (a, f) => a.addListener(new Animator.AnimatorListener({onAnimationEnd: f}));//结束事件

        function AnimStart(data, time) {
            let animator = new AnimatorSet();
            animator.playTogether(data);//一起执行
            animator.setDuration(time);//执行时间
            animator.start(); //开始动画
            return animator; //返回animatorSet对象
        }

        //显示
        this.show = function (callback) {
            if (isShow) {
                callback();
                return;
            }
            isShow = true;
            let lv = mWindowLogo.contentView;
            let mv = mWindowMenu.contentView;
            let av = mWindowAnim.contentView;
            let data = mFloatPosition ? [mButtonSize, 0] : [-mButtonSize, 0];
            MainPost(() => {
                lv.setVisibility(4);
                av.setVisibility(4);
                mv.setVisibility(4);
                lv.setTranslationX(data[0]);
                lv.setVisibility(0);
                al(AnimStart([tx(lv, data)], 500), () => {//设置0.5秒时间 足够进行绑定了
                    mWindowLogo.setTouchable(true);
                    callback();
                    mEventList.show();
                });
            });
        }

        //隐藏
        this.hide = function (callback) {
            if (!isShow) {
                callback();
                return;
            }
            isShow = false;
            isMenuOpen ? this.menuShowOrHide(hide) : hide();

            function hide() {
                let lv = mWindowLogo.contentView;
                let data = mFloatPosition ? [0, mButtonSize] : [0, -mButtonSize];
                MainPost(() => {
                    al(AnimStart([tx(lv, data)], 500), () => {
                        mWindowAnim.contentView.setVisibility(8);
                        mWindowMenu.contentView.setVisibility(8);
                        mWindowLogo.contentView.setVisibility(8);
                        mWindowLogo.setTouchable(false);
                        callback();
                        mEventList.hide();
                    });
                });
            }
        }

        this.menuShowOrHide = function (callback) {
            callback = callback || new Function();
            let mv = mWindowMenu.contentView; //扇悬浮窗内容
            let count = mv.getChildCount();//获得所有按钮
            let e = mFloatPosition ? 1 : 0;  //悬浮窗是左边还是右边
            let animList = new Array();
            let itemView, data;
            isAnimState = true;
            mWindowMenu.setTouchable(!isMenuOpen);
            for (let i = 0; i < count; i++) {
                itemView = mv.getChildAt(i);
                data = isMenuOpen ? [1, 0] : [0, 1]; //收回还是展开
                animList.push(tx(itemView, getX(i))); //平移
                animList.push(ty(itemView, getY(i)));
                animList.push(sx(itemView, data));  //缩放
                animList.push(sy(itemView, data));
            }
            MainPost(() => {
                mv.setVisibility(0); //悬浮窗内容可见即可点击
                al(AnimStart(animList, 200), () => {
                    isAnimState = false;
                    if (isMenuOpen) mv.setVisibility(8);
                    mWindowLogo.contentView.setAlpha(mLogoAlphas[isMenuOpen ? 0 : 1]);
                    isMenuOpen = !isMenuOpen;
                    callback();
                    mEventList.menu_state_change(isMenuOpen);
                });
            });

            function getX(i) {
                return isMenuOpen ? [mXYList[i][e].x, 0] : [0, mXYList[i][e].x];
            }

            function getY(i) {
                return isMenuOpen ? [mXYList[i][e].y, 0] : [0, mXYList[i][e].y];
            }
        }

        this.position = function (callback) {
            callback = callback || new Function();
            let x = mWindowLogo.getX();
            let y = mWindowLogo.getY();
            let w = mWindowAnim.contentView.getWidth();
            let data = mFloatPosition ? [x, w - mButtonSize + mButtonPadding] : [x, 0 - mButtonPadding];
            let lv = mWindowLogo.contentView;
            let av = findViewTag(mWindowAnim, 'logo');
            MainPost(() => {
                mWindowAnim.contentView.setVisibility(0);
                av.setVisibility(4);
                av.setTranslationX(x);
                av.setTranslationY(y);
                av.setAlpha(mLogoAlphas[0]);
                av.setVisibility(0);
                lv.setVisibility(4);
                lv.setAlpha(0);
                mWindowLogo.setPosition(data[1], y);
                let animTx = tx(av, data);
                animTx.setInterpolator(new BounceInterpolator());//动画插值器
                al(AnimStart([animTx], 300), () => {
                    lv.setVisibility(0);
                    position = mFloatPosition;
                    setTimeout(() => {
                        MainPost(() => {
                            al(AnimStart([ap(av, [mLogoAlphas[0], 0]), ap(lv, [0, mLogoAlphas[0]])], 300), () => {
                                mWindowAnim.contentView.setVisibility(8);
                            })
                        });
                    }, 17);
                    updateMenuPosition();
                });
            });
            /** 停靠方向发生改变,改变所有item重力位置*/
            if (position != mFloatPosition) {
                let mv = mWindowMenu.contentView;
                let gravity = Gravity.CENTER_VERTICAL | (mFloatPosition ? Gravity.RIGHT : Gravity.LEFT);
                let count = mv.getChildCount();
                let itemView, lp;
                MainPost(() => {
                    for (let i = 0; i < count; i++) {
                        itemView = mv.getChildAt(i);
                        lp = itemView.getLayoutParams();
                        lp.gravity = gravity;
                        itemView.setLayoutParams(lp);
                    }
                });
            }
        }
    }
}

importClass(java.io.File);
importClass(java.io.FileInputStream);
importClass(java.net.URL);
importClass(android.graphics.BitmapFactory);

/**
 * Bitmap工具类
 * @constructor
 */
function BitmapUtil() {
    let resources = context.getResources();

    this.PathToBitmap = function (path) {  //把本地资源的获取 与 网络资源的获取整合了 返回图片
        let bmp = null;
        let value;
        if (path.indexOf('@drawable/') != -1) {
            value = path.replace('@drawable/', '');
            bmp = resources.getDrawable(getResID(value)).getBitmap();
        } else if (path.indexOf('file://./') != -1) {
            value = path.replace('file://./', '');
            bmp = uiWrapper.resResAsBitmap(value);
        } else if (path.indexOf('file://') != -1) {
            value = path.replace('file://', '');
            bmp = BitmapFactory.decodeStream(new FileInputStream(value));
        } else if (isURL(path)) { //获得网络图片
            let fileUrl = new URL(path);
            let conn = fileUrl.openConnection();
            conn.setDoInput(true);
            conn.connect();
            let is = conn.getInputStream();
            bmp = BitmapFactory.decodeStream(is);
            is.close();
        }
        return bmp;
    }

    function getResID(name) {
        return resources.getIdentifier(name, "drawable", 'com.gibb.easyclick');
    }

    function isURL(str) {
        let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }
}