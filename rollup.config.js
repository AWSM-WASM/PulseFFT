import { readFileSync } from "fs";
import { resolve } from "path";
import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";
import { minify } from "uglify-es";

const isNode = process.env.TARGET === "node";

const wasmBytes = Array.from(
    readFileSync(resolve(__dirname, "src/WASMkissFFT.wasm"))
);

const output = isNode
    ?   { file: "cjs/WASMkissFFT.js", format: "cjs" }
    :   [
            { file: "esm/WASMkissFFT.js", format: "es" },
            { file: "umd/WASMkissFFT.js", format: "umd", name: "pulse" }
        ];

const replacements = isNode 
    ?   {
        WASM_PRECOMPILED_BYTES: JSON.stringify(wasmBytes),
        // TextEncoder isn't global in Node.
        // Parentheses are required otherwise it thinks the 'new' keyword is applied to
        // the result of TextEncoder("utf-8"), instead of being recognized as a constructor.
        TextEncoder: '(require("util").TextEncoder)'
        }
    :   {
        WASM_PRECOMPILED_BYTES: JSON.stringify(wasmBytes)
        };

export default {
    input: "src/index.js",
    output,
    sourcemap: true,
    plugins: [
        replace(replacements),
        babel({ exclude: "node_modules/**" }),
        nodeResolve({ jsnext: true }),
        uglify({ toplevel: true }, minify)
    ]
};