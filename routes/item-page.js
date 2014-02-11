exports.index = function(req, res){
	//produces item page
	req.isAuthenticated() ? res.render('item-page', { user: req.user }) : res.redirect('/login');
}