# Ransomware Analysis and Detection Course Labs

A comprehensive collection of hands-on labs and exercises for learning ransomware analysis, detection, and cybersecurity fundamentals using Python and machine learning techniques.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Labs Overview](#labs-overview)
- [Usage](#usage)
- [Datasets](#datasets)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This repository contains a complete set of labs for learning ransomware analysis and detection, covering:

- **Foundational Python & Cybersecurity Concepts**
- **Static Analysis & Reverse Engineering**
- **Dynamic Analysis & Behavioral Analysis**
- **Machine Learning for Malware Detection**
- **Real-time File Monitoring Systems**

The labs progress from basic Python programming to advanced machine learning models for ransomware detection, providing hands-on experience with real-world cybersecurity challenges.

## 🔧 Prerequisites

Before starting the labs, ensure you have:

- **Python 3.8+** installed
- **Virtual environment** (recommended)
- **Jupyter Notebook** or **JupyterLab**
- **Git** for cloning the repository
- **Basic understanding** of Python programming
- **Virtual Machine software** (VirtualBox/VMware) for isolated analysis

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ransomeware-course-labs
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

   **For VS Code Users - Connect to Virtual Environment Kernel:**
   
   After activating your virtual environment, install ipykernel and register it:
   ```bash
   pip install ipykernel
   python -m ipykernel install --user --name=ransomware-course-labs --display-name="Ransomware Course Labs"
   ```
   
   Then in VS Code:
   1. Open a Jupyter notebook (.ipynb file)
   2. Click on the kernel selector in the top-right corner
   3. Select "Ransomware Course Labs" from the kernel list
   4. If the kernel doesn't appear, restart VS Code and try again

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Launch Jupyter:**
   ```bash
   jupyter notebook
   ```

## 📁 Project Structure

```
ransomeware-course-labs/
├── requirements.txt          # Python dependencies
├── README.md                # This file
├── content.txt              # Course content and lab descriptions
├── *.ipynb                  # Jupyter notebooks for various labs
├── *.py                     # Python scripts
├── *.csv                    # Datasets for analysis
├── 8_lab/                   # C programming and reverse engineering labs
│   ├── bogus.c
│   ├── obf.c
│   └── 1.c
├── 9_lab/                   # CTF challenges and XOR exercises
│   ├── part2.c
│   └── xor_chall.c
├── 12_lab/                  # Additional lab materials
│   ├── a.out
│   └── idk
└── 28_lab/                  # Advanced ransomware detection
    ├── file_monitor.py      # Real-time file monitoring system
    ├── modeling.py          # Machine learning model training
    └── windows_ransomeware.csv
```

## 🧪 Labs Overview
- **Lab 1**: Jupyter & Basic Data Structures
- **Lab 2**: File I/O & Basic Pandas DataFrames
- **Lab 3**: VM Setup & Baselines
- **Lab 4**: Command Line & Network Investigation
- **Lab 5**: Essential Static Analysis Tools
- **Lab 6**: Extracting Strings & Hashes
- **Lab 7**: Exploring PEStudio
- **Lab 8**: Writing & Compiling Simple C Code
- **Lab 9**: Reverse Engineering CTF Challenges

### Key Notebooks:
- **13.ipynb - 28.ipynb**: Progressive labs covering data analysis, machine learning, and ransomware detection
- **28_lab/**: Advanced ransomware detection with real-time monitoring

## 💻 Usage

### Running Jupyter Notebooks
1. Start Jupyter: `jupyter notebook`
2. Navigate to the desired notebook (e.g., `19.ipynb`)
3. Run cells sequentially to follow the lab progression

### Running Python Scripts
```bash
# Basic file operations
python 2.py

# Advanced ransomware detection
cd 28_lab
python modeling.py
python file_monitor.py
```

### C Programming Labs
```bash
cd 8_lab
gcc -o program program.c
./program
```

## 📊 Datasets

The repository includes several datasets for analysis:

- **Android_Ransomeware.csv** (198MB): Android malware dataset
- **Ransomeware_Detection.csv** (7.3MB): Windows ransomware dataset
- **heart_failure_clinical_records_dataset.csv**: Medical data for analysis
- **epileptic_seizure_recognition.csv**: Time series data
- **drebin-215-dataset-5560malware-9476-benign.csv**: Android malware analysis

## 🔍 Key Features

### Machine Learning Models
- **Random Forest Classifiers** for malware detection
- **Neural Networks** using TensorFlow
- **Support Vector Machines** for classification
- **Feature engineering** and data preprocessing

### Analysis Tools
- **PE file analysis** using `pefile`
- **Real-time file monitoring** with `watchdog`
- **String extraction** and hash analysis
- **Static and dynamic analysis** techniques

### Visualization
- **Matplotlib** and **Seaborn** for data visualization
- **Confusion matrices** and classification reports
- **Feature importance** analysis

## ⚠️ Important Notes

### Ethical Considerations
- **Never run malware** on production systems
- **Use isolated VMs** for analysis
- **Follow responsible disclosure** practices
- **Respect legal boundaries** and institutional policies

### Safety Guidelines
- Always use **isolated environments** for malware analysis
- **Never download or distribute** live malware without authorization
- **Document all analysis** activities
- **Proper disposal** of infected VMs and storage media

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is for educational purposes only. Please ensure compliance with your institution's policies and local laws regarding malware analysis and cybersecurity research.

## 📚 Additional Resources

- [PEStudio Documentation](https://www.winitor.com/)
- [Ghidra Reverse Engineering Tool](https://ghidra-sre.org/)
- [Scikit-learn Documentation](https://scikit-learn.org/)
- [TensorFlow Tutorials](https://www.tensorflow.org/tutorials)

## 🆘 Support

For issues or questions:
1. Check the course content in `content.txt`
2. Review the lab descriptions
3. Ensure all dependencies are properly installed
4. Verify your Python environment is correctly configured

---

**Disclaimer**: This course is designed for educational purposes in controlled environments. Always follow ethical guidelines and legal requirements when conducting cybersecurity research. 