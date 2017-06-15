/**
 * Created by CLH3623 on 07/06/2017.
 */


Vue.component('customcircle', {
    props:["cx","cy", "content"],
    template: `<svg>
            
            <line v-show="show1()" :x1="cxLine1" :y1="cyLine1" :x2="cx1" :y2="cy1" style="stroke:black;stroke-width:2;" /> 
            <line v-show="show2()" :x1="cxLine2" :y1="cyLine2" :x2="cx2" :y2="cy2" style="stroke:black;stroke-width:2;" /> 
            <line v-show="show3()" :x1="cxLine3" :y1="cyLine3" :x2="cx3" :y2="cy3" style="stroke:black;stroke-width:2;" />
            <circle class="test" :id="cx+''+cy" @click="checkLine" :cx="cx" :cy="cy" r="50" fill="#09aa76" stroke="#075338" stroke-width="2"></circle> 
            <text text-anchor="middle" :x="cx" :class="mySize" :y="cy+8" style="fill: #fff;">{{content}}</text>
            </svg>
`,
    data: function() {
        return{
            svgStore: svgStore,
            state: svgStore.state,
            cx1: "",
            cy1: "",
            cx2: "",
            cy2: "",
            cx3: "",
            cy3: "",
            cyLine1:"",
            cxLine1:"",
            cyLine2:"",
            cxLine2:"",
            cyLine3:"",
            cxLine3:"",
        }
    },
    computed: {
        mySize(){
            console.log(this.content.length);
            if(this.content.length>4) {
                return 'smallSize'
            }
            else return 'defaultSize';
        }
    },
    methods: {
        calculatePosition(cxLine,cyLine){
            if(this.state.cx == this.cx && this.state.cy > this.cy){ //haut
                console.log("HELLO haut");
                this.state.cy = this.state.cy - 50;
                cxLine = this.cx;
                cyLine = this.cy + 50;
            }
            else if(this.state.cx == this.cx && this.state.cy < this.cy){ //bas
                console.log("HELLO bas");
                this.state.cy = this.state.cy + 50;
                cxLine = this.cx;
                cyLine = this.cy - 50;
            }
            else if(this.state.cx > this.cx && this.state.cy == this.cy){ //gauche
                console.log("HELLO gauche");
                this.state.cx = this.state.cx - 50;
                cxLine = this.cx + 50;
                cyLine = this.cy;
            }
            else if(this.state.cx < this.cx && this.state.cy == this.cy){ //droit
                console.log("HELLO droit");
                this.state.cx = this.state.cx + 50;
                cxLine = this.cx - 50;
                cyLine = this.cy;
            }
            else if(this.state.cx > this.cx && this.state.cy > this.cy){ //gauche haut
                console.log("HELLO gauche haut");
                var xDistance = Math.abs(this.state.cx - this.cx);
                var yDistance = Math.abs(this.state.cy - this.cy);
                this.state.cx = this.state.cx - 50*Math.cos(Math.atan(yDistance/xDistance));
                this.state.cy = this.state.cy - 50*Math.sin(Math.atan(yDistance/xDistance));
                cxLine = this.cx + 50*Math.cos(Math.atan(yDistance/xDistance));
                cyLine = this.cy + 50*Math.sin(Math.atan(yDistance/xDistance));
            }
            else if(this.state.cx < this.cx && this.state.cy > this.cy){ //droit haut
                console.log("HELLO droit haut");
                var xDistance = Math.abs(this.state.cx - this.cx);
                var yDistance = Math.abs(this.state.cy - this.cy);
                this.state.cx = this.state.cx + 50*Math.cos(Math.atan(yDistance/xDistance));
                this.state.cy = this.state.cy - 50*Math.sin(Math.atan(yDistance/xDistance));
                cxLine = this.cx - 50*Math.cos(Math.atan(yDistance/xDistance));
                cyLine = this.cy + 50*Math.sin(Math.atan(yDistance/xDistance));
            }
            else if(this.state.cx > this.cx && this.state.cy < this.cy){ //gauche bas
                console.log("HELLO gauche bas");
                var xDistance = Math.abs(this.state.cx - this.cx);
                var yDistance = Math.abs(this.state.cy - this.cy);
                this.state.cx = this.state.cx - 50*Math.cos(Math.atan(yDistance/xDistance));
                this.state.cy = this.state.cy + 50*Math.sin(Math.atan(yDistance/xDistance));
                cxLine = this.cx + 50*Math.cos(Math.atan(yDistance/xDistance));
                cyLine = this.cy - 50*Math.sin(Math.atan(yDistance/xDistance));
            }
            else if(this.state.cx < this.cx && this.state.cy < this.cy){ //droit bas
                console.log("HELLO droit bas");
                var xDistance = Math.abs(this.state.cx - this.cx);
                var yDistance = Math.abs(this.state.cy - this.cy);
                this.state.cx = this.state.cx + 50*Math.cos(Math.atan(yDistance/xDistance));
                this.state.cy = this.state.cy + 50*Math.sin(Math.atan(yDistance/xDistance));
                cxLine = this.cx - 50*Math.cos(Math.atan(yDistance/xDistance));
                cyLine = this.cy - 50*Math.sin(Math.atan(yDistance/xDistance));
            }
            else{ //ne pas generer le trait
                this.state.cx = 0;
                this.state.cy = 0;
                cxLine = 0;
                cyLine = 0;
            }
            this.state.cx1 = cxLine;
            this.state.cy1 = cyLine;
            var resulat = [];
            resulat.push(cxLine);
            resulat.push(cyLine);
            resulat.push(this.state.cx);
            resulat.push(this.state.cy);
            return resulat;
        },
        checkLine(){
            if(this.state.cx == "" && this.state.cy == ""){
                var el = document.getElementById(this.cx+''+this.cy);
                this.state.cx = this.cx;
                this.state.cy = this.cy;
                el.style.fill="#075338";
                el.style.stroke="#09aa76"
            }
            else {
                var el = document.getElementById(this.state.cx+''+this.state.cy);
                if (this.cx1=="" && this.cy1==""){
                    el.style.fill="#09aa76";
                    el.style.stroke="#075338";
                    var tmp = this.calculatePosition(this.cxLine1,this.cyLine1);
                    this.cxLine1 = tmp[0];
                    this.cyLine1 = tmp[1];
                    this.cx1 = tmp[2];
                    this.cy1 = tmp[3];
                    this.state.cx = '';
                    this.state.cx1 = '';
                    this.state.cy = '';
                    this.state.cy1 = '';
                }
                else if (this.cx2=="" && this.cy2==""){
                    var tmp = this.calculatePosition(this.cxLine2,this.cyLine2);
                    this.cxLine2 = tmp[0];
                    this.cyLine2 = tmp[1];
                    this.cx2 = tmp[2];
                    this.cy2 = tmp[3];
                    this.state.cx = '';
                    this.state.cx1 = '';
                    this.state.cy = '';
                    this.state.cy1 = '';
                }
                else if (this.cx3=="" && this.cy3==""){
                    var tmp = this.calculatePosition(this.cxLine3,this.cyLine3);
                    this.cxLine3 = tmp[0];
                    this.cyLine3 = tmp[1];
                    this.cx3 = tmp[2];
                    this.cy3 = tmp[3];
                    this.state.cx = '';
                    this.state.cx1 = '';
                    this.state.cy = '';
                    this.state.cy1 = '';
                }
            }
        },
        show1() {
            if(this.cx1!="" && this.cy1 != "") {
                return true;
            }
            else return false;
        },
        show2() {
            if(this.cx2!="" && this.cy2 != "") {
                return true;
            }
            else return false;
        },
        show3() {
            if(this.cx3!="" && this.cy3 != "") {
                return true;
            }
            else return false;
        }
    }
});

