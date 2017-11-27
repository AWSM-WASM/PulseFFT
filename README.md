WebAssembly workflow
=
[![Build Status](https://travis-ci.org/DanRuta/webassembly-workflow.svg?branch=master)](https://travis-ci.org/DanRuta/webassembly-workflow) JS: [![Coverage Status](https://coveralls.io/repos/github/DanRuta/webassembly-workflow/badge.svg?branch=master)](https://coveralls.io/github/DanRuta/webassembly-workflow?branch=master) C++ [![codecov](https://codecov.io/gh/DanRuta/webassembly-workflow/branch/master/graph/badge.svg)](https://codecov.io/gh/DanRuta/webassembly-workflow)
---

This is a project shell to use for starting new WebAssembly projects. The workflow has been configured with task runners for packaging JavaScript files, to compile C++ with emscripten, and to minify both.

# Read more
Medium article with set-up instructions, and some suggestions for alternatives:

https://medium.com/@DanRuta/setting-up-the-ultimate-webassembly-c-workflow-6484efa3e162


JavaScript unit tests were set up with Mocha+Chai, and with sinon (and sinon-chai) for mocking. C++ unit testss were set up with google test, with the included google mock for mocking.

Travis was configured for CI, and test coverage is reported to Coveralls for JavaScript and to Codecov for C++.


# Setting it all up

Make sure to clone the repo recursively, in order to get the Google Test framework.

```
git clone --recursive https://github.com/DanRuta/webassembly-workflow.git
```

When finished, run ```npm run build```. This will build the project into a build folder, and it will also install all the npm dependencies.

**Make sure to run this through MinGW if using Windows**

# Developing

Run grunt in a separate terminal (can be cmd in Windows, doesn't matter). When you save a JavaScript dev file, all files will be merged and minified. When you save a C++ dev file, they will be compiled to WebAssembly using emscripten.

I've included some sample code as a tiny app that serves to show how it all gets built.

To get WebAssembly to run in the browser, you must serve it via a server. Just run ```node server``` to use the included one and go to localhost:1337 in the browser. I've also included a tiny node-demo.js file to show how WebAssembly might be loaded into a nodejs environment.

**Make sure to install emscripten first, at "C:/emsdk". If you've installed it elsewhere, or have installed it globally, just change the path in the gruntfile.**

# Contribuiting

I've tried to make this as easy as possible to use, with as little set up as possible, while keeping it Windows friendly. If there are ways to improve it, or if there are really useful things that can be added, I'd be glad to accept feedback and / or pull requests.

One thing I was not able to get done in the time I had for this, but would be awesome to have, was seeing the C++ test coverage while developing (It can only be seen on codecov), due to how messy it was to set up gcov/lcov on Windows.