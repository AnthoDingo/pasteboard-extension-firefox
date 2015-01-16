"use strict";

var SITE_URL = "http://pasteboard.co";

var self = require("sdk/self");
var { ToggleButton } = require("sdk/ui/button/toggle");
var tabs = require("sdk/tabs");
var clipboard = require("sdk/clipboard");

var past_panel = require("sdk/panel").Panel({
	width: 370,
	height: 128,
	contentURL: "./popup.html",
  contentScriptFile: ["./scripts/jquery-1.11.2.min.js", "./scripts/popup.js"],
	onHide: handleHide
});

var button = ToggleButton({
  id: "pasteboard-link",
  label: "Upload an image to pasteboard",
  icon: {
    "16": "./images/icon-16.png",
    "32": "./images/icon-32.png",
    "64": "./images/icon-64.png",
    "128": "./images/icon-128.png"
  },
  onChange: handleChange
});

function handleChange(state) {
  if (state.checked) {
	  past_panel.show({ position: button });
  }
}

function handleHide() {
  button.state('window', {checked: false});
  past_panel.port.emit('hideError');
  past_panel.resize(370, 137);
}

past_panel.port.on('openTab', function(){
	openTab();
});

function openTab(callback) {
  if (typeof callback === 'undefined') {
    tabs.open(SITE_URL);
  } else {
    tabs.open({
      url: SITE_URL,
      onReady: callback
    });
  }
}

past_panel.port.on("pasteImage", function(errorMessage){
  pasteImage(errorMessage);
})

function pasteImage(error){
   if (clipboard.currentFlavors.indexOf("image") != -1){
    past_panel.port.emit("handlePaste", clipboard.get('image'), error);
  } else {
    noImageFound(error);
  }
}

past_panel.port.on("captureImage", function(errorMessage){
  captureImage(errorMessage);
});

function captureImage(error){
  var image = tabs.activeTab.getThumbnail();
  if(!image) noImageFound(error);
  insertImage(image, error);
}

past_panel.port.on("insertImage", function(imageData, errorMessage){
  insertImage(imageData, "error");
});

function insertImage(image, errorMessage){
    openTab(function(tab){
      insertContentScript(tab, image);
    });
}

function insertContentScript(tab, imageData){
  //Apply a correction to base64 char
  imageData = imageData.replace(/\s/g, '');
  imageData = imageData.replace(/\n/g, '');
  imageData = imageData.replace(/\%2B/g, '+');
  imageData = imageData.replace(/\%2F/g, '/');

  tab.attach({
    contentScriptFile: "./scripts/content.js",
    contentScriptOptions: {
      EXT_IMAGE_DATA: imageData,
      injectURL: self.data.url("scripts/inject.js")
    }
  });

  past_panel.port.emit("resetButton");
}

past_panel.on("displayError", function(errorMessage){ displayError(errorMessage); });

function displayError(text) {
  past_panel.resize(370, 171);
  past_panel.port.emit("displayError", text);
}

function noImageFound(errorMessage) {
  past_panel.resize(370, 171);
  past_panel.port.emit("noImageFound", errorMessage);
}