Vue.component('container-svg', {
    template: `
<div>
<div class="header"><br><h1>Spike SVG</h1></div>
  <form @submit.prevent="addCircle">
  <center>
  <div class="col-lg-2 col-md-2 col-md-offset-4 col-lg-offset-4">
      <input class="form-control col-lg-3" type="text" v-model="text1">
        </div>

      <button class="col-lg-1 col-md-1 btn btn-default">Ajouter !</button>
  </center>
  </form>  
    
    <div class="svg-content" id="test">
    <svg version="1.1" viewBox="0 0 1250 1250" preserveAspectRatio="xMinYMin meet">
        <g v-for="i in numberOfCircle" v-cloak>
            <customcircle :cx="positionX(i)" :cy="positionY(i)" :content="text[i-1]"></customcircle>
        </g>
    </svg>
    </div>
</div> `,
    data: function() {
        return {
            text1: '',
            text: [],
            posX: 100,
            posY: 100,
            numberOfCircle: 0,
            row:0
        }
    },
    methods: {
        positionX(integ){
            if(Math.floor(integ/9)*150 ==0) {
                if(integ!=0 && integ%9!=0) {
                    return this.posX + (integ%9-1) * 150;
                }
                else {
                    this.posX = 100;
                    return this.posX;
                }
            }
            else {
                if(integ!=0 && integ%9!=0) {
                    return this.posX + (integ%9) * 150;
                }
                else {
                    this.posX = 100;
                    return this.posX;
                }
            }
        },
        positionY(integ){
            return this.posY + Math.floor(integ/9)*150;
        },
        addCircle() {
            this.text.push(this.text1);
            this.numberOfCircle++;
            this.text1="";
        }
    }
});

class SvgStore {
    constructor() {
        this.state = {
            cx:"",
            cy:"",
            cx1:"",
            cy1:""
        }
    }
}
let svgStore = new SvgStore();

new Vue({
    el: '#pills',
});