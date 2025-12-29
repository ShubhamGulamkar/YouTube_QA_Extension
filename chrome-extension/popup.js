document.getElementById("askBtn").addEventListener("click", () => {
    const question = document.getElementById("question").value.trim();
    const answerBox = document.getElementById("answer");

    if (!question) {
        answerBox.innerText = "❌ Please enter a question";
        return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { type: "GET_VIDEO_ID" },
            async (response) => {

                if (chrome.runtime.lastError) {
                    answerBox.innerText = "❌ Content script not found. Reload page.";
                    return;
                }

                if (!response || !response.videoId) {
                    answerBox.innerText = "❌ Open a YouTube video first.";
                    return;
                }

                try {
                    const res = await fetch("http://127.0.0.1:8000/ask", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            video_id: response.videoId,
                            question: question
                        })
                    });

                    const data = await res.json();
                    answerBox.innerText = data.answer || "No answer returned";

                } catch (err) {
                    answerBox.innerText = "❌ Backend not running";
                }
            }
        );
    });
});


// document.getElementById("askBtn").addEventListener("click", async () => {
//     const question = document.getElementById("question").value;

//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(
//             tabs[0].id,
//             { type: "GET_VIDEO_ID" },
//             async (response) => {

//                 if (chrome.runtime.lastError) {
//                     document.getElementById("answer").innerText =
//                         "❌ Open a YouTube video first.";
//                     return;
//                 }

//                 const videoId = response.videoId;

//                 const res = await fetch("http://127.0.0.1:8000/ask", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         video_id: videoId,
//                         question: question
//                     })
//                 });

//                 const data = await res.json();
//                 document.getElementById("answer").innerText = data.answer;
//             }
//         );
//     });
// });


