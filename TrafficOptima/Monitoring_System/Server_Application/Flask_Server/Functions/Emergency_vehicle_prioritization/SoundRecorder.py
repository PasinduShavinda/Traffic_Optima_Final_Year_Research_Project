"""
------------------------------------------------------------------------------
 File: SoundRecorder.py
 Purpose: This file contains a script for recording audio and saving it as a WAV file.
 Author: IT20122096
 Date: 2023-10-30
------------------------------------------------------------------------------
"""
import pyaudio
import wave
from datetime import datetime

CHUNK_SIZE = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
RECORD_SECONDS = 2


# Function to record audio and save it as a WAV file
def audio_recorder():
    audio = pyaudio.PyAudio()

    stream = audio.open(format=FORMAT, channels=CHANNELS,
                        rate=RATE, input=True,
                        frames_per_buffer=CHUNK_SIZE)

    print("Recording...")

    frames = []

    for _ in range(0, int(RATE / CHUNK_SIZE * RECORD_SECONDS)):
        data = stream.read(CHUNK_SIZE)
        frames.append(data)

    print("Recording finished.")

    stream.stop_stream()
    stream.close()
    audio.terminate()

    path = "/Users/chamathkavindya/records/"
    filename = "audio-" + datetime.now().strftime("%Y-%m-%d_%H%M%S")

    sound_file = wave.open(path + filename + ".wav", "wb")
    sound_file.setnchannels(1)
    sound_file.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
    sound_file.setframerate(44100)
    sound_file.writeframes(b''.join(frames))
    sound_file.close()

    return path + filename + ".wav"
