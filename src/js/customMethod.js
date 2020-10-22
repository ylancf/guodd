


//直到节点消失  返回值 消失返回true 否则 false
function  waitNodeDisappear(fun,value,outTime){
    while (outTime>0){
        if(fun(value).getOneNodeInfo(100)){
            sleep(100);
            outTime-=100;
        }else{
            return  true;
        }
    }
    return false;
}