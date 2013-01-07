(function($) {
    var defaults = {
    	arrows: false
    };
    
    var methods = {
    	init: function(params) {
    		var options = $.extend({}, defaults, params);

	        return this.each(function() {
        		var content = $(this).wrapInner("<div class='jetscrollcontent'/>").find(".jetscrollcontent");
        		
        		var wrapper = content.wrap("<div class='jetscrollpanel'/>").parent();
        		wrapper.append("<div class='jetscrollbar'><div class='jetscrollslider'></div></div>")
        		
        		var bar = wrapper.find(".jetscrollbar");
        		var slider = bar.find(".jetscrollslider");
        		
        		if (options.arrows) {
        			bar.prepend("<a href='#' class='jetscrollarrow jetscrollarrow-up'>▲</a>").append("<a href='#' class='jetscrollarrow jetscrollarrow-down'>▼</a>");
        			var h = bar.find(".jetscrollarrow").height();
        			bar.css("margin", h + "px 0");

        			var timer = null;

        			bar.find(".jetscrollarrow").click(function() {
        				return false;
        			}).bind("mousedown", function() {
        				var obj = $(this);
        				var func = function() {
        					var p = parseInt(slider.css("top"));
	        				if (obj.hasClass("jetscrollarrow-up")) {
	        					p = Math.max(p - 15, 0);
	        				}
	        				if (obj.hasClass("jetscrollarrow-down")) {
	        					p = Math.min(p + 15, wrapper.jetScrollPanel("getTrackSize"));
	        				}
	        				slider.css("top", p + "px");
	        				wrapper.jetScrollPanel('scroll', (obj.hasClass("jetscrollarrow-up") ? "-" : "+") + "=15");
        				}
        				func();
        				clearInterval(timer);
        				timer = true;
    					setTimeout(function() {
    						if (timer === true)
    							timer = setInterval(func, 150);
    					}, 300);
        				
        				return false;
        			}).bind("mouseup", function() {
        				clearInterval(timer);
        				timer = false;
        			});
        		}

        		slider.draggable({
		            containment: "parent",
		            scroll: false,
		            drag: function(e, ui) {
        				var p = wrapper.jetScrollPanel("getContentSize") * ui.position.top / (wrapper.jetScrollPanel("getTrackSize"));
        				wrapper.jetScrollPanel('scroll', p);
        			}
		        });

		        content.scroll(function(e) {
		        	var p = (wrapper.jetScrollPanel("getTrackSize")) * content.scrollTop() / wrapper.jetScrollPanel("getContentSize");
		            slider.css("top", p + "px");
		            
		        });
		        
		        bar.click(function(e) {
		            var y = e.pageY - slider.offset().top;
		            wrapper.jetScrollPanel('scroll', y > 0 ? "+=15" : "-=15");
		        });

        	});
    	},
    	scroll: function(pixels) {
    		var content = $(this).find(".jetscrollcontent");

            if (typeof pixels == "string") {
            	if (pixels.toString().substr(0, 2) == "-=") {
            		pixels = -1 * parseInt(pixels.toString().substr(2));
            	}
            	if (pixels.toString().substr(0, 2) == "+=") {
            		pixels = parseInt(pixels.toString().substr(2));
            	}
            	pixels += content.scrollTop();
            }
            content.scrollTop(pixels);
    	},
    	getTrackSize: function() {
    		var bar = $(this).find(".jetscrollbar");
    		var slider = bar.find(".jetscrollslider");
    		return bar.height() - slider.height() - parseInt(slider.css("border-top-width")) - parseInt(slider.css("border-bottom-width"));
    	},
    	getContentSize: function() {
    		var content = $(this).find(".jetscrollcontent");
    		return content[0].scrollHeight - content.height() - parseInt(content.css("padding-top")) - parseInt(content.css("padding-bottom"));
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