// Pass the data to a script within the page environment
(function() {
  var script = document.createElement("script");
  script.id = "ext-injected-script";
  script.setAttribute("data-image", EXT_IMAGE_DATA);
  script.src = require("sdk/self").data.url("scripts/inject.js");

  (document.head || document.documentElement).appendChild(script);
})()