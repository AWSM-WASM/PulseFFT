(function () {
  function FrequencyVisualizer(audioContext, canvasElement) {
    this.analyserNode = audioContext.createAnalyser();
    this.analyserNode.fftSize = 8192;
    this.fftData = new Float32Array(this.analyserNode.frequencyBinCount);

    this.graphicWidth = parseInt(getComputedStyle(canvasElement).width, 10);
    this.graphicHeight = parseInt(getComputedStyle(canvasElement).height, 10);

    var gc = this.graphicContext = canvasElement.getContext("2d");
    gc.fillStyle = '#000000';
    gc.strokeStyle = '#c0c0c0';

    this.gain = 0;
    this.stopping = false;

    this.draw();
  }

  FrequencyVisualizer.prototype.acceptConnection = function (connectedNode) {
    connectedNode.connect(this.analyserNode);
    this.connectedNode = connectedNode;
  };

  FrequencyVisualizer.prototype.draw = function () {
    if (this.stopping) {
      this.stopping = false;
      return;
    }

    var gc = this.graphicContext;
    var gw = this.graphicWidth;
    var gh = this.graphicHeight;

    gc.fillRect(0, 0, gw, gh);

    if (this.connectedNode) {
      var i, x, y;
      var scale = gh / 80;

      this.analyserNode.getFloatFrequencyData(this.fftData);

      for (i = 0; i < gw; ++i) {
        y = -(this.fftData[i] + this.gain + 15) * scale;

        gc.beginPath();
        gc.moveTo(i + 0.5, gh);
        gc.lineTo(i + 0.5, y);
        gc.stroke();
      }
    }

    this.animationHandle = requestAnimationFrame(function () { this.draw(); }.bind(this));
  };

  FrequencyVisualizer.prototype.releaseConnection = function () {
    this.connectedNode.disconnect(this.analyserNode);
    delete this.connectedNode;
  };

  FrequencyVisualizer.prototype.stop = function () {
    this.stopping = true;
  };

  window.App = window.App || {};
  window.App.FrequencyVisualizer = FrequencyVisualizer;
})();
