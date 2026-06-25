# 🚀 GenomeViz Quick Start Guide

Get started with GenomeViz in 5 minutes!

## Option 1: Quick Demo (No Backend Required)

The easiest way to see GenomeViz in action:

```bash
# Extract the project
tar -xzf GenomeViz-Platform-Complete.tar.gz
cd genome-viz-platform

# Install dependencies
npm install

# Start the application
npm run dev
```

Visit **http://localhost:3000** and click "Get Started" → "Example Data" → "Analyze Sequence"

The demo mode will work immediately without needing the backend!

## Option 2: Full Setup (With Backend)

For complete bioinformatics analysis features:

### Step 1: Frontend Setup
```bash
cd genome-viz-platform
npm install
npm run dev
```

### Step 2: Backend Setup (New Terminal)
```bash
cd genome-viz-platform/backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

### Step 3: Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 📝 Quick Test

1. Open http://localhost:3000
2. Click "Get Started"
3. Click "Example Data" to load sample sequence
4. Click "Analyze Sequence"
5. Explore the visualization, statistics, and ORFs!

## 🎯 Features to Try

### Basic Analysis
- ✅ Paste any DNA sequence (ATCG)
- ✅ View GC content and statistics
- ✅ See base composition
- ✅ Explore ORFs (Open Reading Frames)

### File Upload
- ✅ Drag and drop FASTA files
- ✅ Upload FASTQ files
- ✅ GenBank file support

### Visualizations
- ✅ Linear genome viewer
- ✅ Circular genome map
- ✅ Interactive charts
- ✅ ORF location tracks

### Advanced Features (Backend Required)
- ✅ API integrations (Ensembl, NCBI, UniProt)
- ✅ Gene search
- ✅ Sequence comparison
- ✅ Protein translation
- ✅ Reverse complement

## 🔧 Troubleshooting

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

### Backend won't start
```bash
# Make sure you're in the backend directory
cd backend

# Reinstall Python packages
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start server
python main.py
```

### Port already in use
```bash
# Frontend (change port)
npm run dev -- -p 3001

# Backend (edit main.py, change port 8000 to 8001)
```

## 📱 Demo Mode vs Full Mode

### Demo Mode (Frontend Only)
- ✅ Works immediately
- ✅ Basic sequence analysis
- ✅ GC/AT content calculation
- ✅ Base composition
- ✅ Simple ORF detection
- ❌ No API integrations
- ❌ Limited features

### Full Mode (Frontend + Backend)
- ✅ All demo features
- ✅ BioPython analysis
- ✅ API integrations
- ✅ Advanced ORF detection
- ✅ Protein translation
- ✅ Sequence alignment
- ✅ External database queries

## 🌐 Deployment

### Deploy Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

### Deploy Backend
See README.md for deployment options:
- Railway
- Render
- Heroku
- AWS Lambda

## 📚 Next Steps

1. **Explore Examples**: Try the example BRCA1 sequence
2. **Upload Your Data**: Use your own FASTA/FASTQ files
3. **Read Documentation**: Check README.md for full features
4. **Customize**: Modify the code to suit your needs
5. **Deploy**: Put it online for public access

## 💡 Tips

- Use FASTA format for best results
- Start with small sequences (< 10KB) for testing
- Enable demo mode if backend setup is complex
- Check the API documentation at /docs
- Join our community for help and updates

## 🆘 Need Help?

- Check README.md for detailed documentation
- Review API docs at http://localhost:8000/docs
- Report issues on GitHub
- Email: support@genomeviz.com

---

**Happy Genome Analyzing! 🧬**
