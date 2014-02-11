<<<<<<< HEAD
$(document).ready(function() {
							
=======
function getItems(query, cb) {
}

function loadDirect(data) {
	if(data)	$('.itemFlowContainer').append(data);
}

$(document).ready(function() {
	
	$.ajax({
		url: '/items/masters',
		method: 'GET' })
	.done(function(data) {
		console.log(data);
		loadDirect(data);
	});
>>>>>>> 574d51c508e3df5aa4a964bdf85a5e4e4b8d7e5e
});