function ImageWrapper() {

}

var image = new ImageWrapper();
/**
 * 设置图色模块初始化参数，可用于多分辨率兼容
 * @param param
 */
ImageWrapper.prototype.setInitParam = function (param) {
    if (imageWrapper == null) {
        return;
    }
    imageWrapper.setInitParam(JSON.stringify(param));
};

/**
 * 向系统申请屏幕截图权限，返回是否请求成功。
 * <p>
 * 第一次使用该函数会弹出截图权限请求，建议选择“总是允许”。
 * </p>
 * <p>
 * 这个函数只是申请截图权限，并不会真正执行截图，真正的截图函数是captureScreen()。
 * </p>
 * 该函数在截图脚本中只需执行一次，而无需每次调用captureScreen()都调用一次。
 * <p>
 * 建议在本软件界面运行该函数，在其他软件界面运行时容易出现一闪而过的黑屏现象。
 * </P>
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 * @param timeout 超时时间，单位是毫秒
 * @param type 截屏的类型，0 自动选择，1 代表授权模式，2 代表无需权限模式（该模式前提条件：运行模式为代理模式）
 *
 * @return 布尔型 true 代表成功 false代表失败
 */
ImageWrapper.prototype.requestScreenCapture = function (timeout, type) {
    if (imageWrapper == null) {
        return;
    }
    return imageWrapper.requestScreenCapture(timeout, type);
};


/**
 * 释放截屏请求
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 */
ImageWrapper.prototype.releaseScreenCapture = function () {
    if (imageWrapper == null) {
        return;
    }
    imageWrapper.releaseScreenCapture();
};


/**
 * 截取当前屏幕并返回一个Image对象。
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 * <Br/>
 * 如果区域空或则有负数的，就会是全屏
 * @param retryNumber 重试次数，直到能截到图为止，默认是3
 * @param x 截图的起始X坐标
 * @param y 截图的起始Y坐标
 * @param ex 终点X坐标
 * @param ey 终点Y坐标
 * @return AutoImage AutoImage对象或者null
 */
ImageWrapper.prototype.captureScreen = function (retryNumber, x, y, ex, ey) {
    if (imageWrapper == null) {
        return;
    }
    var uuid = imageWrapper.captureScreen(retryNumber, x, y, ex - x, ey - y);
    if (uuid != null) {
        return new AutoImage(uuid);
    }
    return null;
};

/**
 * 将屏幕抓取为Bitmap对象，如果中间有-1或者宽度、宽度为-1，将会是全屏
 * @param format jpg或者png，代理模式下有用
 * @param x 开始X坐标
 * @param y 开始Y坐标
 * @param ex 终点X坐标
 * @param ey 终点Y坐标
 * @param q 图片质量，1 - 100，代理模式下有用
 * @return Bitmap null或者bitmap对象
 */
ImageWrapper.prototype.captureScreenBitmap = function (format, x, y, ex, ey, q) {
    if (imageWrapper == null) {
        return;
    }
    return imageWrapper.captureScreenBitmap(format, x, y, ex - x, ey - y, q);
};


/**
 * 抓取全屏
 * @return {null|AutoImage}
 */
ImageWrapper.prototype.captureFullScreen = function () {
    if (imageWrapper == null) {
        return;
    }
    var uuid = imageWrapper.captureFullScreen();
    if (uuid != null) {
        return new AutoImage(uuid);
    }
    return null;
};


/**
 * 抓取全屏函数，代理模式下并且requestScreenCapture函数的type为0的时候，会使用截屏函数，尽力消除色差问题。
 * 其他的和captureFullScreen一致
 * @return {null|AutoImage}
 */
ImageWrapper.prototype.captureFullScreenEx = function () {
    if (imageWrapper == null) {
        return;
    }
    var uuid = imageWrapper.captureFullScreenEx();
    if (uuid != null) {
        return new AutoImage(uuid);
    }
    return null;
};

/**
 * 截取当前屏幕并以PNG格式保存到path中。如果文件不存在会被创建；文件存在会被覆盖。
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *<Br/>
 * 如果区域空或则有负数的，就会是全屏
 * @param retryNumber 重试次数，直到能截到图为止，默认是3
 * @param x 截图的起始X坐标
 * @param y 截图的起始Y坐标
 * @param ex 终点X坐标
 * @param ey 终点Y坐标
 * @param path 截图保存路径
 * @return 布尔型 true 截图成功 false 代表不成功
 */
