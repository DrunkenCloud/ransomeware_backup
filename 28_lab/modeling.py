import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
import io
import kagglehub
import os
# Download latest version
path = kagglehub.dataset_download("amdj3dax/ransomware-detection-data-set")
path = os.path.join(path, "data_file.csv")
print("Path to dataset files:", path)


def train_ransomware_model():
    """
    Trains a RandomForestClassifier model for ransomware detection
    and saves the trained model.
    """
    df = pd.read_csv(path)

    # Define features (X) and target (y)
    # 'FileName' and 'md5Hash' are identifiers, not direct features for the model
    X = df.drop(columns=['FileName', 'md5Hash', 'Benign'])
    y = df['Benign']

    # --- Model Training ---
    # Split the data into training and testing sets
    # For a small dataset like this, a test_size of 0.2 is reasonable.
    # random_state ensures reproducibility of the split.
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Training data shape: {X_train.shape}")
    print(f"Testing data shape: {X_test.shape}")

    # Initialize and train a RandomForestClassifier model
    # RandomForest is a good choice for tabular data and handles various feature types well.
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)

    # --- Model Evaluation (Optional but Recommended) ---
    print("\n--- Model Evaluation ---")
    y_pred = model.predict(X_test)
    print("Classification Report:")
    # Note: With only two samples in your example, the classification report
    # will be very basic and might show perfect scores due to simplicity.
    print(classification_report(y_test, y_pred))

    # --- Save the Trained Model ---
    model_filename = 'ransomware_model.joblib'
    joblib.dump(model, model_filename)

    print(f"\nModel successfully trained and saved to {model_filename}")
    print("\nFeatures used for training (ensure your real-time extraction matches this order):")
    print(X.columns.tolist())

if __name__ == "__main__":
    train_ransomware_model()