(function($) {
    var defaults = {};
    
    var methods = {
    	init: function(params) {
    		var options = $.extend({}, defaults, params);

	        return this.each(function() {
        		var content = $(this).wrapInner("<div class='jetscrollcontent'/>").find(".jetscrollcontent");
        		var wrapper = content.wrap("<div class='jetscrollpanel'/>").parent();
        		wrapper.append("<div class='jetscrollbar'><div class='jetscrollslider'></div></div>")
        		var bar = wrapper.find(".jetscrollbar");
        		var slider = bar.find(".jetscrollslider");

        		slider.draggable({
		            containment: "parent",
		            scroll: false,
		            drag: function() { wrapper.jetScrollPanel('scroll'); }
		        });

		        content.scroll(function() {
		            if (slider.hasClass("ui-draggable-dragging")) return false;
		            var p = content.scrollTop() / (content[0].scrollHeight - content.height());
		            p *= bar.height() - slider.height();
		            slider.css("top", p + "px");
		        });

		        bar.click(function(e) {
		            var y = e.pageY - slider.offset().top;
		            slider.css("top", "+=" + y/2 + "px");
		            wrapper.jetScrollPanel('scroll');
		        });
        	});
    	},
    	scroll: function(params) {
    		var content = $(this).find(".jetscrollcontent");
    		var bar = $(this).find(".jetscrollbar");
    		var slider = bar.find(".jetscrollslider");
    		var p = parseInt(slider.css("top")) / (bar.height() - slider.height());
    		p *= content[0].scrollHeight - content.height();
            content.scrollTop(p);
    	}
    }
    $.fn.jetScrollPanel = function(method){
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods.init.apply(this, arguments);
		}
    };
})(jQuery);