import pandas as pd
import joblib
import pefile
import hashlib
import re
import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# https://github.com/kh4sh3i/Ransomware-Samples
# Load the trained model

def log_event(message):
    print(message)
    with open("detection_logs.txt", "a") as f:
        f.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} - {message}\n")

try:
    model = joblib.load('ransomware_model.joblib')
    print("Ransomware detection model loaded successfully.")
except FileNotFoundError:
    print("Error: ransomware_model.joblib not found. Please ensure the model is trained and saved in the same directory.")
    exit()

# List of features the model was trained on, in the correct order
MODEL_FEATURES = ['Machine', 'DebugSize', 'DebugRVA', 'MajorImageVersion', 'MajorOSVersion', 'ExportRVA', 'ExportSize', 'IatVRA', 'MajorLinkerVersion', 'MinorLinkerVersion', 'NumberOfSections', 'SizeOfStackReserve', 'DllCharacteristics', 'ResourceSize', 'BitcoinAddresses']

def extract_features(file_path):
    """
    Extracts features from a given executable file (DLL/EXE).
    """
    features = {}
    
    try:
        # FileName
        features['FileName'] = os.path.basename(file_path)
        
        # md5Hash
        with open(file_path, "rb") as f:
            file_content = f.read()
            features['md5Hash'] = hashlib.md5(file_content).hexdigest()
        
        pe = pefile.PE(file_path)
        
        # Machine
        features['Machine'] = pe.FILE_HEADER.Machine
        
        # DebugSize and DebugRVA
        debug_dir = pe.OPTIONAL_HEADER.DATA_DIRECTORY[pefile.DIRECTORY_ENTRY['IMAGE_DIRECTORY_ENTRY_DEBUG']]
        features['DebugSize'] = debug_dir.Size
        features['DebugRVA'] = debug_dir.VirtualAddress
        
        # MajorImageVersion
        features['MajorImageVersion'] = pe.OPTIONAL_HEADER.MajorImageVersion
        
        # MajorOSVersion
        features['MajorOSVersion'] = pe.OPTIONAL_HEADER.MajorOperatingSystemVersion
        
        # ExportRVA and ExportSize
        export_dir = pe.OPTIONAL_HEADER.DATA_DIRECTORY[pefile.DIRECTORY_ENTRY['IMAGE_DIRECTORY_ENTRY_EXPORT']]
        features['ExportRVA'] = export_dir.VirtualAddress
        features['ExportSize'] = export_dir.Size
        
        # IatVRA
        iat_dir = pe.OPTIONAL_HEADER.DATA_DIRECTORY[pefile.DIRECTORY_ENTRY['IMAGE_DIRECTORY_ENTRY_IAT']]
        features['IatVRA'] = iat_dir.VirtualAddress
        
        # MajorLinkerVersion and MinorLinkerVersion
        features['MajorLinkerVersion'] = pe.OPTIONAL_HEADER.MajorLinkerVersion
        features['MinorLinkerVersion'] = pe.OPTIONAL_HEADER.MinorLinkerVersion
        
        # NumberOfSections
        features['NumberOfSections'] = pe.FILE_HEADER.NumberOfSections
        
        # SizeOfStackReserve
        features['SizeOfStackReserve'] = pe.OPTIONAL_HEADER.SizeOfStackReserve
        
        # DllCharacteristics
        features['DllCharacteristics'] = pe.OPTIONAL_HEADER.DllCharacteristics
        
        # ResourceSize
        resource_dir = pe.OPTIONAL_HEADER.DATA_DIRECTORY[pefile.DIRECTORY_ENTRY['IMAGE_DIRECTORY_ENTRY_RESOURCE']]
        features['ResourceSize'] = resource_dir.Size
        
        # BitcoinAddresses
        bitcoin_regex = re.compile(r'([13][a-km-zA-HJ-NP-Z1-9]{25,34})')
        # Decode with 'ignore' to handle potential decoding errors
        features['BitcoinAddresses'] = len(bitcoin_regex.findall(file_content.decode('utf-8', errors='ignore')))
       
        return features
    except pefile.PEFormatError as e:
        print(f"Error processing PE file {file_path}: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred while extracting features from {file_path}: {e}")
        return None


class MyEventHandler(FileSystemEventHandler):
    def process_file(self, file_path):
        if os.path.splitext(file_path)[1].lower() in ['.dll', '.exe']:
            log_event(f"Processing file: {file_path}")
            extracted_features = extract_features(file_path)
            if extracted_features:
                features_df = pd.DataFrame([extracted_features])[MODEL_FEATURES]
                try:
                    prediction = model.predict(features_df)
                    if prediction[0] == 1:
                        log_event(f"Prediction for {file_path}: Benign (1)")
                    else:
                        log_event(f"Prediction for {file_path}: Ransomware (0)")
                except Exception as e:
                    print(f"Error during prediction for {file_path}: {e}")

    def on_created(self, event):
        if not event.is_directory:
            self.process_file(event.src_path)

    def on_modified(self, event):
        if not event.is_directory:
            self.process_file(event.src_path)

if __name__ == "__main__":
    path = "."
    event_handler = MyEventHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()