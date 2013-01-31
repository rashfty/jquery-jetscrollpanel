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
                    paddingRight: parseInt(content.css("padding-right")) + options.barWidth + "px"
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
                        slider.height( content.height() * content.height() / (wrapper.jetScrollPanel("getContentSize") + content.height()) );
                    }
                }
                adjustSliderHeight();
                content.bind('DOMNodeInserted', adjustSliderHeight)
                       .bind('DOMNodeRemoved', adjustSliderHeight);

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

                    var timer, active = false,
                        autoScroll = function(up) {
                            wrapper.jetScrollPanel('scroll', (up ? "-" : "+") + "=15px");
                        };

                    arrows.click(function() {
                        return false;
                    }).bind("mousedown", function() {
                        var obj = $(this);
                        autoScroll(obj.hasClass("jetscrollarrow-up"));
                        active = true;
                        setTimeout(function() {
                            if (active) {
                                clearInterval(timer);
                                timer = setInterval(function() {
                                    autoScroll(obj.hasClass("jetscrollarrow-up"));
                                }, 70);
                            }
                        }, 300);
                    }).bind("mouseup", function() {
                        active = false;
                        clearInterval(timer);
                    });
                }

                slider.on("mousedown", function(e) {
                    content.bind("selectstart", function() { return false; }).addClass('unselectable');
                    var obj = $(this);
                    var pos_y = obj.offset().top - e.pageY;
                    $(this).addClass("dragging");
                    $("html").on("mousemove", function(e) {
                        if (obj.hasClass("dragging")) {
                            var t = e.pageY + pos_y - bar.offset().top;
                            obj.css({ top: Math.max(Math.min(t, bar.height() - slider.outerHeight()), 0) });
                            var p = wrapper.jetScrollPanel("getContentSize") * t / (wrapper.jetScrollPanel("getTrackSize"));
                            wrapper.jetScrollPanel("scroll", p);
                        }
                        obj.parents().on("mouseup", function() {
                            obj.removeClass('dragging');
                        });
                    });
                }).on("mouseup", function() {
                    $(this).removeClass("dragging");
                    content.unbind("selectstart").removeClass('unselectable');
                });

                content.scroll(function(e) {
                    var p = (wrapper.jetScrollPanel("getTrackSize")) * content.scrollTop() / wrapper.jetScrollPanel("getContentSize");
                    slider.css("top", p + "px");
                });
                
                bar.click(function(e) {
                    var y = e.pageY - slider.offset().top;
                    wrapper.jetScrollPanel('scroll', y > 0 ? "+=15px" : "-=15px");
                });

            });
        },
        scroll: function(pixels) {
            var content, wrapper;
            if ($(this).hasClass("jetscrollpanel")) {
                wrapper = $(this).parent();
            } else {
                wrapper = $(this).find(".jetscrollpanel");
            }
            var content = wrapper.find(".jetscrollcontent");

            if (typeof pixels == "string") {
                var m, k;
                if ((m = /(\-|\+)=\d+(px|%)/.exec(pixels)) != null)  {
                    k = parseInt(pixels.substr(2));
                    if (m[2] == "%") { 
                        k *= wrapper.jetScrollPanel("getContentSize") / 100;
                    }
                    pixels = content.scrollTop() + (m[1] == "-" ? -k : k);
                } else if ((m = /\d+(px|%)/.exec(pixels)) != null) {
                    pixels = parseInt(pixels);
                    if (m[1] == "%") {
                        pixels *= wrapper.jetScrollPanel("getContentSize") / 100;
                    }
                } else {
                    return false;
                }
            }
            content.scrollTop(parseInt(pixels));
        },
        getTrackSize: function() {
            var bar = $(this).find(".jetscrollbar");
            var slider = bar.find(".jetscrollslider");
            return bar.height() - slider.outerHeight();
        },
        getContentSize: function() {
            var content = $(this).find(".jetscrollcontent");
            return content[0].scrollHeight - content.outerHeight();
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