ImageWrapper.prototype.captureToFile = function (retryNumber, x, y, ex, ey, path) {
    if (imageWrapper == null) {
        return;
    }
    return imageWrapper.captureScreenToFile(retryNumber, x, y, ex - x, ey - y, path);
};

/**
 * 读取在路径path的图片文件并返回一个{@link AutoImage}对象。
 * 如果文件不存在或者文件无法解码则返回null。
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param path 图片路径
 * @return AutoImage AutoImage对象或者null
 */
ImageWrapper.prototype.readImage = function (path) {
    if (imageWrapper == null) {
        return;
    }
    var uuid = imageWrapper.readImage(path);
    if (uuid != null) {
        return new AutoImage(uuid);
    }
    return null;
};
/**
 * 读取在路径path的图片文件并返回一个{@link Bitmap}对象。如果文件不存在或者文件无法解码则返回null。
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param path 图片路径
 * @return Bitmap android的bitmap对象或者null
 */
ImageWrapper.prototype.readBitmap = function (path) {
    if (imageWrapper == null) {
        return;
    }
    return imageWrapper.readBitmap(path);
};

/**
 * 返回图片image在点(x, y)处的像素的ARGB值。
 * <p>
 * 该值的格式为0xAARRGGBB，是一个"32位整数"
 * <p>
 * 坐标系以图片左上角为原点。以图片左侧边为y轴，上侧边为x轴。
 *
 * @param image1 图片
 * @param x     要获取的像素的横坐标。
 * @param y     要获取的像素的纵坐标。
 * @return 整型
 */
ImageWrapper.prototype.pixelInImage = function (image1, x, y) {
    if (imageWrapper == null || image1 == null) {
        return;
    }
    return imageWrapper.pixelInImage(image1.uuid, x, y);
};


/**
 * 找图。在大图片image中查找小图片template的位置（模块匹配），找到时返回位置坐标区域(Rect)，找不到时返回null。
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param image1     大图片
 * @param template  小图片（模板）
 * @param x         找图区域 x 起始坐标
 * @param y         找图区域 y 起始坐标
 * @param ex 终点X坐标
 * @param ey 终点Y坐标
 * @param threshold 图片相似度。取值范围为0~1的浮点数。默认值为0.9。
 * @param limit 限制结果的数量，如果要找到1个，就填写1，如果是多个请填写多个
 * @return Rect 区域坐标对象数组或者null
 */
ImageWrapper.prototype.findImage = function (image1, template, x, y, ex, ey, threshold, limit) {
    if (imageWrapper == null || image1 == null || template == null) {
        return;
    }
    var res = imageWrapper.findImage(image1.uuid, template.uuid, x, y, ex - x, ey - y, threshold, limit);
    return this.toRectList(res);
};

/**
 * 找图。在当前屏幕中查找小图片template的位置（模块匹配），找到时返回位置坐标区域(Rect)，找不到时返回null。
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 * @param template  小图片（模板）
 * @param x         找图区域 x 起始坐标
 * @param y         找图区域 y 起始坐标
 * @param ex 终点X坐标
 * @param ey 终点Y坐标
 * @param threshold 图片相似度。取值范围为0~1的浮点数。默认值为0.9。
 * @param limit 限制结果的数量，如果要找到1个，就填写1，如果是多个请填写多个
 * @return Rect 区域坐标对象数组或者null
 */
ImageWrapper.prototype.findImageEx = function (template, x, y, ex, ey, threshold, limit) {
    if (imageWrapper == null || template == null) {
        return;
    }
    var res = imageWrapper.findImageCurrentScreen(template.uuid, x, y, ex - x, ey - y, threshold, limit);
    return this.toRectList(res);
};


/**
 * OpenCV模板匹配封装
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param image1         大图片
 * @param template      小图片（模板）
 * @param weakThreshold 图片相似度。取值范围为0~1的浮点数。默认值为0.9。
 * @param threshold     图片相似度。取值范围为0~1的浮点数。默认值为0.9。
 * @param rect          找图区域。参见findColor函数关于 rect 的说明
 * @param maxLevel      默认为-1，一般而言不必修改此参数。不加此参数时该参数会根据图片大小自动调整。找图算法是采用图像金字塔进行的, level参数表示金字塔的层次,
 *                      level越大可能带来越高的找图效率，但也可能造成找图失败（图片因过度缩小而无法分辨）或返回错误位置。因此，除非您清楚该参数的意义并需要进行性能调优，否则不需要用到该参数。
 * @param limit 限制结果的数量，如果要找到1个，就填写1，如果是多个请填写多个
 * @return Match集合 匹配到的集合
 */
