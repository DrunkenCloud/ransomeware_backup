from flask import Flask, render_template, request, redirect, url_for
import os
import pandas as pd
import joblib
import pefile
import hashlib
import re
import uuid

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'.exe', '.dll'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

model = joblib.load('ransomware_model.joblib')

MODEL_FEATURES = [
    'Machine', 'DebugSize', 'DebugRVA', 'MajorImageVersion', 'MajorOSVersion',
    'ExportRVA', 'ExportSize', 'IatVRA', 'MajorLinkerVersion', 'MinorLinkerVersion',
    'NumberOfSections', 'SizeOfStackReserve', 'DllCharacteristics', 'ResourceSize',
    'BitcoinAddresses'
]


def allowed_file(filename):
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS

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

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return render_template('index.html', error="No file part.", features=[])

        file = request.files['file']
        if file.filename == '':
            return render_template('index.html', error="No selected file.", features=[])

        if file and allowed_file(file.filename):
            filename = f"{uuid.uuid4().hex}_{file.filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            features = extract_features(filepath)
            if features:
                try:
                    df = pd.DataFrame([features])[MODEL_FEATURES]
                    prediction = model.predict(df)[0]
                    label = "Benign ✅" if prediction == 1 else "Ransomware ❌"
                except Exception as e:
                    label = f"Prediction Error: {str(e)}"
            else:
                label = "Feature Extraction Failed"
                features = {}

            os.remove(filepath)  # Optional cleanup
            return render_template('index.html', result=label, features=features)

        return render_template('index.html', error="Invalid file type.", features=[])
    
    return render_template('index.html', features=[])

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=5005)
