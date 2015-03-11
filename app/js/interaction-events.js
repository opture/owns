            //$('#content').css('-webkit-overflow-scrolling', 'touch');
/* jshint eqeqeq:false, eqnull:true */

	//Toggle if app should show sidebar.
	document.querySelectorAll("[togglesidebar]")[0].addEventListener('click', function(){
		document.querySelectorAll("[app]")[0].classList.toggle('showsidebar');
	});
	$('[app]').on('tap', function(){
		console.log('remove sidebar');
		if ( this.classList.contains('showsidebar') ){
			this.classList.remove('showsidebar');	
			return false;
		}
		
		
	});
		//Use the viewportchecker to show elements.
    	$(function(){
            jQuery('.hidden').viewportChecker({
                classToAdd: 'fadeInLeft ',
                offset:10
            });
        });
        $('[main]').on('scroll', function(){
            console.log('st: ' + $(this).scrollTop());
            console.log('ih: ' + $(this).innerHeight());
            console.log('sh: ' + this.scrollHeight);
            if(this.scrollHeight -100 < ($(this).innerHeight() + $(this).scrollTop()) ){
                console.log("hit ol' rock bottom, reload more content");
                //Trigger the event for the current store to fetch more data from end-point.

            }
        });

function animateToTop(relativePx, item,parent){
	'use strict';
	var translateLeft = 0;
	var percentSpeed = relativePx / $(window).height();
	var animateTime = 500 * percentSpeed;
	if (animateTime < 200) {animateTime = 200;}

	//Clone the element to be animated.
	var animatee = item.clone();

	//Find the center of the screen and subtract half the width of the element to make it centered.
	translateLeft = ( item.offset().left - ( $(window).width() / 2 - item.outerWidth() / 2 ) ) * -1;

	//Set the offset to the same as the original element.
	animatee.offset(item.offset());

	// Position the cloned element, and define the transition.
	animatee.css({
		'width': item.css('width'),
		'position':'absolute',
		'background':'white',
		'-webkit-transition':'-webkit-transform ' + animateTime + 'ms ease-in',
		'transition':'transform ' + animateTime + 'ms ease-in'
	});

	// If there are hidden items, toggle visibility and calculate width and top.
	if (item.attr('hidden')) {

		item.removeAttr('hidden');
		animatee.css({'width': item.css('width')});

		// Scale up when there is a wider screen.
		if ($(document).width() > 767 ){
			relativePx =  $(window).height() - (item.offset().top - relativePx );

		}else
		{
			relativePx =  $(window).height() - (item.offset().top - relativePx);
		}

		//Change the offset.
		animatee.offset({top: $(window).height(), left:item.offset().left});

		//Take away the hidden attribute.
		animatee.removeAttr('hidden');

		//Calculate the distance to move to the left.
		translateLeft = ( item.offset().left - ( $(window).width() / 2 - item.outerWidth() / 2 ) ) * -1;

		//Hide the original element.
		item.attr('hidden','');
	}

	//Use setTImeout to let dom update when cloned element is appended.
	setTimeout(function(){
		parent.append(animatee);
	},1);


	//use a longer timeout to set the transition properties for the element.
	setTimeout(function(){
		//For wider screens scale up 1.5.
		if ($(document).width()>767){
			animatee.css({
				'-webkit-transform':'translate(' + translateLeft + 'px,' + relativePx * -1 + 'px) scale(1.5,1.5)',
				'transform':'translate(' + translateLeft + 'px,' + relativePx * -1 + 'px) scale(1.5,1.5)',
				'opacity':'1'
			});
		} else {
			animatee.css({
				'-webkit-transform':'translate(' + translateLeft + 'px,' + relativePx * -1 + 'px)',
				'transform':'translate(' + translateLeft + 'px,' + relativePx * -1 + 'px)',
				'opacity':'1'
			});
		}
		item.css('opacity','0.1');

	}, 150);
}

