// test.js

var webaudio_tooling_obj = function () {

  var audioContext = new AudioContext();
  console.log("audio is starting up ...");

  var BUFF_SIZE_RENDERER = 16384;

  // Initialize variables
  var audioInput = null,
  microphone_stream = null,
  gain_node = null,
  script_processor_node = null,
  script_processor_analysis_node = null,
  analyser_node = null;

  // Browser compatability prefixes
  if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }

  // If user/browser allows microphone access...
  // Call the start_microphone function passing in the audio stream object
  if (navigator.getUserMedia) {
    navigator.getUserMedia({audio:true},
      function(stream) {
        start_microphone(stream);
      },
      function(e) {
        alert('Error capturing audio.');
      });
    } else {
      alert('getUserMedia not supported in this browser.');
    }

    function start_microphone(stream){

      gain_node = audioContext.createGain();
      gain_node.connect( audioContext.destination );

      microphone_stream = audioContext.createMediaStreamSource(stream);
      microphone_stream.connect(gain_node);

      script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE_RENDERER, 1, 1);
      script_processor_node.onaudioprocess = process_microphone_buffer;

      microphone_stream.connect(script_processor_node);

      // --- enable volume control for output speakers
      document.getElementById('volume').addEventListener('change', function() {

        var curr_volume = this.value;
        gain_node.gain.value = curr_volume;

        console.log("curr_volume ", curr_volume);
      });

      // --- setup FFT
      script_processor_analysis_node = audioContext.createScriptProcessor(2048, 1, 1);
      script_processor_analysis_node.connect(gain_node);

      analyser_node = audioContext.createAnalyser();
      analyser_node.smoothingTimeConstant = 0;
      analyser_node.fftSize = 2048;

      microphone_stream.connect(analyser_node);

      analyser_node.connect(script_processor_analysis_node);

      var buffer_length = analyser_node.frequencyBinCount;

      var array_freq_domain = new Uint8Array(buffer_length);
      var array_time_domain = new Uint8Array(buffer_length);

      console.log("buffer_length " + buffer_length);

      script_processor_analysis_node.onaudioprocess = function() {

        // get the average for the first channel
        analyser_node.getByteFrequencyData(array_freq_domain);
        analyser_node.getByteTimeDomainData(array_time_domain);

        // draw the spectrogram
        if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {

          //show_some_data(array_freq_domain, 5, "frequency");
          show_some_data(array_time_domain, 5, "time"); // store this to record to aggregate buffer/file
        }
      };
    }

    function show_some_data(given_typed_array, num_row_to_display, label) {

      var size_buffer = given_typed_array.length;
      var index = 0;

      console.log("__________ " + label);

      if (label === "time") {

        for (; index < num_row_to_display && index < size_buffer; index += 1) {

          var curr_value_time = (given_typed_array[index] / 128) - 1.0;

          console.log(curr_value_time);
        }

      } else if (label === "frequency") {

        for (; index < num_row_to_display && index < size_buffer; index += 1) {

          console.log(given_typed_array[index]);
        }

      } else {

        throw new Error("ERROR - must pass time or frequency");
      }
    }

    function process_microphone_buffer(event) {

      var i, N, inp, microphone_output_buffer;

      microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now
    }

  }(); // SELF INVOKED


/* Utility functions to generate arbitrary input in various formats */
function inputReals(size) {
    var result = new Float32Array(size);
    for (var i = 0; i < result.length; i++)
	result[i] = (i % 2) / 4.0;
    return result;
}

function zeroReals(size) {
    var result = new Float32Array(size);
    for (var i = 0; i < result.length; i++)
	result[i] = 0.0;
    return result;
}

function inputInterleaved(size) {
    var result = new Float32Array(size*2);
    for (var i = 0; i < size; i++)
	result[i*2] = (i % 2) / 4.0;
    return result;
}

function inputReal64s(size) {
    var result = new Float64Array(size);
    for (var i = 0; i < result.length; i++)
	result[i] = (i % 2) / 4.0;
    return result;
}

function zeroReal64s(size) {
    var result = new Float64Array(size);
    for (var i = 0; i < result.length; i++)
	result[i] = 0.0;
    return result;
}

function inputComplexArray(size) {
    var result = new complex_array.ComplexArray(size);
    for (var i = 0; i < size; i++) {
	result.real[i] = (i % 2) / 4.0;
	result.imag[i] = 0.0;
    }
    return result;
}

var iterations = 2000;

function report(name, start, middle, end, total) {
    function addTo(tag, thing) {
	document.getElementById(name + "-" + tag).innerHTML += thing + "<br>";
    }
    addTo("result", total);
    addTo("1", Math.round(middle - start) + " ms");
    addTo("2", Math.round(end - middle) + " ms");
    addTo("itr", Math.round((1000.0 /
			     ((end - middle) / iterations))) + " itr/sec");
}

function testKissFFT(size) {

    var fft = new KissFFTR(size);

    var start = performance.now();
    var middle = start;
    var end = start;

    total = 0.0;

    for (var i = 0; i < 2*iterations; ++i) {
	if (i == iterations) {
	    middle = performance.now();
	}
	var ri = inputReals(size);
	var out = fft.forward(ri);
	for (var j = 0; j <= size/2; ++j) {
	    total += Math.sqrt(out[j*2] * out[j*2] + out[j*2+1] * out[j*2+1]);
	}
	// KissFFTR returns only the first half of the output (plus
	// DC/Nyquist) -- synthesise the conjugate half
	for (var j = 1; j < size/2; ++j) {
	    total += Math.sqrt(out[j*2] * out[j*2] + out[j*2+1] * out[j*2+1]);
	}
    }

    var end = performance.now();

    report("kissfft", start, middle, end, total);

    fft.dispose();
}

function testKissFFTCC(size) {

    var fft = new KissFFT(size);

    var start = performance.now();
    var middle = start;
    var end = start;

    total = 0.0;

    for (var i = 0; i < 2*iterations; ++i) {
	if (i == iterations) {
	    middle = performance.now();
	}
	var cin = inputInterleaved(size);
	var out = fft.forward(cin);
	for (var j = 0; j < size; ++j) {
	    total += Math.sqrt(out[j*2] * out[j*2] + out[j*2+1] * out[j*2+1]);
	}
    }

    var end = performance.now();

    report("kissfftcc", start, middle, end, total);

    fft.dispose();
}

var sizes = [ 4, 8, 512, 2048 ];
var tests = [testKissFFT, testKissFFTCC];
var nextTest = 0;
var nextSize = 0;
var interval;

function test() {
    clearInterval(interval);
    if (nextTest == tests.length) {
	nextSize++;
	nextTest = 0;
	if (nextSize == sizes.length) {
	    return;
	}
    }
    f = tests[nextTest];
    size = sizes[nextSize];
    nextTest++;
    f(size);
    interval = setInterval(test, 100);
}

window.onload = function() {
    document.getElementById("test-description").innerHTML =
	"Running " + 2*iterations + " iterations per implementation.<br>Timings are given separately for the first half of the run (" + iterations + " iterations) and the second half, in case the JS engine takes some warming up.<br>Each cell contains results for the following sizes: " + sizes;
    interval = setInterval(test, 100);
}