ImageWrapper.prototype.matchTemplate = function (image1, template, weakThreshold, threshold, rect, maxLevel, limit) {
    if (imageWrapper == null || image1 == null || template == null) {
        return;
    }
    var drect = rect == null ? null : rect.toJSONString();
    var res = imageWrapper.matchTemplate(image1.uuid, template.uuid, weakThreshold, threshold, drect, maxLevel, limit);
    if (res == null) {
        return null;
    }
    var d = JSON.parse(res);
    var x = [];
    for (var i = 0; i < d.length; i++) {
        x.push(new Match(d[i]));
    }
    return x;
};


/**
 * OpenCV模板匹配封装，在当前屏幕截图中进行匹配
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param template      小图片（模板）
 * @param weakThreshold 图片相似度。取值范围为0~1的浮点数。默认值为0.9。
 * @param threshold     图片相似度。取值范围为0~1的浮点数。默认值为0.9。
 * @param rect          找图区域。参见findColor函数关于 rect 的说明
 * @param maxLevel      默认为-1，一般而言不必修改此参数。不加此参数时该参数会根据图片大小自动调整。找图算法是采用图像金字塔进行的, level参数表示金字塔的层次,
 *                      level越大可能带来越高的找图效率，但也可能造成找图失败（图片因过度缩小而无法分辨）或返回错误位置。因此，除非您清楚该参数的意义并需要进行性能调优，否则不需要用到该参数。
 * @param limit 限制结果的数量，如果要找到1个，就填写1，如果是多个请填写多个
 * @return Match集合 匹配到的集合
 */
ImageWrapper.prototype.matchTemplateEx = function (template, weakThreshold, threshold, rect, maxLevel, limit) {
    if (imageWrapper == null || template == null) {
        return;
    }
    var drect = rect == null ? null : rect.toJSONString();
    var res = imageWrapper.matchTemplateCurrentScreen(template.uuid, weakThreshold, threshold, drect, maxLevel, limit);
    if (res == null) {
        return null;
    }
    var d = JSON.parse(res);
    var x = [];
    for (var i = 0; i < d.length; i++) {
        x.push(new Match(d[i]));
    }
    return x;
};


/**
 * 在图片中找到颜色和color完全相等的点，；如果没有找到，则返回null。
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param image1 图片
 * @param color     要寻找的颜色
 * @param threshold 找色时颜色相似度取值为 0.0 ~ 1.0
 * @param x 区域的X起始坐标
 * @param y 区域的Y起始坐标
 * @param ex 终点X坐标
 * @param ey 终点Y坐标
 * @param limit 限制个数
 * @param orz 方向，分别从1-8
 * @return 多个Point 坐标点数组或者null
 */
ImageWrapper.prototype.findColor = function (image1, color, threshold, x, y, ex, ey, limit, orz) {
    if (imageWrapper == null || image1 == null) {
        return;
    }
    var res = imageWrapper.findColor(image1.uuid, color, threshold, x, y, ex - x, ey - y, limit, orz);
    if (res == null) {
        return null;
    }
    var d = JSON.parse(res);
    var x1 = [];
    for (var i = 0; i < d.length; i++) {
        x1.push(new Point(d[i]));
    }
    return x1;
};

/**
 * 在图片中找到颜色和color完全相等的点，参数从JSON中获取如果没有找到，则返回null。
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param image 图片
 * @param jsonFileName     res文件中取色工具生成的JSON文件，只要填写文件名称即可，后缀不用填写
 * @return 多个Point 坐标点数组或者null
 */
ImageWrapper.prototype.findColorJ = function (image1, jsonFileName) {
    if (imageWrapper == null || image1 == null) {
        return;
    }
    var data = readResString(jsonFileName + ".json");
    if (data == null) {
        return null;
    }
    data = JSON.parse(data);
    var firstColor = data['firstColor'];
    var threshold = data['threshold'];
    var x = data['x'];
    var y = data['y'];
    var ex = data['ex'];
    var ey = data['ey'];
    var limit = data['limit'];
    var orz = data['orz']

    return imageWrapper.findColor(image1.uuid, firstColor, threshold, x, y, ex - x, ey - y, limit, orz);
};

