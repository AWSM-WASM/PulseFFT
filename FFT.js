"use strict";

var kissFFTModule = KissFFTModule({});

var kiss_fftr_alloc = kissFFTModule.cwrap(
    'kiss_fftr_alloc', 'number', ['number', 'number', 'number', 'number' ]
);

var kiss_fftr = kissFFTModule.cwrap(
    'kiss_fftr', 'void', ['number', 'number', 'number' ]
);

var kiss_fftri = kissFFTModule.cwrap(
    'kiss_fftri', 'void', ['number', 'number', 'number' ]
);

// var kiss_fftr_free = kissFFTModule.cwrap(
//     'kiss_fftr_free', 'void', ['number']
// );

var kiss_fft_alloc = kissFFTModule.cwrap(
    'kiss_fft_alloc', 'number', ['number', 'number', 'number', 'number' ]
);

var kiss_fft = kissFFTModule.cwrap(
    'kiss_fft', 'void', ['number', 'number', 'number' ]
);

// var kiss_fft_free = kissFFTModule.cwrap(
//     'kiss_fft_free', 'void', ['number']
// );

function KissFFT(size) {

    this.size = size;
    this.fcfg = kiss_fft_alloc(size, false);
    this.icfg = kiss_fft_alloc(size, true);

    var samplesize = 8;
    this.inptr = kissFFTModule._malloc(size*samplesize*2 + size*samplesize*2);
    this.outptr = this.inptr + size*samplesize*2;
    
    this.cin = new Float64Array(kissFFTModule.HEAPU8.buffer, this.inptr, size*2);
    this.cout = new Float64Array(kissFFTModule.HEAPU8.buffer, this.outptr, size*2);
    
    this.forward = function(cin) {
	this.cin.set(cin);
	kiss_fft(this.fcfg, this.inptr, this.outptr);
	return new Float64Array(kissFFTModule.HEAPU8.buffer,
				this.outptr, this.size * 2);
    }
    
    this.inverse = function(cin) {
	this.cin.set(cpx);
	kiss_fft(this.icfg, this.inptr, this.outptr);
	return new Float64Array(kissFFTModule.HEAPU8.buffer,
				this.outptr, this.size * 2);
    }
    
    // this.dispose = function() {
	// kissFFTModule._free(this.inptr);
	// kiss_fft_free(this.fcfg);
	// kiss_fft_free(this.icfg);
    // }
}

function KissFFTR(size) {

    this.size = size;
    this.fcfg = kiss_fftr_alloc(size, false);
    this.icfg = kiss_fftr_alloc(size, true);
    
    var samplesize = 8;
    this.rptr = kissFFTModule._malloc(size*samplesize + (size+2)*samplesize);
    this.cptr = this.rptr + size*samplesize;
    
    this.ri = new Float64Array(kissFFTModule.HEAPU8.buffer, this.rptr, size);
    this.ci = new Float64Array(kissFFTModule.HEAPU8.buffer, this.cptr, size+2);
    
    this.forward = function(real) {
	this.ri.set(real);
	kiss_fftr(this.fcfg, this.rptr, this.cptr);
	return new Float64Array(kissFFTModule.HEAPU8.buffer,
				this.cptr, this.size + 2);
    }
    
    this.inverse = function(cpx) {
	this.ci.set(cpx);
	kiss_fftri(this.icfg, this.cptr, this.rptr);
	return new Float64Array(kissFFTModule.HEAPU8.buffer,
				this.rptr, this.size);
    }
    
    // this.dispose = function() {
	// kissFFTModule._free(this.rptr);
	// kiss_fftr_free(this.fcfg);
	// kiss_fftr_free(this.icfg);
    // }
}

//============WASMkissFFT=================//

var WASMkissFFTModule = WASMkissFFTModule({});

var WASMkiss_fftr_alloc = WASMkissFFTModule.cwrap(
    'kiss_fftr_alloc', 'number', ['number', 'number', 'number', 'number' ]
);

var WASMkiss_fftr = WASMkissFFTModule.cwrap(
    'kiss_fftr', 'void', ['number', 'number', 'number' ]
);

var WASMkiss_fftri = WASMkissFFTModule.cwrap(
    'kiss_fftri', 'void', ['number', 'number', 'number' ]
);

// var WASMkiss_fftr_free = WASMkissFFTModule.cwrap(
//     'kiss_fftr_free', 'void', ['number']
// );

var WASMkiss_fft_alloc = WASMkissFFTModule.cwrap(
    'kiss_fft_alloc', 'number', ['number', 'number', 'number', 'number' ]
);

var WASMkiss_fft = WASMkissFFTModule.cwrap(
    'kiss_fft', 'void', ['number', 'number', 'number' ]
);

// var WASMkiss_fft_free = WASMkissFFTModule.cwrap(
//     'kiss_fft_free', 'void', ['number']
// );

function WASMkissFFT(size) {

    this.size = size;
    this.fcfg = WASMkiss_fft_alloc(size, false);
    this.icfg = WASMkiss_fft_alloc(size, true);

    var samplesize = 8;
    this.inptr = WASMkissFFTModule._malloc(size*samplesize*2 + size*samplesize*2);
    this.outptr = this.inptr + size*samplesize*2;
    
    this.cin = new Float64Array(WASMkissFFTModule.HEAPU8.buffer, this.inptr, size*2);
    this.cout = new Float64Array(WASMkissFFTModule.HEAPU8.buffer, this.outptr, size*2);
    
    this.forward = function(cin) {
	this.cin.set(cin);
	WASMkiss_fft(this.fcfg, this.inptr, this.outptr);
	return new Float64Array(WASMkissFFTModule.HEAPU8.buffer,
				this.outptr, this.size * 2);
    }
    
    this.inverse = function(cin) {
	this.cin.set(cpx);
	WASMkiss_fft(this.icfg, this.inptr, this.outptr);
	return new Float64Array(WASMkissFFTModule.HEAPU8.buffer,
				this.outptr, this.size * 2);
    }
    
    // this.dispose = function() {
	// WASMkissFFTModule._free(this.inptr);
	// WASMkiss_fft_free(this.fcfg);
	// WASMkiss_fft_free(this.icfg);
    // }
}

function WASMkissFFTR(size) {

    this.size = size;
    this.fcfg = WASMkiss_fftr_alloc(size, false);
    this.icfg = WASMkiss_fftr_alloc(size, true);
    
    var samplesize = 8;
    this.rptr = WASMkissFFTModule._malloc(size*samplesize + (size+2)*samplesize);
    this.cptr = this.rptr + size*samplesize;
    
    this.ri = new Float64Array(WASMkissFFTModule.HEAPU8.buffer, this.rptr, size);
    this.ci = new Float64Array(WASMkissFFTModule.HEAPU8.buffer, this.cptr, size+2);
    
    this.forward = function(real) {
	this.ri.set(real);
	WASMkiss_fftr(this.fcfg, this.rptr, this.cptr);
	return new Float64Array(WASMkissFFTModule.HEAPU8.buffer,
				this.cptr, this.size + 2);
    }
    
    this.inverse = function(cpx) {
	this.ci.set(cpx);
	WASMkiss_fftri(this.icfg, this.cptr, this.rptr);
	return new Float64Array(WASMkissFFTModule.HEAPU8.buffer,
				this.rptr, this.size);
    }
    
    // this.dispose = function() {
	// kissFFTModule._free(this.rptr);
	// kiss_fftr_free(this.fcfg);
	// kiss_fftr_free(this.icfg);
    // }
}