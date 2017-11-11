(function () {
  function SpectrogramVisualizer(audioContext, canvasElement) {
    this.analyserNode = audioContext.createAnalyser();
    this.analyserNode.fftSize = 8192;
    this.fftData = new Float32Array(this.analyserNode.frequencyBinCount);

    this.graphicWidth = parseInt(getComputedStyle(canvasElement).width, 10);
    this.graphicHeight = parseInt(getComputedStyle(canvasElement).height, 10);

    var gc = this.graphicContext = canvasElement.getContext("2d");
    gc.fillStyle = '#000000';

    this.pixel = gc.createImageData(1,1);
    this.pixel.data[3] = 255;

    this.gain = 0;
    this.stopping = false;

    this.draw();
  }

  SpectrogramVisualizer.prototype.acceptConnection = function (connectedNode) {
    connectedNode.connect(this.analyserNode);
    this.connectedNode = connectedNode;
  };

  SpectrogramVisualizer.prototype.draw = function () {
    if (this.stopping) {
      this.stopping = false;
      return;
    }

    var gc = this.graphicContext;
    var gw = this.graphicWidth;
    var gh = this.graphicHeight;

    if (!this.connectedNode) {
      gc.fillRect(0, 0, gw, gh);
    }
    else {
      var slideImage = gc.getImageData(0, 0, gw - 1, gh);
      gc.putImageData(slideImage, 1, 0);

      var i, y, n;

      this.analyserNode.getFloatFrequencyData(this.fftData);

      for (i = 0; i < gh; ++i) {
        n = Math.min(Math.max((this.fftData[i] + this.gain + 80) * 4, 0), 255);
        this.pixel.data[0] = n;
        this.pixel.data[1] = n;
        this.pixel.data[2] = n;
        gc.putImageData(this.pixel, 0, gh - i);
      }
    }

    this.animationHandle = requestAnimationFrame(function () { this.draw(); }.bind(this));
  };

  SpectrogramVisualizer.prototype.releaseConnection = function () {
    this.connectedNode.disconnect(this.analyserNode);
    delete this.connectedNode;
  };

  SpectrogramVisualizer.prototype.stop = function () {
    this.stopping = true;
  };

  window.App = window.App || {};
  window.App.SpectrogramVisualizer = SpectrogramVisualizer;
})();
