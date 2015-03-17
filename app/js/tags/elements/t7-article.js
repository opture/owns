riot.tag('t7-article', '<article center-block border-tr-radius-2 border-tl-radius-2 hero-animation overflow-hidden margin-none shadow-z-1 class="animated-slow hidden" ><h2 center-text pad-1 margin-none>Rubrik <img class="icon" src="/img/entypo+/share.svg" style="float:right;"></h2><img center-block margin-none style="min-height:120px;" src="http://lorempixel.com/320/160/nightlife"><p pad-1 margin-none overflow-hidden>{preamble}</p><p name="artBody" hidden pad-1 margin-none overflow-hidden>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora vitae, dolores hic dolore ipsam necessitatibus nostrum laboriosam sunt, cum ex magni quaerat facere sapiente expedita nihil veritatis, magnam eum! Consequuntur! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolores saepe harum, asperiores. Commodi placeat a incidunt voluptatem, quasi voluptates! Placeat nihil nam magni, quas quaerat ex ab a reprehenderit? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus dolore cum similique temporibus voluptas, eius magnam ducimus pariatur corrupti quo voluptates libero laboriosam ipsa perspiciatis qui deleniti ex in eum!</p></article>', function(opts) {
		var self = this;
		self.article = opts.article;
		self.showBody = false;
		self.artBody.innerHTML = self.article.body;
		this.showArticleBody = function(e) {
			self.showBody = !self.showBody;
		}.bind(this);
		this.showArticle = function(e) {
			var animationtime  = 200;
			var $rootElement = $(this.root);
			animations.heroAnimation($rootElement, animationtime);
			return;
		}.bind(this);

	
});