let pulse;
loadPulse()
    .then(module => {
        pulse = module;
    }).catch(err => {
        console.log("Error in loading module: ", err);
    });

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

function testFFTasm(size) {

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

function testFFTCCasm(size) {

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

function testFFTwasm(size) {
    var fft = new pulse.fftReal(size);
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

    report("WASMkissfft", start, middle, end, total);

    fft.dispose();
  }

  function testFFTCCwasm(size) {
    var fft = new pulse.fftComplex(size);

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

    report("WASMkissfftcc", start, middle, end, total);

    fft.dispose();
  }

var sizes = [ 4, 8, 512, 2048, 4096 ];
var tests = [testFFTasm, testFFTCCasm, testFFTwasm, testFFTCCwasm];
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
    interval = setInterval(test, 200);
}

window.onload = function() {
    document.getElementById("test-description").innerHTML =
    "The table above compares two fft functions from the kissfft library compiled to both assembly and WebAssembly. 4000 iterations of each algorithm were performed on sample data of several different sizes (4, 8, 512, 2048, and  4096).<br> The times for the first and second half of each test are shown separately to elucidate any differences caused by the Javascript engine warming up. The last column shows the rate at which each algorithm performed the 4000 iterations. For the larger buffer sizes, the Web Assembly compiled functions are consistently faster than their assembly copiled counterparts."
	// "Running " + 2*iterations + " iterations per implementation.<br>Timings are given separately for the first half of the run (" + iterations + " iterations) and the second half, in case the JS engine takes some warming up.<br>Each cell contains results for the following buffer sizes: " + sizes[0] + ', ' + sizes[1] + ', ' + sizes[2] + ', ' + sizes[3] + ', ' + sizes[4] + '.';
    interval = setInterval(test, 200);
}

function testWASMmic (size, freqData) {
    var magnitudes = new Float32Array((size / 2) + 1);
    var fft = new pulse.fftReal(size);

    var ri = freqData;
    var out = fft.forward(ri);

    for (var j = 0; j <= size/2; ++j) {
      magnitudes[j] = Math.sqrt(out[j*2] * out[j*2] + out[j*2+1] * out[j*2+1]);
    }

    fft.dispose();
    return magnitudes;
  }



  var webaudio_tooling_obj = function () {
    var frequencyData = new Float32Array(1025);
    var svgHeight = '600';
    var svgWidth = '1200';
    var barPadding = '1';

    function createSvg(parent, height, width) {
      return d3.select(parent).append('svg').attr('height', height).attr('width', width);
    }
    var svg = createSvg('#graph', svgHeight, svgWidth);

    // Set up initial D3 chart.
    svg.selectAll('rect')
    .data(frequencyData)
    .enter()
    .append('rect')
    .attr('x', function (d, i) {
      return i * (svgWidth / frequencyData.length);
    })
    .attr('width', svgWidth / frequencyData.length);



    var audioContext = new AudioContext(),
        microphone_stream = null,
        script_processor_node = null;


    if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (navigator.getUserMedia){
        navigator.getUserMedia({audio:true},
          function(stream) {
              start_microphone(stream);
          },
          function(e) {
            console.log('Error capturing audio: ', e);
          }
        );
    } else { alert('getUserMedia not supported in this browser.'); }




    function start_microphone(stream){
      microphone_stream = audioContext.createMediaStreamSource(stream);
      script_processor_node = audioContext.createScriptProcessor(2048, 1, 1);

      microphone_stream.connect(script_processor_node);
      script_processor_node.connect(audioContext.destination);

      script_processor_node.onaudioprocess = process_microphone_buffer;


      function process_microphone_buffer(event) {
          var microphone_input_buffer = event.inputBuffer.getChannelData(0);

          function hanningWindow(inputBuffer) {
            for (var i = 1; i < inputBuffer.length; i += 1) {
              inputBuffer[i] *= 0.54 - ((0.46) * (Math.cos((2 * Math.PI * i)/(microphone_input_buffer.length - 1))))
            }
            return inputBuffer;
          }

          var windowedInput = hanningWindow(microphone_input_buffer);
          frequencyData = testWASMmic(windowedInput.length, windowedInput);
      }

      function renderChart() {
        requestAnimationFrame(renderChart);
        svg.selectAll('rect')
        .data(frequencyData)
        .attr('y', function(d) {
          return .5 *(svgHeight - (d * 25));
        })
        .attr('height', function(d) {
          return d * 25;
        })
        .attr('fill', function(d) {
          return '#adc5ff';
        });
      }
      renderChart();
    }
  }();
