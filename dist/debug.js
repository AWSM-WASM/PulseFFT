'use strict';

const pulse = async () => {
  const response = await fetch('...');
  const m = await response.arrayBuffer();
  console.log("in buffering");
  const script = document.createElement('script');
  script.src = 'src/WASMkissFFT.js'; 
  script.type='text/javascript';
  script.onload = () => console.log("Loaded Emscripten.");
  document.body.appendChild(script); 
  
  console.log("WASM loaded!");
  return {
    fftComplex(size) {
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
      };
      this.inverse = function(cin) {
        this.cin.set(cpx);
        m._kiss_fft(this.icfg, this.inptr, this.outptr);
        return new Float32Array(m.HEAPU8.buffer,
          this.outptr, this.size * 2);
      };   
      this.dispose = function() {
        m._free(this.inptr);
        m._free(this.fcfg);
        m._free(this.icfg);
      };
    },
    fftReal(size) {
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
        return new Float32Array(m.HEAPU8.buffer, this.cptr, this.size + 2); 
      };
      this.inverse = function(cpx) {
        this.ci.set(cpx);
        m._kiss_fftri(this.icfg, this.cptr, this.rptr);
        return new Float32Array(m.HEAPU8.buffer, this.rptr, this.size);
      };
      this.dispose = function() {
        m._free(this.rptr);
        m._free(this.fcfg);
        m._free(this.icfg);
      };
    }
  };
};

// const pulse = require("./");

async function test() {
    const testing = await pulse();
    console.log(testing);
}

module.exports = test;
