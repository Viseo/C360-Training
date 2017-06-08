/**
 * Created by CLH3623 on 07/06/2017.
 */


Vue.component('customcircle', {
    props:["cx","cy", "content", "custom"],
    template: `<svg>
            
            <line v-show="show1()" :x1="cx" :y1="cy" :x2="cx1" :y2="cy1" style="stroke:#09aa76;stroke-width:2;" /> 
            <line v-show="show2()" :x1="cx" :y1="cy" :x2="cx2" :y2="cy2" style="stroke:#09aa76;stroke-width:2;" /> 
            <line v-show="show3()" :x1="cx" :y1="cy" :x2="cx3" :y2="cy3" style="stroke:#09aa76;stroke-width:2;" />
            <circle :id="cx+''+cy" @click="checkLine" :cx="cx" :cy="cy" r="50" fill="#09aa76" stroke="#075338" stroke-width="2"></circle> 
            <text :x="cx-25" :class="mySize" :y="cy+8" style="fill: #fff;">{{content}}</text>
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
            cy3: ""
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
            else {
                var el = document.getElementById(this.state.cx+''+this.state.cy);
                this.state.cx1 = this.cx;
                this.state.cy1 = this.cy;
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