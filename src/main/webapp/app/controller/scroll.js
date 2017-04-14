$('#scroll-up').click(function() {
    $('#test').animate({scrollTop: "-=100"}, 500);
})

$('#scroll-down').click(function() {
    $('#test').animate({scrollTop: "+=100"}, 500);
})
$('#scroll-up-2').click(function() {
    console.log("coucou");
    $('#scroll').animate({scrollTop: "-=100"}, 500);
})

$('#scroll-down-2').click(function() {
    console.log("coucou");
    $('#scroll').animate({scrollTop: "+=100"}, 500);
})

$('#test').bind('mousewheel DOMMouseScroll', function(event){
    if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
        $('#test').animate({scrollTop: "-=100"}, 80);
    }
    else{
        $('#test').animate({scrollTop: "+=100"}, 80);
    }
});
