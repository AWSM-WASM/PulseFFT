module.exports = grunt => {
    grunt.initConfig({
        concat: {
            options: {
                sourceMap: true
            },
            "js": {
                src: ["dev/js/*.js"],
                dest: "dist/app.concat.js"
            },
        },

        uglify: {
            my_target: {
                options: {
                    sourceMap: false,
                    mangle: false,
                },
                files: {
                    "dist/app.min.js" : ["dist/app.concat.js"],
                    "dist/appWASM.js" : ["dist/appWASM.js"]
                }
            }
        },

        exec: {
            build: "C:/emsdk/emsdk_env.bat & echo Building... & emcc -o ./dist/appWASM.js ./dev/cpp/emscripten.cpp -O3 -s ALLOW_MEMORY_GROWTH=1 -s WASM=1 -s NO_EXIT_RUNTIME=1 -std=c++1z"
        },

        watch: {
            cpp: {
                files: ["dev/cpp/*.cpp", "dev/cpp/*.h"],
                tasks: ["exec:build", "uglify"]
            },
            js: {
                files: ["dev/js/*.js"],
                tasks: ["concat", "uglify"]
            }
        }
    })

    grunt.loadNpmTasks("grunt-contrib-watch")
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks("grunt-exec")

    grunt.registerTask("default", ["watch"])
}