
/**
 * Stamina - simple PNG sequences
 * Dependencies: jQuery
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

(function(w, d, $){ 
    
    var elements = d.querySelectorAll('[data-sequence-name]'),
        instances = [],
        framecounter = 0;

    window.sequences = instances;

    /**
     * Iterate through all of the DOM elements with the data-sequence-name attribute
     * and create a new Sequence instance
     */
    function init() {
        for ( var i = 0, l = elements.length; i < l; i++ ){
            instances.push(new Sequence(elements[i]));
        }
        requestAnimationFrame(render);
    };

    function render(){
        requestAnimationFrame(render);
        // framecounter++;
        // if ( framecounter % 2 === 0 ) {
            for ( var i = 0, l = instances.length; i < l; i++ ) {
                instances[i].next();
            }
        // }
    }

    $(init);

    var Sequence = function(el) {
        
        var el = el,
        
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
