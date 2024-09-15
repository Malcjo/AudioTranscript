import sys
import os
from vosk import Model, KaldiRecognizer
import json
import wave

def transcribe_audio(audio_file):
    if not os.path.exists("model"):
        print("Please download the Vosk model and place it in the 'model' directory.")
        exit(1)

    wf = wave.open(audio_file, "rb")
    if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() not in [8000, 16000, 32000, 44100, 48000]:
        print("Audio file must be WAV format mono PCM.")
        exit(1)

    model = Model("model")
    rec = KaldiRecognizer(model, wf.getframerate())

    transcript = ""

    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            result = json.loads(rec.Result())
            transcript += result['text'] + " "

    result = json.loads(rec.FinalResult())
    transcript += result['text']
    return transcript

if __name__ == "__main__":
    audio_file = sys.argv[1]
    transcript = transcribe_audio(audio_file)
    print(transcript)
