$('#scroll-up').click(function() {
    $('#test').animate({scrollTop: "-=40"}, 500);
})

$('#scroll-down').click(function() {
    $('#test').animate({scrollTop: "+=40"}, 500);
})