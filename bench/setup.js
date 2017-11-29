const { readFileSync } = require("fs");
const { resolve } = require("path");
const { TextEncoder } = require("util");

const wasmBytes = readFileSync(resolve(_dirname, "../src/WASMkissFFT.wasm"));

global.WASM_PRECOMPILED_BYTES = Array.from(wasmBytes);

// TextEncoder is not a global in Node.
global.TextEncoder = TextEncoder;