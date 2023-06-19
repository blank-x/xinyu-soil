//倒计时60秒
export default function(){
    let counFlag = null
    return function(duration,countCb,finishCb){
        if(counFlag){
            return
        }
        counFlag = true;
        var iSecond = duration;
        var timer;
        iSecond--;
        timer = setInterval(function () {
            if (iSecond < 0) {
                clearInterval(timer);
                counFlag = false;
                finishCb ? finishCb():"";
            } else {
                countCb && countCb(iSecond)
                iSecond--;
            }
        }, 1000);
    }

}
