//Created By Yacine Sdoka with ♡

/*  
        ______________  NOTES:  _______________


       * in draw function you can name it any name you like.

       * you can get context object using this keyword or the name of context that you have done.

       * setAutoRes is using to make canvas element updating the resulotion of the element every frame, it help you when you are using persent (%) unit in style.

       * it is easy to add style to the element as you like using setStyle/setCSS method.
       
       * setCSS method is same as setStyle method but 1st one it use object type css style, and 2nd one use text type css style.

       * when you call " new Canvas() " canvas's element is automatically add inside body element.
       * REMEMBER THAT THIS FRAMEWORK IS IN BETA VERSION 
*/

class Frames {
    constructor(){
        const frames = [["requestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame", "msRequestAnimationFrame"], ["cancelAnimationFrame", "mozCancelAnimationFrame", "webkitCancelAnimationFrame", "msCancelAnimationFrame"]];
        var x, y;
        for(x=0;x<frames.length;x++){
            if(typeof window[frames[0][x]] === "function")break;
        }
        const requestAnimationFrame = window[frames[0][x]];
        const cancelAnimationFrame = window[frames[1][x]];
        const frame = function (call, fps, context){
            if(requestAnimationFrame){
                requestAnimationFrame(function(t){
                    call.apply(context);
                    //call(t);
                });
            }else setTimeout(function(){
                call(Date.now());
            }, 1000/(fps? fps : 60));
        };
        return frame;
    }
}
class Canvas extends Frames {
    constructor(cvs, type, s){
        const frame = super();
        cvs = (cvs instanceof Element?cvs:
            (typeof cvs == "string"?
            document.getElementById(cvs):null));
        if(cvs===null)
            cvs = document.createElement("canvas");
        if(!s){
            //if();
            if(document.body){
                if(!document.body.contains(cvs))setUp();
            }else window.addEventListener("load", setUp);
        }
        function setUp(){
            document.body.appendChild(cvs);
        }
        const ctx = cvs.getContext(type?type:"2d");
        const imgData = new Image();
        function setResulotion(){
            cvs.width = cvs.offsetWidth;
            cvs.height = cvs.offsetHeight;
        }
        ctx.fillCText = function(text, x, y, mw){
            text = String(text);
            mw = isNaN(mw)?this.canvas.width:mw;
            var h = parseInt(this.font);
            var word = text.split(" ");
            word[word.length-1] = word[word.length-1].replace("%d%3", " ");
            var line = "", l = 1;
            var i, testLine, w;
            for(i=0;i<word.length;i++){
                testLine = line + word[i] + " ";
                w = this.measureText(testLine);
                if(w.width > mw && i > 0){
                    this.fillText(line, x, y);
                    line = word[i] + " ";
                    y += h;l++;
                }else line = testLine;
                this.fillText(line, x, y);
            }
            return l;
        };
        function getRandom(min, max){
            return Math.floor(Math.random()*(max-min+1))+min;
        }
        ctx.setStyle = function(s){
            //if((/(:;{})/).test(s))
                this.canvas.style = s;
            return this;
        };
        ctx.width = function(){return this.canvas.width;};
        ctx.height = function(){return this.canvas.height;};
        ctx.Glitch = function(callBack, x, y, w, h){
            if(isNaN(x)||isNaN(y))return;
            w = w?w:this.canvas.width;
            h = h?h:this.canvas.height;
            const bitMap = this.canvas.toDataURL();
            //const bitData = this.getImageData(0, 0, w, h);
            var v = Math.round(getRandom(h/10, h/60));
            var mHOffset = getRandom(7, 20);
            var mWOffset = getRandom(w*2, w*4);
            var hOffset, wOffset, i, n = 0;
            imgData.onload = function(){
                //ctx.clearRect(0, 0, w, h);
                for(i=0;i<v;i++){
                    hOffset = getRandom(-Math.abs(mHOffset), mHOffset);
                    wOffset = getRandom(-Math.abs(mWOffset), mWOffset);
                    //ctx.putImageData(bitData, 0, i * v, w, i * v + v, hOffset, i * v, h, i * v + v);
                    ctx.drawImage(imgData, 0, i * v, wOffset, i * v + v, hOffset, i * v, wOffset, i * v + v);
                }
                if(n<getRandom(2, 25)){
                    n++;
                    setTimeout(imgData.onload, getRandom(10, 120));
                }
                else if(typeof callBack == "function")callBack();
            };
            imgData.src = bitMap;
            //this.putImageData(bitData, 0, 0);
        };
        var i;
        ctx.canAutoRes = false;
        const drawsArray = [];
        const drawing = (t) => {
            if(ctx.canAutoRes)setResulotion();
            for(i=0;i<drawsArray.length;i++){
                drawsArray[i].call(ctx);
            }
            frame(drawing);
        };
        ctx.setDraw = function(call, fps){
            if(typeof call === "function")drawsArray.push(call);
            return this;
        };
        ctx.PI = 2*Math.PI;
        ctx.setEvent = function(e, f, y){
            e = String(e).split(" ");
            var i;
            for(i=0;i<e.length;i++)
                this.canvas.addEventListener(e[i], f, y);
            return this;
        };
        ctx.setAutoRes = function(t){
            if(t === true || t === false)
            this.canAutoRes = t;
            return ctx;
        };
        ctx.setCSS = function(s){
            var a,b,v=[],n=[];
            for(a in s){v.push(s[a]);n.push(a);}
            for(a=0;a<n.length;a++){this.canvas.style[n[a]]=v[a];}
            return this;
        };
        ctx.roundRect = function(x, y, w, h, r, fl, stk){
            var s;
            if(typeof r === "undefined"){r = 0;}
              if(typeof r === "number"){
                r = {tl: r, tr: r, br: r, bl: r};
            }else{
                var dR = {tl: 0, tr: 0, br: 0, bl: 0};
                for(s in dR){
                    r[s] = (r[s] || dR[s]);
                }
            }
            this.beginPath();
            var sw = x + w;
            var sh = y + h;
            this.moveTo((x + r.tl), y);
            this.lineTo((sw - r.tr), y);
            this.quadraticCurveTo(sw, y, sw, (y + r.tr));
            this.lineTo(sw, (sh - r.br));
            this.quadraticCurveTo(sw, sh, (sw - r.br), sh);
            this.lineTo((x + r.bl), sh);
            this.quadraticCurveTo(x, sh, x, (sh - r.bl));
            this.lineTo(x, (y + r.tl));
            this.quadraticCurveTo(x, y, (x + r.tl), y);
            this.closePath();
            if(fl){this.fill();}
            if(stk){this.stroke();}
        };
        ctx.setValue = function(v, x, y){
            this.save();
            var w = this.measureText(" "+v+" ").width;
            var h = parseInt(this.font.split(" ")[0]);
            this.fillStyle = "rgba(100, 100, 100, 0.6)";
            this.roundRect(x, y-3, w, h+8, 5);
            this.fill();
            this.textBaseline = "top";
            this.textAlign = "start";
            this.fillStyle = "white";
            this.fillText(" "+v, x, y);
            this.restore();
        };
        drawing(Date.now());
        ctx.author = "Yacine Sdoka";
        return ctx;
    }
}
Canvas.toString = function(){return "class Canvas { [Hidden Class] }";};
Canvas.toString.toString = null;
Frame.toString = function(){return "class Frame { [Hidden Class] }";};
Frame.toString.toString = null;
Math.floorTo = function(n, t=0){
    n = parseFloat(n);
    if(this.floor(n)===n||isNaN(t))return n;
    n = String(n).split(".");
    n[1] = n[1].substr(0, t);
    return parseFloat(n.join("."));
};
Math.roundTo = function(n, t=0){
    n = parseFloat(n);
    if(this.floor(n)===n||isNaN(t))return this.round(n);
    n = String(n).split(".");
    var cn = n[1].length-String(parseInt(n[1])).length;
    n[1] = n[1].substr(0, t+1);
    n[1] = ("0").repeat(cn)+this.round(Number(n[1])/10);
    return parseFloat(n.join("."));
};
