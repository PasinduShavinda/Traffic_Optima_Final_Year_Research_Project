"""
------------------------------------------------------------------------------
 File: SoundClassifier.py
 Purpose: This file contains a script for classifying siren sounds using a pre-trained CNN model.
 Author: IT20122096
 Date: 2023-10-30
------------------------------------------------------------------------------
"""
import numpy as np
import librosa
from keras.models import load_model


# Function to extract MFCC features from an audio file
def features_extractor(file):
    audio, sample_rate = librosa.load(file, res_type='kaiser_fast')
    mfccs_features = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
    mfccs_scaled_features = np.mean(mfccs_features.T, axis=0)

    return mfccs_scaled_features


# Load the pre-trained CNN model for audio classification
model = load_model(
    '/Users/chamathkavindya/RP_Project_Repo/2023-228/TrafficOptima/Monitoring_System/Server_Application/AI_Models/Emergency_vehicle_prioritization/audio_classification.hdf5')
class_labels = ["air_conditioner", "car_horn", "children_playing", "dog_bark", "drilling", "engine_idling",
                "gun_shot", "jackhammer", "siren", "street_music"]


def classify_siren_sound(file):
    mfccs = features_extractor(file)

    # Reshape the data to match the input shape of the CNN model
    mfccs = mfccs.reshape(1, -1)

    # prediction using the CNN model
    prediction = model.predict(mfccs)

    class_index = np.argmax(prediction)
    # predicted_class = class_labels[class_index]
    return class_index


# Function to run the siren sound classification
def run_classification():
    # path = audio_recorder()
    result = classify_siren_sound("/Users/chamathkavindya/Ev_prioratization/sound/sound_6.wav")
    print(f"{result}")
    if result == 8:
        return True
    else:
        return False
