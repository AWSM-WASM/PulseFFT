(function () {
    var context = new AudioContext();
    var visCanvas = document.getElementById('visualizer')
    var visualizer = new App.FrequencyVisualizer(context, visCanvas);
    var gain = 0;
    var audioSource

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia (
        {
          audio: true,
          video: false
        },
        function (stream) {
          audioSource = context.createMediaStreamSource(stream);
          visualizer.acceptConnection(audioSource);
        },
        function (err) {
           console.log('Error initializing user media stream: ' + err);
        }
      );
    }

    var gainDisplay = document.getElementById('gain-display');
    var gainSlider = document.getElementById('gain-slider');

    gainSlider.addEventListener('input', function () {
      gain = parseFloat(gainSlider.value)
      gainDisplay.textContent = gain + ' db';
      visualizer.gain = gain;
    });

    var visSelect = document.getElementById('vis-select');
    visSelect.addEventListener('change', changeVisualizer);

    function changeVisualizer() {
      visualizer.releaseConnection(audioSource);
      visualizer.stop();
      visualizer = new App[visSelect.value + "Visualizer"](context, visCanvas);
      visualizer.gain = gain;
      visualizer.acceptConnection(audioSource);
    }
  })();