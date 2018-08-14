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
    updateHeaderActiveClass();
    initHeaderScroll();

    initSliders();
    initScrollMonitor();

    revealFooter();
    _window.on('resize', throttle(revealFooter, 100));
  }

  // this is a master function which should have all functionality
  pageReady();


  // some plugins work best with onload triggers
  _window.on('load', function(){
    // your functions
  })


  //////////
  // COMMON
  //////////

  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
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
      console.log(el)
      $('body, html').animate({
          scrollTop: $(el).offset().top}, 1000);
      return false;
    })


  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function initHeaderScroll(){
    _window.on('scroll', throttle(function(e) {
      var vScroll = _window.scrollTop();
      var header = $('.header').not('.header--static');
      var headerHeight = header.height();
      var firstSection = _document.find('.page__content div:first-child()').height() - headerHeight;
      var visibleWhen = Math.round(_document.height() / _window.height()) >  2.5

      if (visibleWhen){
        if ( vScroll > headerHeight ){
          header.addClass('is-fixed');
        } else {
          header.removeClass('is-fixed');
        }
        if ( vScroll > firstSection ){
          header.addClass('is-fixed-visible');
        } else {
          header.removeClass('is-fixed-visible');
        }
      }
    }, 10));
  }


  // HAMBURGER TOGGLER
  _document.on('click', '[js-hamburger]', function(){
    $(this).toggleClass('is-active');
    $('.mobile-navi').toggleClass('is-active');
  });

  function closeMobileMenu(){
    $('[js-hamburger]').removeClass('is-active');
    $('.mobile-navi').removeClass('is-active');
  }

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering when header is inside barba-container
  function updateHeaderActiveClass(){
    $('.header__menu li').each(function(i,val){
      if ( $(val).find('a').attr('href') == window.location.pathname.split('/').pop() ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }

  //////////
  // SLIDERS
  //////////

  function initSliders(){

    // EXAMPLE SWIPER
    new Swiper('[js-slider]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "example-slide",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 0,
      slidesPerView: 'auto',
      // loop: true,
      normalizeSlideIndex: true,
      // centeredSlides: true,
      freeMode: true,
      // effect: 'fade',
      autoplay: {
        delay: 5000,
      },
      navigation: {
        nextEl: '.example-next',
        prevEl: '.example-prev',
      },
      breakpoints: {
        // when window width is <= 992px
        992: {
          autoHeight: true
        }
      }
    })

  }

  ////////////////
  // FOOTER REVEAL
  ////////////////
  function revealFooter() {
    var footer = $('[js-reveal-footer]');
    if (footer.length > 0) {
      var footerHeight = footer.outerHeight();
      var maxHeight = _window.height() - footerHeight > 100;
      if (maxHeight && !msieversion() ) {
        $('body').css({
          'margin-bottom': footerHeight
        });
        footer.css({
          'position': 'fixed',
          'z-index': -10
        });
      } else {
        $('body').css({
          'margin-bottom': 0
        });
        footer.css({
          'position': 'static',
          'z-index': 10
        });
      }
    }
  }


  ////////////
  // UI
  ////////////

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
