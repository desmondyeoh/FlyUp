$(document).ready(function(){
	//show and hide log in forms
	$('#log_in').on('click',function(){
		$('#log_in_form').fadeIn(1000);
	});
	$('#log_in_form #x').click(function(){
		$('#log_in_form').fadeOut(1000);
	});
	$(document).keydown(function(e){
		if(e.keyCode== 27){
			$('#log_in_form').fadeOut(1000);
		}
	});
});