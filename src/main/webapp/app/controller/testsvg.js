
vue = new Vue({
    el: '#pills',
    data: {
        show:false,
        cxCircle1:50,
        cyCircle1:50,
        rCircle1:45,
        cxCircle2:200,
        cyCircle2:200,
        rCircle2:45,
        cxCircle3:50,
        cyCircle3:200,
        rCircle3:45,
        x1Line:'',
        y1Line:'',
        x2Line:'',
        y2Line:'',
        nbClickToRemove:0
    },
    methods:{
        change(cx,cy,name){
            if(this.nbClickToRemove != 1){
                if(this.x1Line == '' && this.x2Line == ''){
                    this.x1Line = cx;
                    this.y1Line = cy;
                }else if(this.x1Line != '' && this.x2Line == ''){
                    this.x2Line = cx;
                    this.y2Line = cy;
                    this.show = !this.show;
                }else{
                    this.nbClickToRemove++;
                }
            }else if(this.nbClickToRemove == 1){
                this.x1Line = '';
                this.x2Line = '';
                this.y1Line = '';
                this.y2Line = '';
                this.nbClickToRemove = 0;
                this.show = !this.show;
            }
        }
    }
});

