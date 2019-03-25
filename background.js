//start/stop recording
chrome.browserAction.onClicked.addListener(function() {
  var recording = config.recorder.engine && config.recorder.engine.state !== "inactive";
  recording ? config.recorder.stop() : config.recorder.start();
});
//download
chrome.downloads.onChanged.addListener(function(e) {
  if (e.id === config.recorder.id) {
    chrome.downloads.search({
      "id": e.id
    }, function(arr) {
      if (arr[0].state === "complete") {
        console.log("Screen Recorder", "Recorded video is downloaded to: \n\n" + arr[0].filename);
      }
    });
  }
});
