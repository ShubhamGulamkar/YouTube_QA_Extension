document.getElementById("askBtn").addEventListener("click", async () => {
    const question = document.getElementById("question").value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { type: "GET_VIDEO_ID" },
            async (response) => {

                if (chrome.runtime.lastError) {
                    document.getElementById("answer").innerText =
                        "❌ Open a YouTube video first.";
                    return;
                }

                const videoId = response.videoId;

                const res = await fetch("http://127.0.0.1:8000/ask", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        video_id: videoId,
                        question: question
                    })
                });

                const data = await res.json();
                document.getElementById("answer").innerText = data.answer;
            }
        );
    });
});


