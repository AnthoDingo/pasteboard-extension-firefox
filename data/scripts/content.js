// Pass the data to a script within the page environment
(function() {
  var script = document.createElement("script");
  script.id = "ext-injected-script";
  script.setAttribute("data-image", self.options.EXT_IMAGE_DATA);
  script.src = self.options.injectURL;

  (document.head || document.documentElement).appendChild(script);
})()