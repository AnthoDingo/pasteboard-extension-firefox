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

    self.port.on("handlePaste", function(data){ handlePaste(data); });
    self.port.on("resetButton", function(){ resetButton(); });

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
    pageLink.addClass("active");
    removeListeners();
    openTab();
  }

  // Open a tab on pasteboard.co
  function openTab() {
    self.port.emit('openTab');
  }

  function captureImage(){
    var error = "Could not screenshot the current page.";
    screenshotButton.addClass("active");
    removeListeners();
    self.port.emit("captureImage", error);
  }

  function pasteImage(){
    var error = "No image was found in your clipboard.";
    clipboardButton.addClass("active");
    removeListeners();
    self.port.emit("pasteImage", error);
  }

  function handlePaste(data, error) {
    readData(data, function(image){
      if (!image) return noImageFound(error);

      self.port.emit("insertImage", image, error);
    });
  }

  // Read a file as base64 data
  function readData(image, callback) {
    // Call callback with input (asynchronously) if it
    // already is a string (assuming base64)
    if (typeof image === "string")
      return setTimeout(callback.bind(this, image), 1);

    fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.onload = function() {
      callback(fileReader.result);
    }
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
    clipboardButton.removeClass("active");
    screenshotButton.removeClass("active");
    addListeners();
    displayError(text);
  }

  function resetButton() {
    clipboardButton.removeClass("active");
    screenshotButton.removeClass("active");
    addListeners();
  }

  init();
})();