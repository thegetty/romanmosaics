//= require vendor/photoswipe.min
//= require vendor/photoswipe-ui-default.min

function lightBox(index) {
  var pswpElement = document.querySelectorAll(".pswp")[0];

  // build items array
  var slides  = [];
  var figures = document.querySelectorAll(".inline-figure");
  var options = { index: index };

  // document query selector returns an HTMLCollection, not a true array
  // So we need to proxy a true Array object to get forEach
  [].forEach.call(figures, function(figure) {
      var slide   = {};
      slide.src   = figure.querySelector("img").src;
      slide.w     = figure.querySelector("img").naturalWidth;
      slide.h     = figure.querySelector("img").naturalHeight;
      slide.title = figure.querySelector("figCaption").textContent;
      slides.push(slide);
  });

  // init gallery
  var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
  gallery.init();
}
