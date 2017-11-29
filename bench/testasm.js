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

function testWASMkissFFT(size) {
    var fft = new pulse.fftReal(size);
    console.log("fft?", fft);
    console.log("pulsey?", pulse.fftReal);
    console.log("running wasmkissfft test");
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
            
  function testWASMkissFFTCC(size) {
    var fft = pulse.fftComplex(size);
            
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
var tests = [testKissFFT, testKissFFTCC, testWASMkissFFT, testWASMkissFFTCC] //, testWASMkissFFT, testWASMkissFFTCC];
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
	"Running " + 2*iterations + " iterations per implementation.<br>Timings are given separately for the first half of the run (" + iterations + " iterations) and the second half, in case the JS engine takes some warming up.<br>Each cell contains results for the following buffer sizes: " + sizes[0] + ', ' + sizes[1] + ', ' + sizes[2] + ', ' + sizes[3] + ', ' + sizes[4] + '.';
    interval = setInterval(test, 200);
}