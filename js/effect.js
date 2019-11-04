$(document).ready(function(){
	$("#plane_gif img")
		.hide()
		.fadeIn(400)
		.delay(400)
		.animate({
			bottom: '+=500px',
			left: '+=900px',
			opacity:0
		},800);
	
	$('.box')
		.hide()
		.fadeIn(1500);
});