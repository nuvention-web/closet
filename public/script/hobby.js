$(document).ready(function(){
	$('#tabs').tabs();
	var lastClicked = null;
	$('.typeButton.buy').click(function(event) {
		$('.forRent').fadeOut();
		$('.forSale').fadeIn();
		if(lastClicked == this) {
			$('.forRent').fadeIn();
			lastClicked = null;
		} else lastClicked = this;
	});
	$('.typeButton.rent').click(function(event) {
		$('.forSale').fadeOut();
		$('.forRent').fadeIn();
		if(lastClicked == this) {
			$('.forSale').fadeIn();
			lastClicked = null;
		} else lastClicked = this;
	});
	$('#searchTags').on('input', function(event) {
		var val = $('#searchTags').val();
		if(!val) $.each($('#items>*'), function(idx, el){ $(el).fadeIn() });
		else {
			$.each($('#items>*'), function(idx, el) {
				console.log($(el).attr('tags'));
				if ($(el).attr('tags') && $(el).attr('tags').split(',').some(function(el) { return el.indexOf(val.toLowerCase()) != -1 })) {
					$(el).fadeIn();
				}
				else {
					$(el).fadeOut();
				}
			});
		}
	});
});