
/**
 * RFA, Fo Sho'
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
    
    var 
        // Cache our rapper elements
        $rappers = $('.rapper'),
        $rapperImg = $('.rapper img.lad'),
        $rapperText = $('.rapper img.text'),
        $advice = $('.advice'),
        $navLinks = $('nav li'),
        $current = $('#current'),
        elements = d.querySelectorAll('[data-sequence-name]'),

        // Process variables
        num = $rappers.length,
        height = $(window).innerHeight(),
        bodyheight = height * num,
        percent = 0,
        ratio = 100 / num,
        framecounter = 0,
        instances = [],
        current,
        top,
        debounce;

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

    $(window).on('resize', function(e){
        window.clearTimeout(debounce);
        height = $(window).innerHeight();
        debounce = window.setTimeout(positionImages, 100);
    });

    function positionImages(h) {
        $rapperImg.each(function(i, val) {
            $(this).css('top', (height - h) / 2);
        });    
        // $advice.each(function(i, val) {
        //     $(this).css('top', (height*0.75) + 'px');
        // });    
    }

    function render() {
        window.requestAnimationFrame(render);

        framecounter++;
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

        try {
            if ( current === 0 ) {
                instances[0].next();
                instances[1].next();
                instances[2].next();
            } else {
                instances[current-1].next();
                instances[current].next();
                instances[current+1].next();
            }

            $navLinks.removeClass('active').eq(current).addClass('active');
            $rappers[current].style.height = Math.abs(((top - current*height)/height * 100)-100) + '%';

            window.visibleSequences = [current];
        } catch (e) {}

        TWEEN.update();
    }

    function init() {
        for ( var i = 0, l = elements.length; i < l; i++ ){
            instances.push(new Sequence(elements[i],i));
        }
        window.requestAnimationFrame(render);
    }

    window.g = init;

    var Sequence = function(el, id) {
        
        var el = el,
            id = id,

            parent = el.parentNode,
            name = el.getAttribute('data-sequence-name'),
            numframes = parseInt(el.getAttribute('data-sequence-frames'), 10),

            current = 0,
            loaded = 0,
            preload = [],
            frames = [],
            rev = [],
            ready = false;

        function onload() {
            loaded++;

            if ( loaded === numframes ) {
                ready = true;
                el.src = frames[0];
                positionImages(el.height);
            }
        }

        function push(arr, num) {
            arr.push('/assets/img/sequences/' + name + '/' + (num) + '.png');
        }

        for ( var i = 0, l = numframes; i < l; i++ ) {
            push(frames, i+1);
            preload.push(new Image());
            preload[i].onload = onload;
            preload[i].src = frames[i];
        }

        for ( var i = numframes-1; i > 0; i-- ) {
            push(frames, i);
        }
        
        this.next = function() {
            if ( ready ) {
                current = (current < (frames.length-1) ? current+1 : 0);
                el.src = frames[current];
            }
        }
    }

})(window, document, jQuery);

/**
 * DOM is ready, yo.
 */
$(g);