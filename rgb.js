(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let getdocButton = document.querySelector("#getdoc");
    let statusDisplay = document.querySelector('#status');
    let redSlider = document.querySelector('#red');
    let greenSlider = document.querySelector('#green');
    let blueSlider = document.querySelector('#blue');
    let ztdoc = document.querySelector('#ZTDoc');
    let port;

    getdocButton.textContent = '3';

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = '';
        connectButton.textContent = 'Disconnect';
        ztdoc.innerHTML = '';
        
        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          let str = String.fromCharCode.apply(null, new Uint16Array(data));
          ztdoc.insertAdjacentHTML('afterend', str);
          //ztdoc.insertAdjacentHTML('afterend',textDecoder.decode(data));
          //ztdoc.innerHTML += textDecoder.decode(data);
          console.log(textDecoder.decode(data));
        }
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        statusDisplay.textContent = error;
      });
    }

    function onUpdate() {
      if (!port) {
        return;
      }

/*
      let view = new Uint8Array(3);
      view[0] = parseInt(redSlider.value);
      view[1] = parseInt(greenSlider.value);
      view[2] = parseInt(blueSlider.value);
      port.send(view);
      var str = "Google";
      let buffer = new ArrayBuffer(1);
      let view = new Uint8Array(buffer);
      view[0] = str.charCodeAt(0);
      // new DataView(buffer).setUint8(0, 'G', true;
      port.send(buffer);
      */
    };

    redSlider.addEventListener('input', onUpdate);
    greenSlider.addEventListener('input', onUpdate);
    blueSlider.addEventListener('input', onUpdate);

    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = '';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
        }).catch(error => {
          statusDisplay.textContent = error;
        });
      }
    });
    
    getdocButton.addEventListener('click', function() {
      getdocButton.textContent = 'working';
      var str = "Google";
      let buffer = new ArrayBuffer(1);
      let view = new Uint8Array(buffer);
      view[0] = str.charCodeAt(0);
      port.send(buffer);
    });

    serial.getPorts().then(ports => {
      if (ports.length == 0) {
        statusDisplay.textContent = 'No device found.';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    });
  });
})();
