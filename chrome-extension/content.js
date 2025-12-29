function getVideoId() {
  const url = new URL(window.location.href);
  return url.searchParams.get("v");
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_VIDEO_ID") {
    sendResponse({ videoId: getVideoId() });
  }
});
