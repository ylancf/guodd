

//同步截图

ImageWrapper.prototype.captureScreenEx = function (bounds) {

     let myImg;
    if(bounds){
        var  img = this.captureScreen(bounds.left,bounds.top,bounds.right,bounds.bottom);
    }else{
        var  img = this.captureFullScreen()
    }
     return  img;
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


S.prototype.getOneInfo=function (timeout){
    let result=null,_time=timeout|0;
    if(_time<=10){
        result=this.getOneNodeInfo(_time)
    }else{
        let dateTime=new Date().getTime()+_time;
        do {
            result=this.getOneNodeInfo(10);
            if(!result){break;}
        }while (new Date().getTime()<dateTime)
    }
    return result;
}



