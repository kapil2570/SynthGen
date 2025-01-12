# Synthetic Data Generation using CTGAN

A Flask-based web application for generating realistic synthetic datasets using Conditional Tabular GANs (CTGAN). This project was developed for the PWC Cyber Hackathon 2024: Fiercest Competitor 3.0 to address the challenge of creating privacy-compliant test data for financial institutions.

## 🌟 Features

- Generate synthetic data for two types of datasets:
  - Employee Dataset (personal information)
  - PCI Dataset (payment card information)
- Multiple output formats supported:
  - CSV
  - Excel
  - JSON
  - Doc
- Dynamic data generation (1,000 to 10,000 records)
- Secure user authentication system
- Privacy-compliant synthetic data generation
- Luhn algorithm validation for credit card numbers
- Responsive Vue.js frontend interface

## 🛠️ Technology Stack

### Backend
- Flask - Web framework
- Flask-RESTful - REST API implementation
- SQLAlchemy - Database ORM
- Flask-Security - Authentication and authorization
- SDV (Synthetic Data Vault) - Synthetic data generation
- CTGAN - Deep learning model for synthetic data

### Frontend
- Vue.js 2.7
- Vue Router
- Bootstrap 5
- Custom CSS

### Database
- SQLite
- Redis (for caching)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/SaiSatya16/Synthetic-Data-Generation-using-CTGAN
cd Synthetic-Data-Generation-using-CTGAN
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Initialize the database:
```bash
python upload_initial_data.py
```

5. Run the application:
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 💻 Usage

1. Log in to the application using your credentials
2. Select the dataset type (Employee or PCI)
3. Choose the desired output format
4. Specify the number of records (1,000-10,000)
5. Click "Generate and Download Data"

## 📁 Project Structure

```bash
synthetic-data-generator/
├── app.py                 # Main application file
├── api.py                 # API endpoints and data generation logic
├── config.py             # Configuration settings
├── model.py              # Database models
├── sec.py                # Security configurations
├── static/               # Static files
│   ├── style.css
│   └── vue/             # Vue.js components
├── templates/            # HTML templates
│   └── index.html
└── content/             # Data storage
```

## 🔒 Security Features

- Token-based authentication
- Password hashing
- Role-based access control
- Session management
- CSRF protection
- Inactivity timeout (30 minutes)

## ⚙️ Data Generation Details

### Employee Dataset Fields
- Name
- User ID
- Email
- SSN
- Blood group
- Gender
- Address
- Date of birth
- U.S. Driver License Number

### PCI Dataset Fields
- Card holder name
- Security code/CVV
- Expiration date
- Credit Card number
- Card provider

## Overview
This project utilizes two advanced approaches for synthetic data generation:
1. CTGAN (Conditional Tabular GAN) for single-table synthesis
2. HMA (Hierarchical Multi-Agent) Synthesizer for initial data generation

## Architecture

### Data Generation Pipeline
```bash
Raw Data Sample → HMA Synthesizer → Initial Synthetic Data → CTGAN → Final Synthetic Data
```

## Components Breakdown

### 1. HMA Synthesizer Implementation
```bash
synthesizer = HMASynthesizer(metadata)
synthesizer.fit(data)
synthetic_data = synthesizer.sample(scale=1)
```
The HMA Synthesizer:
- Creates hierarchical relationships between different data fields
- Maintains statistical properties of the original data
- Preserves complex relationships between columns

### 2. CTGAN (Conditional Tabular GAN)
```bash
synthesizer = CTGANSynthesizer(metadata, epochs=70)
synthesizer.fit(synthetic_data)
synthetic_data = synthesizer.sample(num_rows=num_rows)
```

CTGAN key features:
- Uses conditional vectors to handle discrete columns
- Employs mode-specific normalization for continuous columns
- Trains for 70 epochs to ensure data quality
- Generates high-quality synthetic data that preserves relationships and patterns

## Metadata Configuration

