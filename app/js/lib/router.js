var routeHandler = riot.observable();
routeHandler.changePage = function(pageName){

    //Make sure we hide the menu on any page-changes.
    if($('a7-side-menu').hasClass('active')) {
		$('a7-side-menu').removeClass('active');
    };
	$('.animate-on-page-change').animate({opacity: 0, scale: 0}, 500, 'ease-out');
	setTimeout(function(){
		routeHandler.trigger('switch-page', pageName)
	}, 500);
}