function animateInRow(top,items,parent,count,reverse){
	'use strict';

	//If all items are looped over return from the function.
	if (items.length == count || (reverse && count == -1)) {
		return;
	}

	//First run, set the counter to 0, or the length of children elements of the animatee.
	//Set reverse to true if we are going backwards through the children.
	if (count == null) {
		if (top < 0){
			count = items.length - 1;
			reverse = true;
		}else{
			count = 0;
			reverse = false;
		}
	}

	//Adjust the animation time based on the distance.
	var percentSpeed = top / $(window).height();
	var animateTime = 100 * percentSpeed;
	if (animateTime < 50) {animateTime = 50;}


	setTimeout(function(){
		//Wider screens, scaling up 1.5 so recalculate the translate distance.
		if ($(document).width() > 767 ){
			if (reverse){
				top = top + ((items.eq(count).height() * 0.5  ) / 2);
			}else{
				top = top - ((items.eq(count).height() * 0.5  ) / 2);
			}
		}

		animateToTop(top,items.eq(count),parent);

		if ($(document).width() > 767 ){
			if (reverse){
				top = top + ((items.eq(count).height() * 0.5 ) / 2 );
			}else{
				top = top - ((items.eq(count).height() * 0.5  ) / 2);
			}
		}

		if (reverse){
			count--;
		} else {
			count++;
		}
		//Call recursively, exits when count reaches 0 or childrens.length.
		animateInRow(top,items,parent,count,reverse);
	},animateTime);
}
function heroAnimation(element){
		'use strict';
	var element= $(element);
	//Fade out all the sibling elements.
	setTimeout(function(){
		element.parent().siblings().css('transition','opacity 200ms cubic-bezier(0.420, 0.000, 0.580, 1.000)');
		element.parent().siblings().css('opacity','0.3');
	},1);

	var offset = element.offset();

	//Create overlay and register event to close it on tap anywhere.
	//Register events to "throw away" on left or right swipe.
	var $overlay= $('<div hero-screen/>').attr('fit','.').css({
		'-webkit-transition':'-webkit-transform 200ms ease-in',
		'transition':'transform 200ms ease-in'
	}).on('tap', function(){
		element.children().css('opacity','1');
		element.parent().parent().children().css('opacity','1');
		$overlay.remove();
	}).on('swipeleft', function(){

		$overlay.css('-webkit-transform','translate(-100%,0)');
        $overlay.css('transform','translate(-100%,0)');

        element.children().css('opacity','1');
        element.parent().parent().children().css('opacity','1');
        setTimeout(function(){
        	//Enable scrolling on main content again.
            //$('#content').css('overflow','scroll');
            //$('#content').css('-webkit-overflow-scrolling', 'touch');
            $overlay.remove();
        }, 200);
	}).on('swiperight', function(){
		$overlay.css('-webkit-transform','translate(100%,0)');
		$overlay.css('transform','translate(100%,0)');
		element.children().css('opacity','1');
		element.parent().parent().children().css('opacity','1');
        setTimeout(function(){
        	//Enable scrolling on main content again.
            //$('#content').css('overflow','scroll');
            //$('#content').css('-webkit-overflow-scrolling', 'touch');
            $overlay.remove();
        }, 200);
	});
	//Add a container to the center the items.
	var container = $('<div/>').css({ 'position':'relative',
			'background':'rgba(255,255,255,0.5)',
			'min-height':'100%',
			'overflow-x':'hidden',
			'overflow-y':'scroll'});
	$overlay.append(container);


	$('body').append($overlay);

 	
 	var top = 0;
 	if ($(window).width() > 767 && offset.top < 0) {
 		top=(offset.top - element.height()*0.75);
 	}else{
 		top=offset.top;
 	}

 	//Call recursive function to animate all the childrens with delay.
	animateInRow(top,element.children(), container);

}
$('[hero-animation]').on('tap', function(){
	heroAnimation(this);
});