For Employee Dataset:
```bash
metadata.update_column(
    table_name='data-bMNd0cfWfQLiuieC0Y0FN',
    column_name='name',
    sdtype='name'
)
metadata.update_column(
    table_name='data-bMNd0cfWfQLiuieC0Y0FN',
    column_name='License',
    sdtype='license_plate'
)
metadata.update_column(
    table_name='data-bMNd0cfWfQLiuieC0Y0FN',
    column_name='address',
    sdtype='address',
    pii=True
)
```

For PCI Dataset:
```bash
metadata.update_column(
    table_name='findata',
    column_name='card_holder_name',
    sdtype='name'
)
metadata.update_column(
    table_name='findata',
    column_name='expiration_date',
    sdtype='date'
)
```

## Data Validation and Quality Assurance

### 1. Metadata Validation
```bash
metadata.validate()
metadata.validate_data(data=data)
```

### 2. Credit Card Number Validation (Luhn Algorithm)
```bash
def luhn_checksum(card_number):
    def digits_of(n):
        return [int(d) for d in str(n)]
    digits = digits_of(card_number)
    odd_digits = digits[-1::-2]
    even_digits = digits[-2::-2]
    checksum = 0
    checksum += sum(odd_digits)
    for d in even_digits:
        checksum += sum(digits_of(d*2))
    return checksum % 10
```

## Data Types and Constraints

### Employee Dataset Fields
- Name: Synthetic personal names
- License: Valid format license plates
- Address: PII-protected addresses
- Date of Birth: Valid dates within reasonable range
- SSN: Properly formatted synthetic SSNs
- Email: Valid email format
- Blood Group: Standard blood group types
- Gender: Balanced distribution

### PCI Dataset Fields
- Card Holder Name: Synthetic names
- Expiration Date: Valid future dates
- Credit Card Numbers: Luhn algorithm validated
- CVV: 3-4 digit secure codes
- Card Provider: Major card providers

## Privacy and Security Measures

1. **Data Anonymization**
   - PII fields are marked and specially handled
   - No real data is used or exposed
   - Generated data cannot be traced back to real individuals

2. **Compliance**
   - Generated data adheres to financial industry standards
   - Credit card numbers pass Luhn algorithm validation
   - Date formats follow standard conventions

## Usage Examples

### 1. Generating Employee Data
```bash
def generate_employee(num_rows):
    data = load_csvs(folder_name='content/')
    metadata = Metadata.detect_from_dataframes(data)
    # Configure metadata...
    synthesizer = CTGANSynthesizer(metadata, epochs=70)
    synthesizer.fit(synthetic_data['data-bMNd0cfWfQLiuieC0Y0FN'])
    synthetic_data = synthesizer.sample(num_rows=num_rows)
    return synthetic_data
```

### 2. Generating PCI Data
```bash
def generate_pci(num_rows):
    data = load_csvs(folder_name='content2/')
    metadata = Metadata.detect_from_dataframes(data)
    # Configure metadata...
    synthesizer = CTGANSynthesizer(metadata, epochs=70)
    synthesizer.fit(synthetic_data['findata'])
    synthetic_data = synthesizer.sample(num_rows=num_rows)
    return synthetic_data
```

## Output Formats

The system supports multiple output formats:
1. CSV: Direct tabular format
2. Excel: Formatted spreadsheet
3. JSON: Structured data format
4. Doc: Word document with formatted table

## Best Practices

1. **Data Quality**
   - Always validate metadata before generation
   - Check statistical distributions of generated data
   - Verify relationships between columns

2. **Performance**
   - Use appropriate batch sizes for generation
   - Cache frequently used metadata
   - Monitor memory usage for large datasets

3. **Security**
   - Regularly update validation rules
   - Monitor for potential data leakage
   - Maintain proper access controls

## Limitations and Considerations

1. **Generation Limits**
   - Minimum: 1,000 records
   - Maximum: 10,000 records per request
   - Consider memory constraints

2. **Quality Trade-offs**
   - Higher epochs = better quality but slower generation
   - Complex relationships may require additional validation
   - Some rare combinations might be under-represented

3. **Performance Considerations**
   - Large datasets may require batch processing
   - Complex metadata increases generation time
   - Consider caching for frequently used configurations


## 🏆 Acknowledgments

This project was developed as part of the PWC Cyber Hackathon 2024: Fiercest Competitor 3.0 challenge.