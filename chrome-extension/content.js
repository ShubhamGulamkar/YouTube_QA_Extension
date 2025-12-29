console.log("✅ content.js loaded");

function getVideoId() {
    const url = window.location.href;

    const params = new URL(url).searchParams.get("v");
    if (params) return params;

    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];

    const embedMatch = url.match(/\/embed\/([^?&]+)/);
    if (embedMatch) return embedMatch[1];

    return null;
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.type === "GET_VIDEO_ID") {
        const videoId = getVideoId();
        console.log("🎯 Video ID:", videoId);
        sendResponse({ videoId });
    }
});


// function getVideoId() {
//   const url = new URL(window.location.href);
//   return url.searchParams.get("v");
// }

// chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
//   if (req.type === "GET_VIDEO_ID") {
//     sendResponse({ videoId: getVideoId() });
//   }
// });
