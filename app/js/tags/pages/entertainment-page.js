riot.tag('entertainment-page', '<a7-article each="{items}" article="{this}" class="animate-on-page-change" style="position:relative;display:block;"></a7-article>', function(opts) {
	
	var self = this;
	self.items = []
	self.on('mount', function(){
		app.stores.trigger('SjuArticles_list_init');
	});
	app.stores.on('SjuArticles_collection_changed', function(collection){

		var tailItems = collection.length % 4;

		self.items = collection;
		for (var x = collection.length ; x>0;x--){
			if((x-1) % 3 == 0) {
				self.items.splice(x-1, 0, {title:'Annons', preamble:'Annonstext',imageSrc:'http://www.uxmash.com/wp-content/uploads/2012/04/advert_dummy.png' });
			}
		}

		setTimeout(self.update, 0);
	});
	
});
