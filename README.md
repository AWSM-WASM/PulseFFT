## Fast Fourier Transform library using the power of WebAssembly (.wasm)

### Install

Before you begin please do a git clone and then an install of EMSCRIPTEN on your local machine. 

$ git clone https://github.com/juj/emsdk.git

$ cd emsdk

$ ./emsdk install latest

$ ./emsdk activate latest


 or
 
 
$ git clone https://github.com/juj/emsdk.git

$ cd emsdk

$ ./emsdk install --build=Release sdk-incoming-64bit binaryen-master-64bit

$ ./emsdk activate --build=Release sdk-incoming-64bit binaryen-master-64bit

Additional instructions about webAssembly and general questions can be directed here: http://webassembly.org/getting-started/developers-guide/

afterwards git clone the following into your emsdk directory
https://github.com/AWSM-WASM/FFTWASM.git

NPM start - Use this npm command to point your paths to your current directory, run the KissFFT and WASMkissFFT scripts in your Makefile.emscripten. Afterwards it'll start up your local server

## Web Audio Examples - JavaScript

### audio-helper.js
* Provides a helper function which loads an audio samples with an
  AJAX call into an audio buffer.

### frequency-visualizer.js
* Turns a canvas element into an animated frequency bar visualization
  when connected to an _AudioNode_.

### spectrogram-visualizer.js
* Turns a canvas element into an moving spectrogram when connected to
  an _AudioNode_.


## Copyright and License

Copyright 2013-2017 Blackrock Digital LLC. Code released under the [MIT](https://github.com/BlackrockDigital/startbootstrap-bare/blob/gh-pages/LICENSE) license.

Copyright (c) 2003-2010 Mark Borgerding

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * Neither the author nor the names of any contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

