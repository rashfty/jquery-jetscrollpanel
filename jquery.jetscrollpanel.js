(function($) {
    var defaults = {
    	arrows: false,
    	arrowHeight: 15,
    	barWidth: 15
    };
    
    var methods = {
    	init: function(params) {
    		var options = $.extend({}, defaults, params);

	        return this.each(function() {
        		var content = $(this).wrapInner("<div class='jetscrollcontent'/>").find(".jetscrollcontent");
        		
    			content.css({
    				marginRight: ($.browser.webkit ? 0 : -options.barWidth) + "px",
        			paddingRight: options.barWidth + "px"
    			});

        		var wrapper = content.wrap("<div class='jetscrollpanel'/>").parent();
        		wrapper.append("<div class='jetscrollbar'><div class='jetscrollslider'></div></div>")
        		
        		var bar = wrapper.find(".jetscrollbar");

        		bar.css({
        			width: options.barWidth + "px"
        		});

        		var slider = bar.find(".jetscrollslider");
        		
        		var adjustSliderHeight = function() {
        			if (wrapper.jetScrollPanel("getContentSize") + content.height() <= bar.height()) {
        				bar.hide();
    				} else {
    					bar.show();
    					var s = wrapper.height();

    					console.log(wrapper.jetScrollPanel("getContentSize") / (wrapper.jetScrollPanel("getContentSize") + wrapper.height()));
	        			var h = Math.max(.15 * wrapper.height(), Math.min(wrapper.height(), content.height() * content.height() / ( wrapper.jetScrollPanel("getContentSize") + content.height() )));
	        			
	        			slider.height(h);
    				}
        		}
        		adjustSliderHeight();
        		content.bind('DOMNodeInserted', function() {
        			adjustSliderHeight();
	            });

        		if (options.arrows) {
        			bar.prepend("<a href='#' class='jetscrollarrow jetscrollarrow-up'>▲</a>")
        			   .append("<a href='#' class='jetscrollarrow jetscrollarrow-down'>▼</a>")
        			   .css({
        			   		top: options.arrowHeight + "px",
        					bottom: options.arrowHeight + "px"
        			   });
        			var arrows = bar.find(".jetscrollarrow").css({
        				height: options.arrowHeight + "px",
        				font: (0.5 * options.arrowHeight) + "px/" + options.arrowHeight + "px Arial"
        			});
        			bar.find(".jetscrollarrow-up").css("top", -options.arrowHeight + "px");
        			bar.find(".jetscrollarrow-down").css("bottom", -options.arrowHeight + "px");

        			var timer = null;

        			arrows.click(function() {
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

        		slider.on("mousedown", function(e) {
		            var obj = $(this);
        			var pos_y = obj.offset().top - e.pageY;
					$(this).addClass("dragging");
					$("html").on("mousemove", function(e) {
        				if (obj.hasClass("dragging")) {
        					var t = e.pageY + pos_y - bar.offset().top;
        					obj.css({ top: Math.max(Math.min(t, bar.height() - slider.height()), 0) });
        					var p = wrapper.jetScrollPanel("getContentSize") * t / (wrapper.jetScrollPanel("getTrackSize"));
         					wrapper.jetScrollPanel('scroll', p);
        				}
        				obj.parents().on("mouseup", function() {
		                    obj.removeClass('dragging');
		                });
        			});
        			e.preventDefault();
        		}).on("mouseup", function() {
        			$(this).removeClass("dragging");
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