/**
 * 在当前屏幕中找到颜色和color完全相等的点，如果没有找到，则返回null。
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param color     要寻找的颜色
 * @param threshold 找色时颜色相似度取值为 0.0 ~ 1.0
 * @param x 区域的X起始坐标
 * @param y 区域的Y起始坐标
 * @param ex 终点X坐标
 * @param ey 终点Y坐标
 * @param limit 限制个数
 * @param orz 方向，分别从1-8
 * @return 多个Point 坐标点数组或者null
 */
ImageWrapper.prototype.findColorEx = function (color, threshold, x, y, ex, ey, limit, orz) {
    if (imageWrapper == null) {
        return;
    }
    var res = imageWrapper.findColorCurrentScreen(color, threshold, x, y, ex - x, ey - y, limit, orz);
    if (res == null) {
        return null;
    }
    var d = JSON.parse(res);
    var x1 = [];
    for (var i = 0; i < d.length; i++) {
        x1.push(new Point(d[i]));
    }
    return x1;
};


/**
 * 在当前屏幕中找到颜色和color完全相等的点，参数从JSON中获取如果没有找到，则返回null。
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param jsonFileName     res文件中取色工具生成的JSON文件，只要填写文件名称即可，后缀不用填写
 * @return 多个Point 坐标点数组或者null
 */
ImageWrapper.prototype.findColorExJ = function (jsonFileName) {
    if (imageWrapper == null) {
        return;
    }
    var data = readResString(jsonFileName + ".json");
    if (data == null) {
        return null;
    }
    data = JSON.parse(data);
    var firstColor = data['firstColor'];
    var threshold = data['threshold'];
    var x = data['x'];
    var y = data['y'];
    var ex = data['ex'];
    var ey = data['ey'];
    var limit = data['limit'];
    var orz = data['orz']
    return imageWrapper.findColorCurrentScreen(firstColor, threshold, x, y, ex - x, ey - y, limit, orz);
};


/**
 * 多点找色，找到所有符合标准的点，类似于按键精灵的多点找色
 * <p>
 * 整张图片都找不到时返回null
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param image1      要找色的图片
 * @param firstColor 第一个点的颜色
 * @param threshold 找色时颜色相似度取值为 0.0 ~ 1.0
 * @param points     字符串类似这样 6|1|0x969696-0x000010,1|12|0x969696,-4|0|0x969696
 * @param x 区域的X起始坐标
 * @param y 区域的Y起始坐标
 * @param ex 终点X坐标
 * @param ey 终点Y坐标
 * @param limit 限制个数
 * @param orz 方向，分别从1-8
 * @return 多个Point 坐标点数组或者null
 */
ImageWrapper.prototype.findMultiColor = function (image1, firstColor, points, threshold, x, y, ex, ey, limit, orz) {
    if (imageWrapper == null || image1 == null) {
        return;
    }
    var res = imageWrapper.findMultiColor(image1.uuid, firstColor, points, threshold, x, y, ex - x, ey - y, limit, orz);
    if (res == null) {
        return null;
    }
    var d = JSON.parse(res);
    var x1 = [];
    for (var i = 0; i < d.length; i++) {
        x1.push(new Point(d[i]));
    }
    return x1;
};


/**
 * 多点找色，找到所有符合标准的点，参数从JSON文件中读取，类似于按键精灵的多点找色
 * <p>
 * 整张图片都找不到时返回null
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param image1      要找色的图片
 * @param jsonFileName res文件中取色工具生成的JSON文件，只要填写文件名称即可，后缀不用填写
 * @return 多个Point 坐标点数组或者null
 */
ImageWrapper.prototype.findMultiColorJ = function (image1, jsonFileName) {
    //String image, String firstColor, String points, float threshold, int x, int y, int w, int h,int limit
    if (imageWrapper == null || image1 == null) {
        return;
    }
    var data = readResString(jsonFileName + ".json");
    if (data == null) {
        return null;
    }
    data = JSON.parse(data);
    var firstColor = data['firstColor'];
    var threshold = data['threshold'];
    var points = data['points'];
    var x = data['x'];
    var y = data['y'];
    var ex = data['ex'];
    var ey = data['ey'];
    var limit = data['limit'];
    var orz = data['orz'];
    return imageWrapper.findMultiColor(image1.uuid, firstColor, points, threshold, x, y, ex - x, ey - y, limit, orz);
};


