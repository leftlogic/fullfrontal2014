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
    var $t1 = document.getElementById('t1');
    var $t2 = document.getElementById('t2');
    var $svg_text = document.getElementById('js-svg-text');
    var $svg_logo= document.getElementById('js-svg-logo');
    var $monitor = document.getElementById('monitor');
    var monitorStyle = window.getComputedStyle($monitor, null);

    window.mega = function() {
      var winSize = {
        w : window.innerWidth,
        h: window.innerHeight
      };
      $s.style.height = winSize.h + 'px';
      $s.className += " " + 'js-mega';
      
      var svgSize = {
        w: parseInt(monitorStyle.getPropertyValue('width')) - parseInt(monitorStyle.getPropertyValue('padding-left')) - parseInt(monitorStyle.getPropertyValue('padding-right')),
        h: parseInt(monitorStyle.getPropertyValue('height')) - parseInt(monitorStyle.getPropertyValue('padding-bottom')) - parseInt(monitorStyle.getPropertyValue('padding-top'))
      };
      if (winSize.h > winSize.w) {
        // move the binary dates at the top
        var diff = (svgSize.h - svgSize.w) / -2;
        if (diff < -10) {
          diff = diff + 10;
        }
        diff = diff * 700 / svgSize.w;
        $t1.setAttribute('y', diff + 'px');
        $t2.setAttribute('y', diff + 'px');

        // resize logo and move text down
        if (/mobi/i.test(navigator.userAgent)) {
          $svg_text.setAttribute('y', '20%');
          $svg_logo.setAttribute('height', '50%');
        }
      }
    };
    mega();
  }
})();


// Scroll to session
(function() {
  var $ = function (s) {
    try {
      return document.querySelectorAll(s);
    } catch (e) {
      return [];
    }
  };

  var $nav = $('.nav-main');
  var today = new Date();
  var confDay = new Date('2014-11-07');
  var best = null;
  var isConfDay = (today.getDate() === confDay.getDate()) &&
                  (today.getMonth() === confDay.getMonth()) &&
                  (today.getFullYear() === confDay.getFullYear());

  if (isConfDay) {
    // find the current session
    var sessions = $('.js-session');
    var length = sessions.length;
    best = sessions[0];

    for (var i = 0; i < length; i++) {
      if ((Date.parse(sessions[i].getAttribute('data-date')) - (5 * 1000 * 60)) < today) {
        best = sessions[i];
      }
    }
  }

  // if today is conference day, then scroll the current session in to view
  if (isConfDay && best && !window.location.hash) {
    setTimeout(function () {
      best.scrollIntoView(true);
    }, 750);
  } else {
    // only scroll the front page
    // && /mobi/i.test(navigator.userAgent)
    $nav.length > 0 && location.pathname === '/' && !location.hash && setTimeout(function () {
      if (!pageYOffset) window.scrollTo(0, $nav[0].offsetHeight);
    }, 750);
  }
})();


// Parallax for circuit/vent
(function() {
  var offset = 100;
  var $machine = document.getElementById('machine');
  var $vents = document.getElementById('vents');
  var $vents2 = document.createElement('div');
  var $case = document.querySelectorAll('.case')[0];
  $vents2.id = 'vents2';
  $vents2.style.left = (offset * -1) + 'px';
  $vents2.style.right = (offset * -1) + 'px';
  $vents2.style.bottom = (offset * -1) + 'px';
  $vents2.style.top = ($case.offsetHeight - offset) + 'px';
  $machine.className += ' js-vents';
  $vents.parentNode.insertBefore($vents2, $vents.previousSibling);
  var speed = (window.innerHeight - $vents.offsetHeight) / 2;

  function scrollCircuit() {
    var scrolled = (speed - $vents.getBoundingClientRect().top) * offset / speed;
    $vents2.style.webkitTransform = 'translate3d(0, ' + scrolled + 'px, 0)';
    $vents2.style.MozTransform = 'translate3d(0, ' + scrolled + 'px, 0)';
  }

  window.addEventListener('touchmove', scrollCircuit);
  window.addEventListener('scroll', scrollCircuit);
})();


