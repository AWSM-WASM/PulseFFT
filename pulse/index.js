var Module = {};

loadPulse = () => {
  return new Promise((resolve, reject) => {
    fetch('pulse/src/wasmkissfft.wasm')
      .then(response => {
        console.log("made it into loadpulse");
        return response.arrayBuffer();
      }).then((m) => {
        console.log("step into m");

        Module.wasmBinary = m;

        script = document.createElement('script');
        script.src = 'pulse/src/wasmkissfft.js';
        script.type='text/javascript';
        script.onload = () => {
          console.log("Loaded Emscripten.");
        };
        doneEvent = new Event('done');
        script.addEventListener('done', buildPulse);
        document.body.appendChild(script);

        function buildPulse() {
          const pulse = {};

          pulse['fftComplex'] = function (size) {
            this.size = size;
            this.fcfg = _kiss_fft_alloc(size, false);
            this.icfg = _kiss_fft_alloc(size, true);

            this.inptr = _malloc(size*8 + size*8);
            this.outptr = this.inptr + size*8;

            this.cin = new Float32Array(HEAPU8.buffer, this.inptr, size*2);
            this.cout = new Float32Array(HEAPU8.buffer, this.outptr, size*2);

            this.forward = function(cin) {
              this.cin.set(cin);
              _kiss_fft(this.fcfg, this.inptr, this.outptr);
              return new Float32Array(HEAPU8.buffer,
                this.outptr, this.size * 2);
              }
            this.inverse = function(cin) {
              this.cin.set(cpx);
              _kiss_fft(this.icfg, this.inptr, this.outptr);
              return new Float32Array(HEAPU8.buffer,
                this.outptr, this.size * 2);
            }
            this.dispose = function() {
              _free(this.inptr);
              _free(this.fcfg);
              _free(this.icfg);
            }
        };
        pulse['fftReal'] = function (size) {
          this.size = size;
          this.fcfg = _kiss_fftr_alloc(size, false);
          this.icfg = _kiss_fftr_alloc(size, true);

          this.rptr = _malloc(size*4 + (size+2)*4);
          this.cptr = this.rptr + size*4;

          this.ri = new Float32Array(HEAPU8.buffer, this.rptr, size);
          this.ci = new Float32Array(HEAPU8.buffer, this.cptr, size+2);

          this.forward = function(real) {
            this.ri.set(real);
            _kiss_fftr(this.fcfg, this.rptr, this.cptr);
            return new Float32Array(HEAPU8.buffer, this.cptr, this.size + 2); //changed here
          }
          this.inverse = function(cpx) {
            this.ci.set(cpx);
            _kiss_fftri(this.icfg, this.cptr, this.rptr);
            return new Float32Array(HEAPU8.buffer, this.rptr, this.size);
          }
          this.dispose = function() {
            _free(this.rptr);
            _free(this.fcfg);
            _free(this.icfg);
          }
        }

        console.log(pulse);
        resolve(pulse);
      }
    })
  })
}