/**
 * 多点找色，找到所有符合标准的点，自动抓取当前屏幕的图片，类似于按键精灵的多点找色
 * <p>
 * 整张图片都找不到时返回null
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param firstColor 第一个点的颜色
 * @param threshold  找色时颜色相似度取值为 0.0 ~ 1.0
 * @param points     字符串类似这样 6|1|0x969696-0x000010,1|12|0x969696,-4|0|0x969696
 * @param x 区域的X起始坐标
 * @param y 区域的Y起始坐标
 * @param ex 终点X坐标
 * @param ey 终点Y坐标
 * @param limit 限制个数
 * @param orz 方向，分别从1-8
 * @return 多个Point 坐标点数组或者null
 */
ImageWrapper.prototype.findMultiColorEx = function (firstColor, points, threshold, x, y, ex, ey, limit, orz) {
    //String firstColor, String points, float threshold, int x, int y, int w, int h
    if (imageWrapper == null) {
        return;
    }
    var res = imageWrapper.findMultiColorCurrentScreen(firstColor, points, threshold, x, y, ex - x, ey - y, limit, orz);
    if (res == null) {
        return null;
    }
    var d = JSON.parse(res);
    var x1 = [];
    for (var i = 0; i < d.length; i++) {
        x1.push(new Point(d[i]));
    }
    return x1;
};


/**
 * 多点找色，找到所有符合标准的点，自动抓取当前屏幕的图片,参数从JSON文件中读取，类似于按键精灵的多点找色
 * 整张图片都找不到时返回null
 * <Br/>
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param jsonFileName res文件中取色工具生成的JSON文件，只要填写文件名称即可，后缀不用填写
 * @return 多个Point 坐标点数组或者null
 */
ImageWrapper.prototype.findMultiColorExJ = function (jsonFileName) {
    if (imageWrapper == null) {
        return;
    }
    var data = readResString(jsonFileName + ".json");
    if (data == null) {
        return null;
    }
    data = JSON.parse(data);
    var firstColor = data['firstColor'];
    var threshold = data['threshold'];
    var points = data['points'];
    var x = data['x'];
    var y = data['y'];
    var ex = data['ex'];
    var ey = data['ey'];
    var limit = data['limit'];
    var orz = data['orz'];
    return imageWrapper.findMultiColorCurrentScreen(firstColor, points, threshold, x, y, ex - x, ey - y, limit, orz);
};

/**
 * 单点或者多点比色，找到所有符合标准的点，如果都符合返回true，否则是false
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param image1 图片
 * @param points     字符串类似这样 6|1|0x969696-0x000010,1|12|0x969696,-4|0|0x969696
 * @param threshold  找色时颜色相似度取值为 0.0 ~ 1.0
 * @param x 区域的X起始坐标，默认填写0全屏查找
 * @param y 区域的Y起始坐标，默认填写0全屏查找
 * @param ex 终点X坐标，默认填写0全屏查找
 * @param ey 终点Y坐标，默认填写0全屏查找
 * @return 布尔型，true代表找到了 false代表未找到
 */
ImageWrapper.prototype.cmpColor = function (image1, points, threshold, x, y, ex, ey) {
    if (imageWrapper == null || image1 == null) {
        return -1;
    }
    var ad = [points];
    var index = imageWrapper.cmpMultiColor(image1.uuid, JSON.stringify(ad), threshold, x, y, ex - x, ey - y);
    if (index === -1) {
        return false;
    }
    return true;
};

/**
 * 单点或者多点比色，找到所有符合标准的点，默认自己截图，如果都符合返回true，否则是false
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 *
 * @param points     字符串类似这样 6|1|0x969696-0x000010,1|12|0x969696,-4|0|0x969696
 * @param threshold  找色时颜色相似度取值为 0.0 ~ 1.0
 * @param x 区域的X起始坐标，默认填写0全屏查找
 * @param y 区域的Y起始坐标，默认填写0全屏查找
 * @param ex 终点X坐标，默认填写0全屏查找
 * @param ey 终点Y坐标，默认填写0全屏查找
 * @return 布尔型，true代表找到了 false代表未找到
 */
