/**
 * Created by CLH3623 on 07/06/2017.
 */


Vue.component('customcircle', {
    props:["cx","cy", "content"],
    template: `<svg>
            
            <line v-show="show1()" :x1="cxLine" :y1="cyLine" :x2="cx1" :y2="cy1" style="stroke:#09aa76;stroke-width:2;" /> 
            <line v-show="show2()" :x1="cxLine" :y1="cyLine" :x2="cx2" :y2="cy2" style="stroke:#09aa76;stroke-width:2;" /> 
            <line v-show="show3()" :x1="cxLine" :y1="cyLine" :x2="cx3" :y2="cy3" style="stroke:#09aa76;stroke-width:2;" />
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
            cyLine:"",
            cxLine:""
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
        checkLine(){
            if(this.state.cx == "" && this.state.cy == ""){
                var el = document.getElementById(this.cx+''+this.cy);
                this.state.cx = this.cx;
                this.state.cy = this.cy;
                el.style.fill="#075338";
                el.style.stroke="#09aa76"
            }
            else { //state.cx --> cx1 state.cy -- cy1 state.cx1 --> cx state.cy1 --> cy
                var el = document.getElementById(this.state.cx+''+this.state.cy);
                if(this.state.cx == this.cx && this.state.cy > this.cy){ //haut
                    this.state.cy = this.state.cy - 50;
                    this.cxLine = this.cx;
                    this.cyLine = this.cy + 50;
                }
                else if(this.state.cx == this.cx && this.state.cy < this.cy){ //bas
                    this.state.cy = this.state.cy + 50;
                    this.cxLine = this.cx;
                    this.cyLine = this.cy - 50;
                }
                else if(this.state.cx > this.cx && this.state.cy == this.cy){ //gauche
                    this.state.cx = this.state.cx - 50;
                    this.cxLine = this.cx + 50;
                    this.cyLine = this.cy;
                }
                else if(this.state.cx < this.cx && this.state.cy == this.cy){ //droit
                    this.state.cx = this.state.cx + 50;
                    this.cxLine = this.cx - 50;
                    this.cyLine = this.cy;
                }else if(this.state.cx > this.cx && this.state.cy > this.cy){ //gauche haut
                    console.log("HELLO gauche haut");
                    this.state.cx = this.state.cx - Math.sqrt(50);
                    this.state.cy = this.state.cy - Math.sqrt(50);
                    this.cxLine = this.cx + Math.sqrt(50);
                    this.cyLine = this.cy + Math.sqrt(50);
                }else if(this.state.cx < this.cx && this.state.cy > this.cy){ //droit haut
                    console.log("HELLO droit haut");
                    this.state.cx = this.state.cx + Math.sqrt(50);
                    this.state.cy = this.state.cy - Math.sqrt(50);
                    this.cxLine = this.cx - Math.sqrt(50);
                    this.cyLine = this.cy + Math.sqrt(50);
                }else if(this.state.cx > this.cx && this.state.cy < this.cy){ //gauche bas
                    console.log("HELLO gauche bas");
                    this.state.cx = this.state.cx - Math.sqrt(50);
                    this.state.cy = this.state.cy + Math.sqrt(50);
                    this.cxLine = this.cx + Math.sqrt(50);
                    this.cyLine = this.cy - Math.sqrt(50);
                }else if(this.state.cx < this.cx && this.state.cy < this.cy){ //droit bas
                    console.log("HELLO droit bas");
                    this.state.cx = this.state.cx + Math.sqrt(50);
                    this.state.cy = this.state.cy + Math.sqrt(50);
                    this.cxLine = this.cx - Math.sqrt(50);
                    this.cyLine = this.cy - Math.sqrt(50);
                }
                this.state.cx1 = this.cxLine;
                this.state.cy1 = this.cyLine;
                if (this.cx1=="" && this.cy1==""){
                    el.style.fill="#09aa76";
                    el.style.stroke="#075338";
                    this.cx1 = this.state.cx;
                    this.cy1 = this.state.cy;
                    this.state.cx = '';
                    this.state.cx1 = '';
                    this.state.cy = '';
                    this.state.cy1 = '';
                }
                else if (this.cx2=="" && this.cy2==""){
                    this.cx2 = this.state.cx;
                    this.cy2 = this.state.cy;
                    this.state.cx = '';
                    this.state.cx1 = '';
                    this.state.cy = '';
                    this.state.cy1 = '';
                }
                else if (this.cx3=="" && this.cy3==""){
                    this.cx3 = this.state.cx;
                    this.cy3 = this.state.cy;
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