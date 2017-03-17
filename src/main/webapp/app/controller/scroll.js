$('#scroll-up').click(function() {
    $('#test').animate({scrollTop: "-=100"}, 500);
})

$('#scroll-down').click(function() {
    $('#test').animate({scrollTop: "+=100"}, 500);
})
