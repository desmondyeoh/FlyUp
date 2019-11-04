$(document).ready(function(){
	$('#female').hide();
	$("#male_radio,#female_radio").change(function(){
		if($('#male_radio').is(':checked')) {
			$('#female').hide();
			$('#male').fadeIn(500);
		}
		if($('#female_radio').is(':checked')) {
			$('#male').hide();
			$('#female').fadeIn(500);
		}
	});
});