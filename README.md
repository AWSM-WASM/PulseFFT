# Pulse FFT

A WebAssembly implementation of kissFFT, the 'keep-it-simple-stupid' Fast Fourier Transform library written in C. This project allows forward and inverse FFTs to be computed with low-level processes in the browser with the performant WebAssembly format.

## Sample app

Watch Pulse convert real-time microphone input from the time/space domain to the frequency domain.
![Frequency Spectrum](https://github.com/AWSM-WASM/PulseFFT/blob/master/assets/PulseFFT.gif)

## Get Started

### Download Emscripten

```
$ git clone https://github.com/juj/emsdk.git
$ cd emsdk
$ ./emsdk install --build=Release sdk-incoming-64bit binaryen-master-64bit
$ ./emsdk activate --build=Release sdk-incoming-64bit binaryen-master-64bit
```

### From npm

```
npm install --save pulsefft
```

### From Unpkg

ES Modules
```
<script type = "module">import pulsefft from "https://unpkg.com/pulsefft/esm/pulsefft.js";</script>
```
UMD build
```
<script src="https://umpkg.com/pulsefft/umd/pulsefft.js"></script>
```

## Usage

This library is a WebAssembly implementation of kissFFT; consult the kissFFT README(insert link to readme) if you want more info on the internal FFT details. 

### Instantiate Pulse

```
let pulse = {};
loadPulse()
    .then(module => {
        pulse = module;
    })
```
### Real Input
```
// Create the WebAssembly instance.
const fft = new pulse.fftReal(size);
fft.forward(input)

```
### Complex Input
```
// Create the WebAssembly instance.
const fft = new pulse.fftComplex(size);
fft.forward(input)
```
### Output

## Performance tests
## Development

Make sure to clone the repo recursively, in order to get KissFFT.

```
git clone --recursive https://github.com/AWSM-WASM/PulseFFT.git
```
When finished, run `npm start`. This wil run the emsdk environment, compile the source code, and start the server at //localhost.8000.

### Setup

KissFFT is not bundled in the source of this repository. 

### Contributing

Additional instructions about webAssembly and general questions can be directed here: http://webassembly.org/getting-started/developers-guide/

afterwards git clone the following into your emsdk directory
https://github.com/AWSM-WASM/FFTWASM.git

NPM start - Use this npm command to point your paths to your current directory, run the KissFFT and WASMkissFFT scripts in your Makefile.emscripten. Afterwards it'll start up your local server