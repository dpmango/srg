$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady(){
    legacySupport();
    initTeleport();
    initSliders();
    initScrollMonitor();
    setBackgrounds();
    initBgParticlesAnimation();
    _window.on('resize', debounce(setBackgrounds, 200))
  }

  // this is a master function which should have all functionality
  pageReady();


  //////////
  // COMMON
  //////////

  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: true,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }


  // Prevent # behavior
	_document
    .on('click', '[href="#"]', function(e) {
  		e.preventDefault();
  	})
    .on('click', '[js-scroll-to]', function() { // section scroll
      var el = $(this).data('target');
      $('body, html').animate({
          scrollTop: $(el).offset().top}, 1000);
      closeMobileMenu();
      return false;
    })

  // HAMBURGER TOGGLER
  _document.on('click', '[js-hamburger]', function(){
    $(this).toggleClass('is-active');
    $('.header').toggleClass('is-menu-opened');
    $('.mobile-navi').toggleClass('is-active');
  });

  function closeMobileMenu(){
    $('[js-hamburger]').removeClass('is-active');
    $('.header').removeClass('is-menu-opened');
    $('.mobile-navi').removeClass('is-active');
  }


  //////////
  // SLIDERS
  //////////

  function initSliders(){

    // PSEUDO SLIDER (CUSTOM)

    _document
      .on('click', '[js-swiper-devices-nav] div', function(){
        var targetIndex = $(this).data('slide');
        var sliderContainer = $('[js-swiper-devices]');
        var currentSlide = sliderContainer.find('.devices__slide.is-active');
        var targetSlide = sliderContainer.find('.devices__slide[data-index="'+targetIndex+'"]')

        // slides
        currentSlide.addClass('is-fading-out');
        setTimeout(function(){
          currentSlide.removeClass('is-fading-out');
          currentSlide.removeClass('is-active')
        }, 250)

        targetSlide.addClass('is-active')

        $(this).addClass('is-active');
        $(this).siblings().removeClass('is-active')

      })

  }


  ////////////
  // BACKGROUNDS
  ////////////
  function setBackgrounds(){
    var hero = $('[js-hero-bg]');
    var heroContainer = hero.closest('.container');
    var wWidth = _window.width();
    var designBP = 1440

    // hero part
    // svg is positioned to very left on 1440, should calc the container offset / 2
    // on wider screens, coeff should modify the offset
    var heroContainerDiff = (heroContainer.outerWidth() - wWidth) / 2
    var heroWideModifier = wWidth > designBP ? 1 : 1
    var heroCalcLeft = Math.floor(heroContainerDiff - 30) * heroWideModifier

    hero.css({
      'left': heroCalcLeft
    })

    console.log( wWidth )

  }

  ////////////
  // BACKGROUND ANIMATIONS
  ////////////

  function radomVal(min,max){
    var negativeOrPositive = Math.random() > .5 ? -1 : 1
    var number = Math.random() * max
    number = number < min ? min : number
    number * negativeOrPositive // make positive or negative

    return Math.floor(number)
  }
  function initBgParticlesAnimation(){
    var svg = $('[js-bg-animations] svg');

    svg.find('.anim').each(function(i, el){

      var timeline = anime.timeline({
        targets: el,
        easing: 'easeInCubic', // linear ?
        direction: 'alternate',
        duration: 2500,
        elasticity: 1000,
        loop: true
      })

      var startPoint = []
      timeline
        .add({
          translateX: radomVal(10,70),
          translateY: radomVal(10,50),
        })
        .add({
          translateX: radomVal(10,70),
          translateY: radomVal(10,50),
        })
        .add({
          translateX: radomVal(10,70),
          translateY: radomVal(10,50),
        })
        
      // anime({
      //   targets: el,
      //   // translateX: {
      //   //   value: '+=150' // relative
      //   // },
      //   translateX: radomVal(10,70),
      //   translateY: radomVal(10,50),
      //   // rotate: radomVal(5,70),
      //   easing: 'linear',
      //   direction: 'alternate',
      //   duration: 10000,
      //   elasticity: 100,
      //   loop: true
      // });

    });
  }


  ////////////
  // TELEPORT PLUGIN
  ////////////
  function initTeleport(){
    $('[js-teleport]').each(function (i, val) {
      var self = $(val)
      var objHtml = $(val).html();
      var target = $('[data-teleport-target=' + $(val).data('teleport-to') + ']');
      var conditionMedia = $(val).data('teleport-condition').substring(1);
      var conditionPosition = $(val).data('teleport-condition').substring(0, 1);

      if (target && objHtml && conditionPosition) {
        function teleport() {
          var condition;

          if (conditionPosition === "<") {
            condition = _window.width() < conditionMedia;
          } else if (conditionPosition === ">") {
            condition = _window.width() > conditionMedia;
          }

          if (condition) {
            target.html(objHtml)
            self.html('')
          } else {
            self.html(objHtml)
            target.html("")
          }
        }

        teleport();
        _window.on('resize', debounce(teleport, 100));
      }
    })
  }

  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor(){
    $('.wow').each(function(i, el){

      var elWatcher = scrollMonitor.create( $(el) );

      var delay;
      if ( $(window).width() < 768 ){
        delay = 0
      } else {
        delay = $(el).data('animation-delay');
      }

      var animationClass = $(el).data('animation-class') || "wowFadeUp"

      var animationName = $(el).data('animation-name') || "wowFade"

      elWatcher.enterViewport(throttle(function() {
        $(el).addClass(animationClass);
        $(el).css({
          'animation-name': animationName,
          'animation-delay': delay,
          'visibility': 'visible'
        });
      }, 100, {
        'leading': true
      }));
      // elWatcher.exitViewport(throttle(function() {
      //   $(el).removeClass(animationClass);
      //   $(el).css({
      //     'animation-name': 'none',
      //     'animation-delay': 0,
      //     'visibility': 'hidden'
      //   });
      // }, 100));
    });

  }


});
