let mypulse;
loadPulse()
    .then(module => {
        mypulse = module;
    }).catch(err => {
        console.log("Error in loading module: ", err);
    });


    function testWASMmic (size, freqData) {
        var magnitudes = new Float32Array((size / 2) + 1);
        var fft = new mypulse.fftReal(size);

        var ri = freqData;
        var out = fft.forward(ri);

        for (var j = 0; j <= size/2; ++j) {
          magnitudes[j] = Math.sqrt(out[j*2] * out[j*2] + out[j*2+1] * out[j*2+1]);
        }

        fft.dispose();
        return magnitudes;
      }



      var webaudio_tooling_obj = function () {
        var frequencyData = new Float32Array(1025);
        var svgHeight = '600';
        var svgWidth = '1200';
        var barPadding = '1';

        function createSvg(parent, height, width) {
          return d3.select(parent).append('svg').attr('height', height).attr('width', width);
        }
        var svg = createSvg('#graph', svgHeight, svgWidth);

        // Set up initial D3 chart.
        svg.selectAll('rect')
        .data(frequencyData)
        .enter()
        .append('rect')
        .attr('x', function (d, i) {
          return i * (svgWidth / frequencyData.length);
        })
        .attr('width', svgWidth / frequencyData.length);



        var audioContext = new AudioContext(),
            microphone_stream = null,
            script_processor_node = null;


        if (!navigator.getUserMedia)
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.getUserMedia){
            navigator.getUserMedia({audio:true},
              function(stream) {
                  start_microphone(stream);
              },
              function(e) {
                console.log('Error capturing audio: ', e);
              }
            );
        } else { alert('getUserMedia not supported in this browser.'); }




        function start_microphone(stream){
          microphone_stream = audioContext.createMediaStreamSource(stream);
          script_processor_node = audioContext.createScriptProcessor(2048, 1, 1);

          microphone_stream.connect(script_processor_node);
          script_processor_node.connect(audioContext.destination);

          script_processor_node.onaudioprocess = process_microphone_buffer;


          function process_microphone_buffer(event) {
              var microphone_input_buffer = event.inputBuffer.getChannelData(0);

              function hanningWindow(inputBuffer) {
                for (var i = 1; i < inputBuffer.length; i += 1) {
                  inputBuffer[i] *= 0.54 - ((0.46) * (Math.cos((2 * Math.PI * i)/(microphone_input_buffer.length - 1))))
                }
                return inputBuffer;
              }

              var windowedInput = hanningWindow(microphone_input_buffer);
              frequencyData = testWASMmic(windowedInput.length, windowedInput);
          }

          function renderChart() {
            requestAnimationFrame(renderChart);
            svg.selectAll('rect')
            .data(frequencyData)
            .attr('y', function(d) {
              return .5 *(svgHeight - (d * 25));
            })
            .attr('height', function(d) {
              return d * 25;
            })
            .attr('fill', function(d) {
              return '#adc5ff';
            });
          }
          renderChart();
        }
      }();
