

//同步截图

ImageWrapper.prototype.captureScreenEx = function (bounds) {

     let myImg;
    if(bounds){
        var  img = this.captureScreen(bounds.left,bounds.top,bounds.right,bounds.bottom);
    }else{
        var  img = this.captureFullScreen()
    }
     return  img;





    // var imgCopy;
    // let thred= execSync(function() {
    //     //lock.lock();
    //     if(bounds){
    //         var  img = this.captureScreen(bounds.left,bounds.top,bounds.right,bounds.bottom);
    //     }else{
    //         var  img = this.captureFullScreen()
    //     }
    //     logd("img"+img);
    //     imgCopy.copy(img);
    //     logd("imgcopy"+imgCopy);
    //     sleep(10000);
    //     img.recycle();//回收图片
    //     //lock.unlock();
    // },1000);
    // logd("返回")
    // return imgCopy;


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
S.prototype.exist=function (){

    let res =this.getOneNodeInfo(0)
    if(res){
        return true;
    }else{
        return false;
    }


}