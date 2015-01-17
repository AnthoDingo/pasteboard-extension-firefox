(function() {
	html2canvas(document.body, {
	  onrendered: function(canvas) {
	  	var img = canvas.toDataURL("image/png");
	    self.postMessage(img);
	  }
	});
})()