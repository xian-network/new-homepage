 if (window.location.protocol === "http:") {
   window.location.href = window.location.href.replace("http:", "https:");
 }
$(document).ready(function() {
  

// Burgerr menu
if ($(window).width() <= 992) {
    $(".btn_nav").click(function () {
      $(".burger").toggleClass("active");
      if ($(".header-wrapper").is(":hidden")) {
        $("body").addClass("hidden");
        $(".bg-blur").addClass("blur");
        $(".header").addClass("blur");

        setTimeout(function () {
          $(".header-wrapper").slideDown(200).css({ display: "flex" });
        }, 100);
      } else {
        $(".header-wrapper").slideUp(200);
        setTimeout(function () {}, 300);
        $("body").removeClass("hidden");
        $(".bg-blur").removeClass("blur");
        $(".header").removeClass("blur");
      }
    });

    $(".header-wrapper li:not(.menu-item-has-children) a, .header-wrapper .main-button, .header-icons a").click(function () {
      $(".header-wrapper").slideUp(200);
      $(".burger").removeClass("active");
      $("body").removeClass("hidden");
      $(".bg-blur").removeClass("blur");
      $(".header").removeClass("blur");
    });

    $(window).resize(function () {
      if ($(window).width() > 992) {
        $(".header-wrapper").removeAttr("style");
        $(".burger").removeClass("active");
        $("body").removeClass("hidden");
        $(".bg-blur, .header").removeClass("blur");
      }
    });
}

});