ImageWrapper.prototype.cmpColorEx = function (points, threshold, x, y, ex, ey) {
    if (imageWrapper == null) {
        return -1;
    }
    var ad = [points];
    var index = imageWrapper.cmpMultiColorCurrentScreen(JSON.stringify(ad), threshold, x, y, ex - x, ey - y);
    if (index === -1) {
        return false;
    }
    return true;
};

/**
 * 多点或者多点数组比色，找到所有符合标准的点，依次查找，如果找到就返回当前points的索引值，如果返回-1，说明都没有找到
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 * @param image1 图片
 * @param points     数组类似这样 ["6|1|0x969696-0x000010,1|12|0x969696,-4|0|0x969696","6|1|0x969696"]
 * @param threshold  找色时颜色相似度取值为 0.0 ~ 1.0
 * @param x 区域的X起始坐标，默认填写0全屏查找
 * @param y 区域的Y起始坐标，默认填写0全屏查找
 * @param ex 终点X坐标，默认填写0全屏查找
 * @param ey 终点Y坐标，默认填写0全屏查找
 * @return 整型，如果找到就返回当前points的索引值，如果返回-1，说明都没有找到
 */
ImageWrapper.prototype.cmpMultiColor = function (image1, points, threshold, x, y, ex, ey) {
    if (imageWrapper == null || image1 == null) {
        return -1;
    }
    return imageWrapper.cmpMultiColor(image1.uuid, JSON.stringify(points), threshold, x, y, ex - x, ey - y);
};
/**
 * 多点或者多点数组比色，找到所有符合标准的点，自动截屏，依次查找，如果找到就返回当前points的索引值，如果返回-1，说明都没有找到
 * 运行环境: 无限制
 * <Br/>
 * 兼容版本: Android 5.0 以上
 * @param points     数组类似这样 ["6|1|0x969696-0x000010,1|12|0x969696,-4|0|0x969696","6|1|0x969696"]
 * @param threshold  找色时颜色相似度取值为 0.0 ~ 1.0
 * @param x 区域的X起始坐标，默认填写0全屏查找
 * @param y 区域的Y起始坐标，默认填写0全屏查找
 * @param ex 终点X坐标，默认填写0全屏查找
 * @param ey 终点Y坐标，默认填写0全屏查找
 * @return 整型，如果找到就返回当前points的索引值，如果返回-1，说明都没有找到
 */
ImageWrapper.prototype.cmpMultiColorEx = function (points, threshold, x, y, ex, ey) {
    if (imageWrapper == null) {
        return -1;
    }
    return imageWrapper.cmpMultiColorCurrentScreen(JSON.stringify(points), threshold, x, y, ex - x, ey - y);
};


/**
 * 取得宽度
 * @param img 图片对象
 * @return int
 */
ImageWrapper.prototype.getWidth = function (img) {
    if (img == null) {
        return 0;
    }
    return imageWrapper.getWidth(img.uuid);
};

/**
 * 取得高度
 * @param img 图片对象
 * @return int
 */
ImageWrapper.prototype.getHeight = function (img) {
    if (img == null) {
        return 0;
    }
    return imageWrapper.getHeight(img.uuid);
};

/**
 * 保存到文件中
 * @param img 图片对象
 * @param path 路径
 * @return bool true代表成功，false 代表失败
 */
ImageWrapper.prototype.saveTo = function (img, path) {
    if (img == null) {
        return false;
    }
    return imageWrapper.saveTo(img.uuid, path);
};
/**
 * 转成base64的字符串
 * @param img 图片对象
 * @return string
 */
ImageWrapper.prototype.toBase64 = function (img) {
    if (img == null) {
        return null;
    }
    return javaString2string(imageWrapper.toBase64(img.uuid, "jpg", 100));
};

/**
 *  转成base64的字符串, jpg格式较小，可以减少内存
 * @param img 图片对象
 * @param format 格式  jpg或者 png
 * @param q 质量  1-100，质量越大 越清晰
 * @return 字符串
 */
ImageWrapper.prototype.toBase64Format = function (img, format, q) {
    if (img == null) {
        return null;
    }
    return javaString2string(imageWrapper.toBase64(img.uuid, format, q));
};
/**
 * 剪切图片
 * @param img 图片对象
 * @param x x起始坐标
 * @param y y起始坐标
 * @param ex 终点X坐标
 * @param ey 终点Y坐标
 * @return AutoImage 对象或者null
 */
