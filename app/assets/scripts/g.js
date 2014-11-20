
/**
 * RFA, Fo Sho
 */

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/**
 * HERE WE GO.
 */
(function(w, d, $) {
        
    // Cache our rapper elements
    var $rappers = $('.rapper'),
        $rapperImg = $('.rapper img.lad'),
        $rapperText = $('.rapper img.text'),
        $advice = $('.advice'),
        $navLinks = $('nav li'),
        num = $rappers.length,
        height = $rappers.eq(0).outerHeight(),
        bodyheight = height * num,
        percent = 0,
        current,
        top,
        ratio = 100 / num,
        framecounter = 0;

    $(d.body).css('height', height * num + 'px');

    $navLinks.on('click', function(e) {
        e.preventDefault();

        var tween = new TWEEN.Tween( { y: d.body.scrollTop } )
        .to( { y: (height * $(this).attr('data-index')) + 1 }, 750 )
        .easing( TWEEN.Easing.Cubic.Out )
        .onUpdate( function () {
            d.body.scrollTop = this.y;
        })
        .start();
    });

    function positionImages() {
        $rapperImg.each(function(i, val) {
            var $this = $(this);
            $this.css('top', (height - $this[0].height) / 2);
        });    

        $rapperText.each(function(i, val) {
            var $this = $(this);
            $this.css('top', (height - $this[0].height) / 6);
        });

        $advice.each(function(i, val) {
            $(this).css('top', (height*0.75) + 'px');
        });
    }

    function render() {
        window.requestAnimationFrame(render);
        framecounter++;
        
        if ( framecounter % 60 === 0 ) {
            positionImages();
        }

        top = d.body.scrollTop;
        percent = top/bodyheight * 100;
        current = Math.floor(percent / ratio);

        for ( var i = 0; i < num; i++ ) {

            if ( i < current ) {
                $rappers[i].style.height = '0%';
            } else if ( i > current ) {
                $rappers[i].style.height = '100%';
            }
        }

        $navLinks.removeClass('active').eq(current).addClass('active');
        $rappers[current].style.height = Math.abs(((top - current*height)/height * 100)-100) + '%';

        // console.log(current);
        window.visibleSequences = [current];
        TWEEN.update();
    }

    function init() {
        positionImages();
        window.requestAnimationFrame(render);
    }

    window.g = init;

})(window, document, jQuery);


/**
 * DOM is ready, yo.
 */
$(g);