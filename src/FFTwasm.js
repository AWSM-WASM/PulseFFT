var Module = {};

loadWASM = () => {
  return new Promise((resolve) => {
    fetch('src/WASMkissFFT.wasm')    // load the .wasm file
      .then(response => response.arrayBuffer())
      .then((buffer) => {    //return ArrayBuffer
        Module.wasmBinary = buffer;   // assign buffer to Module
        
        const script = document.createElement('script');
        script.src = 'src/WASMkissFFT.js';   // set script source
        script.type='text/javascript';
        script.onload = () => {    // once script has loaded
          console.log("Loaded Emscripten.");
          resolve(Module);    // return Module
        };
        document.body.appendChild(script); // append script to DOM
        // doneEvent = new Event('done');
        // script.addEventListener('done', WASMkissFFT, WASMkissFFTR);
      });
    });
  };
  
  loadWASM().then((m) => {    // 'm' now holds _myFunc()
  console.log("WASM loaded!")

  function WASMkissFFT(size) {
    this.size = size;
    this.fcfg = m._kiss_fft_alloc(size, false);
    this.icfg = m._kiss_fft_alloc(size, true);
    
    this.inptr = m._malloc(size*8 + size*8);
    this.outptr = this.inptr + size*8;
    
    this.cin = new Float32Array(m.HEAPU8.buffer, this.inptr, size*2);
    this.cout = new Float32Array(m.HEAPU8.buffer, this.outptr, size*2);
    
    this.forward = function(cin) {
      this.cin.set(cin);
      m._kiss_fft(this.fcfg, this.inptr, this.outptr);
      return new Float32Array(m.HEAPU8.buffer,
        this.outptr, this.size * 2);
      }
      
    this.inverse = function(cin) {
      this.cin.set(cpx);
      m._kiss_fft(this.icfg, this.inptr, this.outptr);
      return new Float32Array(m.HEAPU8.buffer,
        this.outptr, this.size * 2);
    }
        
    this.dispose = function() {
      m._free(this.inptr);
      m._free(this.fcfg);
      m._free(this.icfg);
    }
  }
      
  function WASMkissFFTR(size) {
    this.size = size;
    this.fcfg = m._kiss_fftr_alloc(size, false);
    this.icfg = m._kiss_fftr_alloc(size, true);
        
    this.rptr = m._malloc(size*4 + (size+2)*4);
    this.cptr = this.rptr + size*4;
        
    this.ri = new Float32Array(m.HEAPU8.buffer, this.rptr, size);
    this.ci = new Float32Array(m.HEAPU8.buffer, this.cptr, size+2);
        
    this.forward = function(real) {
      this.ri.set(real);
      m._kiss_fftr(this.fcfg, this.rptr, this.cptr);
      return new Float32Array(m.HEAPU8.buffer, this.cptr, this.size + 2); //changed here
    }
    this.inverse = function(cpx) {
      this.ci.set(cpx);
      m._kiss_fftri(this.icfg, this.cptr, this.rptr);
      return new Float32Array(m.HEAPU8.buffer, this.rptr, this.size);
    }
    this.dispose = function() {
      m._free(this.rptr);
      m._free(this.fcfg);
      m._free(this.icfg);
    }
  }

  function testWASMkissFFT(size) {
    var fft = new WASMkissFFTR(size);
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
    var fft = new WASMkissFFT(size);
            
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
  var tests = [testWASMkissFFT, testWASMkissFFTCC];
  var nextTest = 0;
  var nextSize = 0;
  var interval;
            
  function testWASM() {
    console.log("runnning testWASM")
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
    interval = setInterval(testWASM, 200);
  }
  console.log("created ALL WASM tests!!!")
  testWASM();
}).then(() => {
  console.log("EXITED STUFF")
})