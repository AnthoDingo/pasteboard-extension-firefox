"use strict";

var SITE_URL = "http://pasteboard.co";

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
	tabs.open(SITE_URL);
});

function openTab(url, callback) {
  if (typeof callback === 'undefined') {
    tabs.open(SITE_URL);
  } else {
    tabs.open({
      url: SITE_URL,
      onReady: callback
    });
  }
}