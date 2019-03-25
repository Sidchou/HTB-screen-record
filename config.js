var config = {};

config.recorder = {
  "id": null,
  "stream": null,
  "engine": null,
  "switch": true,
  "interval": null,
  //stop recording
  "stop": function () {
    console.log("stop recording");
    chrome.browserAction.setIcon({
      "path": {
        "16": "images/idle/icon16.png",
        "48": "images/idle/icon48.png",
        "128": "images/idle/icon128.png"
      }
    });
    config.recorder.engine.stop();
    config.recorder.switch = true;
    if (config.recorder.interval) window.clearInterval(config.recorder.interval);
  },
  //start recording
  "start": function () {
    if (chrome.desktopCapture) {
      //chose target
      chrome.desktopCapture.chooseDesktopMedia(["tab"], null, function (streamId, options) {
        if (navigator.mediaDevices) {
          var audiotrack = "canRequestAudioTrack" in options ? options.canRequestAudioTrack : false;
          navigator.mediaDevices.getUserMedia({
           "audio": false,
           "video": {
             "minFrameRate": 15,
             "mandatory": {
               "chromeMediaSource": 'desktop',
               "chromeMediaSourceId": streamId,
               "maxWidth": window.screen.width,
               "maxHeight": window.screen.height
             }
           }
         }).then(function (e) {
            config.recorder.stream = e;
            config.recorder.engine = new MediaRecorder(config.recorder.stream, {"mimeType": "video/webm"});
            config.recorder.engine.addEventListener("dataavailable", function (e) {
              /* create url */
              var url = URL.createObjectURL(e.data);
              /* formating file */
              // var date = (new Date()).toString().slice(0, 24);
              var date = new Date().toISOString().substr(0, 19);
              // var filename = "ScreenCap-" + date.replace(/ /g, '-').replace(/:/g, '-') + ".webm";
              var filename = "ScreenCap-" + date.replace(/T/g, ' at ').replace(/:/g, '.') + ".webm";
              /* chrome api download */
              chrome.downloads.download({"filename": filename, "url": url}, function (id) {config.recorder.id = id});
              /* audio  */
              // var tracks = config.recorder.stream.getTracks();
              // for (var i = 0; i < tracks.length; i++) tracks[i].stop();
            });
            /*  */
            config.recorder.engine.start();
            if (config.recorder.interval) window.clearInterval(config.recorder.interval);
            config.recorder.interval = window.setInterval(function () {
              if (config.recorder.switch == true){
                chrome.browserAction.setIcon({
                  "path": {
                "16": "images/recording/01/icon16.png",
                "48": "images/recording/01/icon48.png",
                "128": "images/recording/01/icon128.png"
              }
                })
              }else{
                chrome.browserAction.setIcon({
                    "path": {
                      "16": "images/recording/02/icon16.png",
                      "48": "images/recording/02/icon48.png",
                      "128": "images/recording/02/icon128.png"
                    }
                  })
              }
              config.recorder.switch = !config.recorder.switch;
            }, 800);
          }).catch(function (e) {});
        } else console.log("Screen Recorder", "Error! mediaDevices API is not available!");
      });
    } else console.log("Screen Recorder", "Error! desktopCapture API is not available!");
  }
};
