(function($) {
    var defaults = {
    	arrows: false
    };
    
    var methods = {
    	init: function(params) {
    		var options = $.extend({}, defaults, params);

	        return this.each(function() {
	        	// if (options.arrows) alert(1);
        		var content = $(this).wrapInner("<div class='jetscrollcontent'/>").find(".jetscrollcontent");
        		
        		var wrapper = content.wrap("<div class='jetscrollpanel'/>").parent();
        		wrapper.append("<div class='jetscrollbar'><div class='jetscrollslider'></div></div>")
        		
        		var bar = wrapper.find(".jetscrollbar");
        		var slider = bar.find(".jetscrollslider");
        		var bar_diff = bar.height() - slider.height();
        		
        		/*
        		if (options.arrows) {
        			bar.prepend("<a href='#' class='jetscrollarrow jetscrollarrow-up'>▲</a>").append("<a href='#' class='jetscrollarrow jetscrollarrow-down'>▼</a>");
        			var h = bar.find(".jetscrollarrow").disableSelection().height();
        			bar.css({
        				top: h + "px",
        				height: (parseInt(bar.height()) - 2 * h) + "px"
        			});

        			bar.find(".jetscrollarrow").trigger("mousedown", function() {
        				console.log(1);
        				if ($(this).is(":active")) {
        					$(this).click();
        				} else {
        					console.log(0);
        				}
        				return false;
        				slider.css("top", ($(this).hasClass("jetscrollarrow-up") ? "-" : "+") + "=5%");
        				wrapper.jetScrollPanel('scroll');
        				return false;
        			});
        		}
				*/
        		slider.draggable({
		            containment: "parent",
		            scroll: false,
		            drag: function(e, ui) {
        				var p = ui.position.top / bar_diff;
        				p *= content[0].scrollHeight - content.height();
        				wrapper.jetScrollPanel('scroll', p);
        			}
		        });

		        content.scroll(function() {
		        	var p = bar_diff * content.scrollTop() / (content[0].scrollHeight - content.height());
		            slider.css("top", p + "px");
		        });
		        /*
		        bar.click(function(e) {
		            var y = e.pageY - slider.offset().top;
		            slider.css("top", "+=" + y/2 + "px");
		            wrapper.jetScrollPanel('scroll');
		        });
*/
        	});
    	},
    	scroll: function(pixels) {
    		var content = $(this).find(".jetscrollcontent");
    		/*
    		
    		var bar = $(this).find(".jetscrollbar");
    		var slider = bar.find(".jetscrollslider");
    		var p = parseInt(slider.css("top")) / (bar.height() - slider.height());
    		p *= content[0].scrollHeight - content.height();
            content.scrollTop(p);
            */
            content.scrollTop(pixels);
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