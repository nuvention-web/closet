$.(document).ready(function() {
  $('.uploadform').hide();

  $('.uploadnew').click(function() {
  	$('.uploadform').slideDown();
  });

  $('.cancel').click(function() {
		$('.uploadform').find("input[type=text], textarea").val("");
		$('.uploadform').slideUp();
  });
});