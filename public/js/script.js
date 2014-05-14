// Show a better grid for the vents, by not showing the half cutted holes
// or the ones too close to the edges
(function () {
  var $vents = document.getElementById('vents');
  var $s = document.createElement('style');
  document.body.appendChild($s);

  function offset() {
    var imageWidth = 330;
    var span = 30;
    var patternWidth = 80;
    var start = $vents.offsetWidth;
    var res = parseInt(start / imageWidth, 10);
    if (res >= 6) {
      imageWidth = imageWidth * 2.5;
    } else if (res >= 2) {
      imageWidth = imageWidth * 1.5;
    } else if (res <= 1) {
      imageWidth = imageWidth * 0.5;
    }
    var o = start % imageWidth / 2 % span;
    // console.log(o);
    if (o < 10) {
      o = o + 30;
    }
    o = patternWidth - o;
    $s.innerHTML = '.vents:after { ' +
      'background-position: -' + o + 'px top, right -' + o + 'px top, center center;';
  }

  window.addEventListener('load', offset);
  window.addEventListener('resize', offset);
})();


// Show the black monitor full screen - SVG
(function () {
  if (supportsSVG()) {
    var $s = document.getElementById('screen');
    var $g = document.getElementById('giulia');

    window.mega = function() {
      var winSize = {
        w : window.innerWidth,
        h: window.innerHeight
      };
      $s.style.height = winSize.h + 'px';
      $s.className += " " + 'js-mega';
      $g.style.height = '100%';

      if (winSize.w < winSize.h) {
        $g.style.width = '100%';
      } else {
        $g.style.width = 'auto';
      }
    };
    mega();
  }
})();