ImageWrapper.prototype.clip = function (img, x, y, ex, ey) {
    if (img == null) {
        return null;
    }
    var xd = imageWrapper.clip(img.uuid, x, y, ex - x, ey - y);
    if (xd != null) {
        return new AutoImage(javaString2string(xd));
    }
    return null;
};
/**
 * 取得图片的某个点的颜色值
 * @param img 图片对象
 * @param x x坐标点
 * @param y y坐标点
 * @return int 颜色值
 */
ImageWrapper.prototype.pixel = function (img, x, y) {
    if (img == null) {
        return 0;
    }
    return imageWrapper.pixel(img.uuid, x, y);
};

/**
 * 取得Bitmap图片的某个点的颜色值
 * @param bitmap 图片对象
 * @param x x坐标点
 * @param y y坐标点
 * @return int 颜色值
 */
ImageWrapper.prototype.getPixelBitmap = function (bitmap, x, y) {
    if (imageWrapper == null) {
        return;
    }
    return imageWrapper.getPixelBitmap(bitmap, x, y);
};
/**
 * 取得Bitmap图片的某个区域点的颜色值，等同于 Bitmap.getPixels
 * @param bitmap 图片对象
 * @param arraySize 要返回的区域数组的大小
 * @param offset      写入到pixels[]中的第一个像素索引值
 * @param stride      pixels[]中的行间距个数值(必须大于等于位图宽度)。可以为负数
 * @param x          　从位图中读取的第一个像素的x坐标值。
 * @param y           从位图中读取的第一个像素的y坐标值
 * @param width    　　从每一行中读取的像素宽度
 * @param height 　　　读取的行数
 * @return int 颜色值数组
 */
ImageWrapper.prototype.getPixelsBitmap = function (bitmap, arraySize, offset, stride, x, y, width, height) {
    if (imageWrapper == null) {
        return;
    }
    return imageWrapper.getPixelsBitmap(bitmap, arraySize, offset, stride, x, y, width, height);
};

/**
 * 是否被回收了
 * @param img 图片对象
 * @return bool true代表已经被回收了
 */
ImageWrapper.prototype.isRecycled = function (img) {
    if (img == null) {
        return false;
    }
    return imageWrapper.isRecycled(img.uuid);
};

/**
 * 回收图片
 * @param img 图片对象
 * @return {*}
 */
ImageWrapper.prototype.recycle = function (img) {
    if (img == null) {
        return false;
    }
    return imageWrapper.recycle(img.uuid);
};


ImageWrapper.prototype.toRectList = function (res) {
    if (res == null) {
        return null;
    }
    var ps = JSON.parse(res);
    if (ps == null) {
        return null;
    }
    var d = [];
    for (var i = 0; i < ps.length; i++) {
        d.push(new Rect(ps[i]));
    }
    return d;
};

/**
 * 对AutoImage图片进行二值化
 * @param img AutoImage图片对象
 * @param type 二值化类型，一般写1即可
 * 0    灰度值大于阈值为最大值，其他值为<br/>
 * 1    灰度值大于阈值为0，其他值为最大值<br/>
 * 2    灰度值大于阈值的为阈值，其他值不变<br/>
 * 3    灰度值大于阈值的不变，其他值为0<br/>
 * 4    灰度值大于阈值的为零，其他值不变<br/>
 * 7    暂不支持<br/>
 * 8    大津法自动寻求全局阈值<br/>
 * 16    三角形法自动寻求全局阈值<br/>
 * @param threshold 二值化系数，0 ~ 255
 * @return AutoImage 对象或者null
 */
ImageWrapper.prototype.binaryzation = function (img, type, threshold) {
    if (img == null) {
        return null;
    }
    var xd = imageWrapper.binaryzation(img.uuid, type, threshold);
    if (xd != null) {
        return new AutoImage(javaString2string(xd));
    }
    return null;
};

/**
 * 对安卓的 Bitmap 图片进行二值化
 * @param bitmap Bitmap 图片对象
 * @param type 二值化类型，一般写1即可
 * 0    灰度值大于阈值为最大值，其他值为<br/>
 * 1    灰度值大于阈值为0，其他值为最大值<br/>
 * 2    灰度值大于阈值的为阈值，其他值不变<br/>
 * 3    灰度值大于阈值的不变，其他值为0<br/>
 * 4    灰度值大于阈值的为零，其他值不变<br/>
 * 7    暂不支持<br/>
 * 8    大津法自动寻求全局阈值<br/>
 * 16    三角形法自动寻求全局阈值<br/>
 * @param threshold 二值化系数，0 ~ 255
 * @return Bitmap 对象或者null
 */
