(function() {
  var screenshotButton,
      clipboardButton,
      errorContainer;

  function init() {
    $(document).addClass("loaded");
    screenshotButton = $("#screenshot");
    clipboardButton = $("#clipboard");
    errorContainer = $("#error");
    pageLink = $("#page-link");

    //event error
    self.port.on("noImageFound", function(message){ noImageFound(message); });
    self.port.on("displayError", function(message){ displayError(message); });
    self.port.on("hideError", function(){ hideError(); })

    addListeners();
  }

  function addListeners() {
    $(document).on("keypress", handleHotkeys)
    screenshotButton.on("click", captureImage);
    clipboardButton.on("click", pasteImage);
    pageLink.on("click", clickLink);
  }

  function removeListeners() {
    $(document).off("keypress");
    screenshotButton.off("click");
    clipboardButton.off("click");
    pageLink.off("click");
  }

  function handleHotkeys(e) {
    handler = hotkeys[e.keyCode];
    if (handler) handler();
  }

  // Handle clicks on the pasteboard.co link
  function clickLink() {
    pageLink.toggleClass("active");
    removeListeners();
    openTab();
  }

  // Open a tab on pasteboard.co
  function openTab() {
    self.port.emit('openTab');
  }

  function captureImage(){
    //not yet ready
  }

  function pasteImage(){
    //not yet ready
  }

  // Display an error in the error container element
  function displayError(text) {
    document.body.style.height = "auto";
    errorContainer.addClass("in");
    errorContainer.text(text);
  }

  function hideError(){
    document.body.style.height = "auto";
    errorContainer.removeClass("in");
    errorContainer.text("");
  }

  function noImageFound(text) {
    clipboardButton.toggleClass("active");
    screenshotButton.toggleClass("active");
    addListeners();
    displayError(text);
  }

  init();
})();