// Browsers that screw up our svg
(function() {
  var ua = navigator.userAgent;
  var win8_1 = 'Windows NT 6.3';
  var ie10 = 'MSIE 10.0';
  var safari = 'Safari';
  var chrome = 'Chrome';
  var isIE11_win8_1 = false;
  var isSafari = false;
  
  if (ua.match(win8_1) && !ua.match(ie10)) {
    isIE11_win8_1 = true;
  }
  if (ua.match(safari) && !ua.match(chrome)) {
    isSafari = true;
  }

  if (isIE11_win8_1 || isSafari) {
    var winW = window.innerWidth;
    var mq = 768;
    var w = 330;
    var img = 'small';
    var $vents = document.getElementById('vents');
    var $ventsClone = document.createElement('div');
    var $obj = document.createElement('object');
    var repeat = 0;

    if (winW >= mq) {
      img = 'big';
      w = 840;
    }

    repeat = Math.ceil(winW / w) + 1;
    $ventsClone.className = 'vents-clone-wrapper';
    $vents.appendChild($ventsClone);
    $obj.setAttribute('type', 'image/svg+xml');
    $obj.setAttribute('data', '/images/vents-' + img + '.svg');
    $obj.className = 'vents-clone';
    $ventsClone.appendChild($obj);
    for (var i = 1; i < repeat; i++) {
      $ventsClone.appendChild($obj.cloneNode(false));
    }
  }
})();


// Switch button
(function() {
  Element.prototype.on = Element.prototype.addEventListener;
  Element.prototype.off = Element.prototype.removeEventListener;
  var $caseButton = document.querySelectorAll('.case-button')[0];
  var $caseLight = document.querySelectorAll('.case-light')[0];
  var $vents = document.getElementById('vents');
  
  var $left = document.createElement('div');
  var $right = document.createElement('div');
  $caseButton.className += ' js-case-button';
  $left.className = 'case-button-left';
  $right.className = 'case-button-right';
  $caseButton.appendChild($left);
  $caseButton.appendChild($right);
  
  var press = function(event) {
    event.preventDefault();
    target = event.target.className.replace('case-button-', '');
    if (target === 'left' && $caseButton.className.indexOf('button-on') === -1) {
      turnOn();
      $left.on('mouseup', release);
      $left.on('mouseout', release);
      $left.on('touchend', release);
    } else if (target === 'right' && $caseButton.className.indexOf('button-on') !== -1) {
      turnOff();
      $right.on('mouseup', release);
      $right.on('mouseout', release);
      $right.on('touchend', release);
    }
  };
  var release = function(event) {
    target = event.target.className.replace('case-button-', '');
    if (target === 'left' && $caseButton.className.indexOf('button-on') !== -1) {
      turnOff();
      console.log('No, we\'re not ready yet, come back when tickets come on sale. <3');
    } else if (target === 'right' && $caseButton.className.indexOf('button-on') === -1) {
      turnOn();
    }
    $left.off('mouseup', release);
    $left.off('mouseout', release);
    $left.off('touchend', release);
    $right.off('mouseup', release);
    $right.off('mouseout', release);
    $right.off('touchend', release);
  };
  
  var turnOn = function() {
    $caseButton.className += ' case-button-on';
    $caseLight.className += ' case-light-on';
    $vents.className += ' vents-on';
  };
  var turnOff = function() {
    $caseButton.className = $caseButton.className.replace('case-button-on', '');
    $caseLight.className = $caseLight.className.replace('case-light-on', '');
    $vents.className = $vents.className.replace('vents-on', '');
  };
  
  if ($caseButton.className.indexOf('button-on') === -1) {
    $left.on('mousedown', press);
    $left.on('touchstart', press);
  } else {
    $right.on('mousedown', press);
    $right.on('touchstart', press);
  }
})();