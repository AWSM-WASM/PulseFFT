<img align="left" width="100" height="100" src="https://github.com/AWSM-WASM/PulseFFT/blob/master/assets/logo.jpg"><h1>Pulse FFT</h1></br>

A WebAssembly implementation of kissFFT, the 'keep-it-simple-stupid' Fast Fourier Transform library written in C. This project allows forward and inverse FFTs to be computed with low-level processes in the browser with the performant WebAssembly format.

## Sample app

Watch Pulse convert real-time microphone input from the time/space domain to the frequency domain.
<p align="center"><img src=https://github.com/AWSM-WASM/PulseFFT/blob/master/assets/PulseFFT.gif alt="Frequency Spectrum"></p>

## Get Started

### Download Emscripten

```bash
$ git clone https://github.com/juj/emsdk.git
$ cd emsdk
$ ./emsdk install --build=Release sdk-incoming-64bit binaryen-master-64bit
$ ./emsdk activate --build=Release sdk-incoming-64bit binaryen-master-64bit
```
<!--- To do
### From npm

```bash
npm install --save pulsefft
```
--->

[//]: # (From Unpkg ES Modules ```<script type = "module">import pulsefft from "https://unpkg.com/pulsefft/esm/pulsefft.js";</script>```UMD build```<script src="https://umpkg.com/pulsefft/umd/pulsefft.js"></script>```)

## Usage

This library is a WebAssembly implementation of kissFFT; consult the [kissFFT README](https://github.com/bazaar-projects/kissfft) if you want more info on the internal FFT details. 

### Instantiate Pulse

```js
let pulse = {};
loadPulse()
    .then(module => {
        pulse = module;
    })
```
### Real Input
```js
// Create the WebAssembly instance.
const fft = new pulse.fftReal(size);
fft.forward(input)
```
### Complex Input
```js
// Create the WebAssembly instance.
const fft = new pulse.fftComplex(size);
fft.forward(input)
```

## Performance tests

For the benchmark test, 4000 iterations were performed on sample data of several different sizes (4, 8, 512, 2048, and  4096) on both .asm and .wasm formats. Both single-precision real and complex to complex FFT forwards were performed. The times for the first and second half of each test are shown separately to elucidate any differences caused by the Javascript engine warming up. The last column shows the rate at which each algorithm performed the 4000 iterations. For the larger buffer sizes, the Web Assembly compiled functions are consistently faster than their assembly compiled counterparts.

<p align="center"><img src="https://github.com/AWSM-WASM/PulseFFT/blob/master/assets/Benchmark.png"></p>

## Development

Make sure to clone the repo recursively, in order to get KissFFT.

```bash
git clone --recursive https://github.com/AWSM-WASM/PulseFFT.git
```
When finished, run `npm start`. This wil run the emsdk environment, compile the source code, and start the server at //localhost.8000.

### Demo page coming soon!

## Setup

KissFFT is not bundled in the source of this repository. 

## Collaborators
[Jo Zhou](https://github.com/thejozhou)  
[Augusto Alvarez](https://github.com/augustohalvarez)  
[Chris Kim](https://github.com/ckimchris)

## Contributing

Please submit issues/pull requests if you have feedback or message the PulseFFT team to be added as a contributor: PulseFFT@gmail.com

## Roadmap

Here's our top development priorities

* Caching .wasm client-side
* Enabling >ES6 module loading
* Refactoring to use async/await
* Adding robust Mocha/Chai/Sinon testing 
* Logging / Debugging mode for development, feedback, and error reporting
* Performance and stability updates
* Improved documentation
* Bundle and create npm package

## License

PulseFFT is licensed under the MIT License.  
KissFFT is licensed under the Revised BSD License.
