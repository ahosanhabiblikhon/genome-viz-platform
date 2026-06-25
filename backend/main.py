"""
Genome Visualization Platform - FastAPI Backend
Main entry point for bioinformatics processing API
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
import asyncio
from pathlib import Path

# Import processing modules
from services.sequence_processor import SequenceProcessor
from services.annotation_service import AnnotationService
from services.visualization_service import VisualizationService
from services.api_integrations import GenomeAPIIntegrator
from services.analysis_service import AnalysisService

# Initialize FastAPI app
app = FastAPI(
    title="Genome Visualization API",
    description="Advanced bioinformatics processing and genome visualization API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
sequence_processor = SequenceProcessor()
annotation_service = AnnotationService()
visualization_service = VisualizationService()
api_integrator = GenomeAPIIntegrator()
analysis_service = AnalysisService()

# Request models
class SequenceInput(BaseModel):
    sequence: str
    sequence_type: str = "dna"  # dna, rna, protein
    name: Optional[str] = "Unnamed Sequence"
    description: Optional[str] = None

class GeneSearchQuery(BaseModel):
    query: str
    search_type: str = "gene_name"  # gene_name, chromosome, position, protein, disease
    organism: str = "human"

class ComparisonRequest(BaseModel):
    sequence1: str
    sequence2: str
    alignment_type: str = "global"  # global, local

# Health check endpoint
@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Genome Visualization API",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": "all operational"}

# Sequence processing endpoints
@app.post("/api/analyze/sequence")
async def analyze_sequence(data: SequenceInput):
    """
    Analyze DNA/RNA sequence and return comprehensive statistics
    """
    try:
        result = await sequence_processor.analyze_sequence(
            sequence=data.sequence,
            sequence_type=data.sequence_type,
            name=data.name
        )
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/fasta")
async def upload_fasta(file: UploadFile = File(...)):
    """
    Upload and process FASTA file
    """
    try:
        content = await file.read()
        result = await sequence_processor.process_fasta(content.decode('utf-8'))
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/fastq")
async def upload_fastq(file: UploadFile = File(...)):
    """
    Upload and process FASTQ file
    """
    try:
        content = await file.read()
        result = await sequence_processor.process_fastq(content.decode('utf-8'))
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/genbank")
async def upload_genbank(file: UploadFile = File(...)):
    """
    Upload and process GenBank file
    """
    try:
        content = await file.read()
        result = await sequence_processor.process_genbank(content.decode('utf-8'))
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Annotation endpoints
@app.post("/api/annotate/sequence")
async def annotate_sequence(data: SequenceInput, background_tasks: BackgroundTasks):
    """
    Annotate sequence using multiple free APIs
    """
    try:
        # Process sequence first
        seq_result = await sequence_processor.analyze_sequence(
            sequence=data.sequence,
            sequence_type=data.sequence_type,
            name=data.name
        )

        # Fetch annotations from multiple sources
        annotations = await api_integrator.fetch_all_annotations(
            sequence=data.sequence,
            sequence_info=seq_result
        )

        return JSONResponse(content={
            "sequence_analysis": seq_result,
            "annotations": annotations
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search/gene")
async def search_gene(query: GeneSearchQuery):
    """
    Search for gene information using multiple databases
    """
    try:
        results = await api_integrator.search_gene(
            query=query.query,
            search_type=query.search_type,
            organism=query.organism
        )
        return JSONResponse(content=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Visualization endpoints
@app.post("/api/visualize/circular")
async def generate_circular_map(data: SequenceInput):
    """
    Generate circular genome map data
    """
    try:
        viz_data = await visualization_service.generate_circular_map(
            sequence=data.sequence,
            name=data.name
        )
        return JSONResponse(content=viz_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/visualize/linear")
async def generate_linear_map(data: SequenceInput):
    """
    Generate linear genome map data
    """
    try:
        viz_data = await visualization_service.generate_linear_map(
            sequence=data.sequence,
            name=data.name
        )
        return JSONResponse(content=viz_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Comparative analysis endpoints
@app.post("/api/compare/sequences")
async def compare_sequences(request: ComparisonRequest):
    """
    Compare two sequences and return alignment
    """
    try:
        comparison = await analysis_service.compare_sequences(
            seq1=request.sequence1,
            seq2=request.sequence2,
            alignment_type=request.alignment_type
        )
        return JSONResponse(content=comparison)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compare/reference")
async def compare_with_reference(data: SequenceInput):
    """
    Compare sequence with human reference genome
    """
    try:
        comparison = await analysis_service.compare_with_reference(
            sequence=data.sequence,
            organism="human"
        )
        return JSONResponse(content=comparison)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Advanced analysis endpoints
@app.post("/api/analysis/orf")
async def find_orfs(data: SequenceInput):
    """
    Find Open Reading Frames in sequence
    """
    try:
        orfs = await analysis_service.find_orfs(data.sequence)
        return JSONResponse(content=orfs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analysis/translate")
async def translate_sequence(data: SequenceInput):
    """
    Translate DNA to protein sequence
    """
    try:
        translation = await analysis_service.translate_dna(data.sequence)
        return JSONResponse(content=translation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analysis/reverse-complement")
async def reverse_complement(data: SequenceInput):
    """
    Generate reverse complement of sequence
    """
    try:
        rev_comp = await analysis_service.reverse_complement(data.sequence)
        return JSONResponse(content=rev_comp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# External API integration endpoints
@app.get("/api/external/ensembl/gene/{gene_id}")
async def get_ensembl_gene(gene_id: str):
    """
    Fetch gene information from Ensembl
    """
    try:
        result = await api_integrator.fetch_ensembl_gene(gene_id)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/external/uniprot/protein/{protein_id}")
async def get_uniprot_protein(protein_id: str):
    """
    Fetch protein information from UniProt
    """
    try:
        result = await api_integrator.fetch_uniprot_protein(protein_id)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/external/ncbi/gene/{gene_id}")
async def get_ncbi_gene(gene_id: str):
    """
    Fetch gene information from NCBI
    """
    try:
        result = await api_integrator.fetch_ncbi_gene(gene_id)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Educational AI assistant endpoint
@app.post("/api/ai/explain")
async def ai_explain(data: Dict[str, Any]):
    """
    Generate AI-powered explanation of genomic data
    """
    try:
        explanation = await analysis_service.generate_explanation(data)
        return JSONResponse(content={"explanation": explanation})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
