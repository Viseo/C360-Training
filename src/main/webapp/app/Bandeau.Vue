<template>
    <div :style="styleBandeau"></div>
</template>

<script>
    export default{
        props: ['colorr','size' ],
        data: function(){
            return {
                styleBandeau: {
                    'padding': this.size + 'px',
                    'background-color': this.color,
                    'margin-bottom': '30px'
                }
            }
        }
    }
</script>