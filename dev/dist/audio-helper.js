(function () {
  function AudioHelper(context) {
    this.context = context;
  }

  AudioHelper.prototype.loadBuffer = function (url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
      var data = request.response;

      this.context.decodeAudioData(data, function (buffer) {
        callback(buffer);
      },
      function (e) {
        throw new Error('Error decoding audio data: ' + e.err);
      });
    }.bind(this);

    request.send();
  };

  window.App = window.App || {};
  window.App.AudioHelper = AudioHelper;
})();