ImageWrapper.prototype.binaryzationBitmap = function (bitmap, type, threshold) {
    if (bitmap == null) {
        return null;
    }
    return imageWrapper.binaryzationBitmap(bitmap, type, threshold);
};

/**
 * 剪裁图片，请自行判断参数，正确性
 * @param bitmap 图片
 * @param x 开始X坐标
 * @param y 开始Y坐标
 * @param w 剪裁宽度
 * @param h 剪裁高度
 * @return {Bitmap} 安卓的Bitmap对象
 */
ImageWrapper.prototype.clipBitmap = function (bitmap, x, y, w, h) {
    if (bitmap == null) {
        return null;
    }
    return imageWrapper.clipBitmap(bitmap, x, y, w, h);
};

/**
 * base64字符串转为Bitmap图片
 * @param data base64 数据
 * @param flag base64格式的标示，一般为0，
 * 可选参数为 ：0 默认， 1 无填充模式，2 无换行模式，4 换行模式
 * @return {Bitmap} 安卓的Bitmap对象
 */
ImageWrapper.prototype.base64Bitmap = function (data, flag) {
    if (data == null) {
        return null;
    }
    return imageWrapper.base64Bitmap(data, flag);
};
/**
 * 将AutoImage转换为安卓原生的Bitmap对象
 * @param img {AutoImage}
 * @return {Bitmap} 对象
 */
ImageWrapper.prototype.imageToBitmap = function (img) {
    if (img == null) {
        return null;
    }
    return imageWrapper.imageToBitmap(img.uuid);
};
/**
 * bitmap转为base64
 * @param bitmap 图片
 * @param format 格式，jpg或者png
 * @param q 质量  1 - 100
 * @return {string} base64字符串
 */
ImageWrapper.prototype.bitmapBase64 = function (bitmap, format, q) {
    if (bitmap == null) {
        return null;
    }
    var d = imageWrapper.bitmapBase64(bitmap, format, q);
    return javaString2string(d);
};

///**
// * 初始化OCR模块，百度PaddleOCR，具体请看相关文档
// * @param map map参数表
// * key分别为：
// *  modelDir: 百度Paddle OCR训练模型目录
// * labelFile: 百度Paddle OCR 文字文本路径
// * @return {bool} 布尔型 成功或者失败
// */
//ImageWrapper.prototype.initOcr = function (map) {
//    if (map == null) {
//        return imageWrapper.initOcr(null);
//    }
//    return imageWrapper.initOcr(JSON.stringify(map));
//};
//
///**
// * 释放OCR占用的资源
// * @return {bool} 成功或者失败
// */
//ImageWrapper.prototype.releaseOcr = function () {
//    return imageWrapper.releaseOcr();
//};
//
///**
// * 对Bitmap进行OCR，返回的是JSON数据，其中数据类似于与：
// *  [{"label":"奇趣装扮三阶盘化","confidence":0.48334712,"points":[{"x":11,"y":25},{"x":239,"y":10},{"x":241,"y":43},{"x":13,"y":59}]},{"label":"快来加入威房箱物","confidence":0.6789893,"points":[{"x":183,"y":264},{"x":429,"y":249},{"x":432,"y":298},{"x":186,"y":313}]},{"label":"养成","confidence":0.5535166,"points":[{"x":317,"y":305},{"x":463,"y":284},{"x":470,"y":333},{"x":324,"y":354}]}]
// *  <br/>
// *  label: 代表是识别的文字
// *  confidence：代表识别的准确度
// * points: 代表坐标，有4个值，分别是：左上方，右上方，右下方，左下方
// * @param bitmap 图片
// * @param timeout 超时时间 单位毫秒
// * @return {JSON} JSON字符串
// */
//ImageWrapper.prototype.ocrBitmap = function (bitmap, timeout) {
//    if (bitmap == null) {
//        return null;
//    }
//    var d = imageWrapper.ocrBitmap(bitmap, timeout);
//    if (d != null) {
//        return JSON.parse(d);
//    }
//    return d;
//};
//
//
