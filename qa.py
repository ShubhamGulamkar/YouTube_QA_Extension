from youtube_transcript_api import (
    YouTubeTranscriptApi,
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable
)
from youtube_transcript_api.formatters import TextFormatter
import re


def get_transcript(video_id: str) -> str | None:
    """
    Fetch transcript and return plain text.
    Returns None if transcript is unavailable.
    """
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        formatter = TextFormatter()
        return formatter.format_transcript(transcript_list)

    except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable):
        return None
    except Exception:
        return None


def answer_question(transcript: str | None, question: str) -> str:
    """
    Keyword-based sentence retrieval from transcript.
    """

    if not transcript:
        return (
            "❌ Transcript is not available for this video.\n\n"
            "This usually happens when captions are auto-generated or disabled."
        )

    # Normalize
    transcript = transcript.lower()
    question = question.lower()

    # Extract keywords from question
    keywords = re.findall(r"\b[a-z]{4,}\b", question)

    sentences = re.split(r"[.?!]", transcript)

    best_sentence = ""
    max_matches = 0

    for sentence in sentences:
        matches = sum(1 for word in keywords if word in sentence)
        if matches > max_matches:
            max_matches = matches
            best_sentence = sentence

    if best_sentence:
        return best_sentence.strip().capitalize()

    return (
        "⚠️ I could not find an exact answer in the transcript, "
        "but the video may explain it indirectly."
    )


