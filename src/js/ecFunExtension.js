

//同步截图

ImageWrapper.prototype.captureScreenEx = function (bounds) {


    return  execSync(function() {
        var imgCopy;
        //lock.lock();
        if(bounds){
            var  img = this.captureScreen(bounds.left,bounds.top,bounds.right,bounds.bottom);
        }else{
            var  img = this.captureFullScreen()
        }
        imgCopy.copy(img);
        img.recycle();//回收图片
        //lock.unlock();
        return imgCopy;

    },1000);

};

//增加boundsEx()方法

NodeInfo.prototype.boundsEx=function (){
    return {
        top: this.bounds.top,
        left: this.bounds.left,
        right: this.bounds.right,
        bottom: this.bounds.bottom,
        centerX: function () { return Math.round((this.left + this.right) / 2) },
        centerY: function () { return Math.round((this.top + this.bottom) / 2); },
        width:function(){return Math.round(this.right-this.left);},
        height:function(){return Math.round(this.bottom-this.top);}
    }
}
//判断节点是否存在
NodeInfo.prototype.exist=function (){

    this.getOneNodeInfo(10)
    if(this==null){
        return false;
    }else{
        return true;
    }


}