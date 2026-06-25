# 🧬 GenomeViz - Advanced Genome Visualization Platform

A production-ready, modern, AI-powered genome visualization web application that allows users to upload or paste their DNA/genome sequences and explore them through beautiful, interactive visualizations.

## ✨ Features

### 🔬 Core Functionality
- **Sequence Analysis**: Comprehensive DNA/RNA/protein sequence analysis
- **Interactive Visualizations**: Beautiful circular and linear genome maps
- **Gene Annotation**: Integration with free bioinformatics APIs (UCSC, Ensembl, NCBI, MyGene.info, UniProt)
- **Comparative Analysis**: Compare sequences and identify mutations, SNPs, indels
- **Educational AI Assistant**: Get simple explanations of complex genomic concepts
- **Multiple Format Support**: FASTA, FASTQ, GenBank, GFF, GTF

### 📊 Analysis Capabilities
- GC Content calculation
- AT Content analysis
- Base composition
- Nucleotide frequency
- Molecular statistics
- Open Reading Frame (ORF) detection
- DNA to Protein translation
- Reverse complement generation
- Codon usage analysis

### 🎨 Visualization Features
- Circular Genome Maps
- Linear Chromosome Viewer
- Zoom/Pan navigation
- Interactive tooltips
- Animated transitions
- Color-coded features
- Responsive design
- Dark/Light mode support

### 🔍 Search & Discovery
- Gene search across databases
- Protein lookup
- Disease associations
- Pathway information
- GO Terms
- Clinical variants (ClinVar)

### 💾 Export Options
- PDF Reports
- CSV Data tables
- PNG Images
- SVG Vector graphics
- Excel spreadsheets
- JSON format

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: D3.js, Plotly.js
- **3D**: Three.js
- **State Management**: Zustand
- **File Upload**: React Dropzone

### Backend
- **Framework**: FastAPI (Python)
- **Bioinformatics**: BioPython
- **Data Processing**: Pandas, NumPy
- **APIs**: HTTPX for async requests

### APIs Integrated
- ✅ Ensembl REST API
- ✅ NCBI E-utilities
- ✅ MyGene.info API
- ✅ UniProt REST API
- ✅ UCSC Genome Browser API
- ✅ QuickGO (Gene Ontology)
- ✅ STRING Database
- ✅ Reactome
- ✅ ClinVar

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Git

### Frontend Setup

```bash
# Clone the repository
git clone <repository-url>
cd genome-viz-platform

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI server
python main.py
```

The backend API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## 🏗️ Project Structure

```
genome-viz-platform/
├── app/
│   ├── components/        # React components
│   │   ├── Hero.tsx
│   │   ├── SequenceInput.tsx
│   │   ├── GenomeVisualization.tsx
│   │   └── StatisticsPanel.tsx
│   ├── analysis/         # Analysis page
│   ├── dashboard/        # Dashboard page
│   ├── lib/             # Utilities
│   └── page.tsx         # Home page
├── backend/
│   ├── services/        # Backend services
│   │   ├── sequence_processor.py
│   │   ├── api_integrations.py
│   │   ├── visualization_service.py
│   │   ├── analysis_service.py
│   │   └── annotation_service.py
│   ├── main.py         # FastAPI app
│   └── requirements.txt
├── public/             # Static assets
└── package.json
```

## 🎯 Usage

### 1. Upload or Paste Sequence

- Click "Get Started" on the home page
- Choose input method:
  - **Paste**: Directly paste DNA/RNA sequence
  - **Upload**: Upload FASTA, FASTQ, or GenBank file
  - **Example**: Load example BRCA1 gene fragment

### 2. Analyze Sequence

- Enter sequence name (optional)
- Select sequence type (DNA, RNA, or Protein)
- Click "Analyze Sequence"

### 3. Explore Results

Navigate through tabs:
- **Overview**: Summary statistics and composition
- **Visualization**: Interactive genome maps
- **Statistics**: Detailed statistical analysis
- **ORFs**: Open Reading Frames detected
- **Export**: Download results in various formats

## 🔧 API Endpoints

### Sequence Analysis
```
POST /api/analyze/sequence
Body: { sequence, sequence_type, name }
```

### File Upload
```
POST /api/upload/fasta
POST /api/upload/fastq
POST /api/upload/genbank
```

### Annotation
```
POST /api/annotate/sequence
POST /api/search/gene
```

### Visualization
```
POST /api/visualize/circular
POST /api/visualize/linear
```

### Analysis
```
POST /api/compare/sequences
POST /api/analysis/orf
POST /api/analysis/translate
POST /api/analysis/reverse-complement
```

### External APIs
```
GET /api/external/ensembl/gene/{gene_id}
GET /api/external/uniprot/protein/{protein_id}
GET /api/external/ncbi/gene/{gene_id}
```

## 🌐 Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Backend Deployment

The FastAPI backend can be deployed to:
- Railway
- Render
- Heroku
- AWS Lambda
- Google Cloud Run

Example for Railway:
```bash
railway login
railway init
railway up
```

## 🧪 Example Sequences

### Human BRCA1 Fragment (DNA)
```
>BRCA1 Gene Fragment
ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCT
```

### E. coli lacZ Gene (DNA)
```
>lacZ Beta-Galactosidase
ATGACCATGATTACGAATTCGAGCTCGGTACCCGGGGATCCTCTAGAGTCGAC
```

## 📚 Educational Features

- **AI Explanations**: Simple explanations of complex concepts
- **Interactive Learning**: Explore genome features interactively
- **Real-time Analysis**: See results as you type
- **Contextual Help**: Tooltips and information throughout
- **Research Links**: Direct links to relevant publications

## 🎨 UI/UX Design

The design combines:
- **Modern**: Glassmorphism, gradients, animations
- **Scientific**: Inspired by Benchling, UCSC Genome Browser, Ensembl
- **Professional**: Clean, organized, data-focused
- **Accessible**: WCAG compliant, keyboard navigation
- **Responsive**: Mobile-first design

## 🔐 Security & Privacy

- All sequence analysis happens in isolated environments
- No data is stored without user consent
- API requests use secure HTTPS
- Rate limiting on external API calls
- Input validation and sanitization

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Email: support@genomeviz.com

## 🙏 Acknowledgments

- BioPython community
- Ensembl, NCBI, UniProt for free APIs
- Next.js and FastAPI teams
- All open-source contributors

## 🚦 Status

- ✅ Core sequence analysis
- ✅ Interactive visualizations
- ✅ API integrations
- ✅ Export functionality
- 🚧 Authentication (in progress)
- 🚧 Database integration (planned)
- 🚧 Collaborative features (planned)

## 📈 Roadmap

- [ ] User authentication
- [ ] Save analysis history
- [ ] Share analysis via URL
- [ ] BLAST integration
- [ ] Protein structure visualization
- [ ] Phylogenetic tree builder
- [ ] Multi-language support
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Advanced filtering

---

**Built with ❤️ for the bioinformatics community**

🧬 GenomeViz - Visualize Your Genome Story
