"""
Sequence Processing Service
Handles DNA/RNA sequence analysis, statistics, and file format parsing
"""

from Bio import SeqIO, Seq, SeqUtils
from Bio.SeqUtils import molecular_weight, MeltingTemp as mt
from io import StringIO
import re
from typing import Dict, List, Any, Optional
import hashlib


class SequenceProcessor:
    """
    Processes and analyzes DNA/RNA/Protein sequences
    """

    def __init__(self):
        self.supported_formats = ['fasta', 'fastq', 'genbank', 'gff', 'gtf']

    async def analyze_sequence(self, sequence: str, sequence_type: str = "dna", name: str = "Unnamed") -> Dict[str, Any]:
        """
        Comprehensive sequence analysis
        """
        # Clean sequence
        sequence = self._clean_sequence(sequence, sequence_type)

        if not sequence:
            raise ValueError("Invalid or empty sequence")

        # Calculate basic statistics
        stats = self._calculate_statistics(sequence, sequence_type)

        # Calculate composition
        composition = self._calculate_composition(sequence, sequence_type)

        # Calculate GC content for DNA/RNA
        gc_content = None
        if sequence_type in ["dna", "rna"]:
            gc_content = self._calculate_gc_content(sequence)

        # Find ORFs for DNA
        orfs = []
        if sequence_type == "dna" and len(sequence) >= 300:
            orfs = self._find_simple_orfs(sequence)

        # Calculate molecular weight
        mol_weight = self._calculate_molecular_weight(sequence, sequence_type)

        # Generate sequence hash for identification
        seq_hash = hashlib.md5(sequence.encode()).hexdigest()

        return {
            "success": True,
            "name": name,
            "sequence_type": sequence_type,
            "sequence_hash": seq_hash,
            "length": len(sequence),
            "statistics": stats,
            "composition": composition,
            "gc_content": gc_content,
            "molecular_weight": mol_weight,
            "orfs_found": len(orfs),
            "orf_details": orfs[:10] if orfs else [],  # Limit to first 10
            "sequence_preview": sequence[:100] + ("..." if len(sequence) > 100 else ""),
            "full_sequence": sequence if len(sequence) < 10000 else None  # Only include if small
        }

    async def process_fasta(self, content: str) -> Dict[str, Any]:
        """
        Process FASTA format file
        """
        try:
            fasta_io = StringIO(content)
            sequences = list(SeqIO.parse(fasta_io, "fasta"))

            if not sequences:
                raise ValueError("No valid FASTA sequences found")

            results = []
            for record in sequences[:10]:  # Process first 10 sequences
                analysis = await self.analyze_sequence(
                    sequence=str(record.seq),
                    sequence_type="dna",
                    name=record.id
                )
                results.append(analysis)

            return {
                "success": True,
                "format": "fasta",
                "sequences_found": len(sequences),
                "sequences_processed": len(results),
                "results": results
            }

        except Exception as e:
            raise ValueError(f"Error processing FASTA file: {str(e)}")

    async def process_fastq(self, content: str) -> Dict[str, Any]:
        """
        Process FASTQ format file (with quality scores)
        """
        try:
            fastq_io = StringIO(content)
            sequences = list(SeqIO.parse(fastq_io, "fastq"))

            if not sequences:
                raise ValueError("No valid FASTQ sequences found")

            results = []
            quality_stats = []

            for record in sequences[:10]:  # Process first 10
                analysis = await self.analyze_sequence(
                    sequence=str(record.seq),
                    sequence_type="dna",
                    name=record.id
                )

                # Add quality score statistics
                if hasattr(record, 'letter_annotations') and 'phred_quality' in record.letter_annotations:
                    qualities = record.letter_annotations['phred_quality']
                    quality_stats.append({
                        "mean_quality": sum(qualities) / len(qualities),
                        "min_quality": min(qualities),
                        "max_quality": max(qualities)
                    })

                results.append(analysis)

            return {
                "success": True,
                "format": "fastq",
                "sequences_found": len(sequences),
                "sequences_processed": len(results),
                "quality_scores_available": len(quality_stats) > 0,
                "quality_statistics": quality_stats,
                "results": results
            }

        except Exception as e:
            raise ValueError(f"Error processing FASTQ file: {str(e)}")

    async def process_genbank(self, content: str) -> Dict[str, Any]:
        """
        Process GenBank format file
        """
        try:
            gb_io = StringIO(content)
            records = list(SeqIO.parse(gb_io, "genbank"))

            if not records:
                raise ValueError("No valid GenBank records found")

            results = []
            for record in records[:5]:  # Process first 5
                # Extract features
                features = []
                for feature in record.features:
                    features.append({
                        "type": feature.type,
                        "location": str(feature.location),
                        "qualifiers": {k: v for k, v in feature.qualifiers.items()}
                    })

                analysis = await self.analyze_sequence(
                    sequence=str(record.seq),
                    sequence_type="dna",
                    name=record.id
                )

                analysis["features"] = features
                analysis["annotations"] = record.annotations
                results.append(analysis)

            return {
                "success": True,
                "format": "genbank",
                "records_found": len(records),
                "records_processed": len(results),
                "results": results
            }

        except Exception as e:
            raise ValueError(f"Error processing GenBank file: {str(e)}")

    def _clean_sequence(self, sequence: str, sequence_type: str) -> str:
        """
        Clean and validate sequence
        """
        # Remove whitespace and common characters
        sequence = re.sub(r'[\s\n\r\t\d>]', '', sequence).upper()

        # Validate based on type
        if sequence_type == "dna":
            sequence = re.sub(r'[^ATCGN]', '', sequence)
        elif sequence_type == "rna":
            sequence = re.sub(r'[^AUCGN]', '', sequence)
        elif sequence_type == "protein":
            sequence = re.sub(r'[^ACDEFGHIKLMNPQRSTVWY*]', '', sequence)

        return sequence

    def _calculate_statistics(self, sequence: str, sequence_type: str) -> Dict[str, Any]:
        """
        Calculate basic sequence statistics
        """
        return {
            "length": len(sequence),
            "unique_bases": len(set(sequence)),
            "type": sequence_type
        }

    def _calculate_composition(self, sequence: str, sequence_type: str) -> Dict[str, Any]:
        """
        Calculate nucleotide/amino acid composition
        """
        composition = {}
        length = len(sequence)

        for base in set(sequence):
            count = sequence.count(base)
            composition[base] = {
                "count": count,
                "percentage": round((count / length) * 100, 2)
            }

        return composition

    def _calculate_gc_content(self, sequence: str) -> Dict[str, float]:
        """
        Calculate GC content for DNA/RNA
        """
        g_count = sequence.count('G')
        c_count = sequence.count('C')
        total = len(sequence)

        gc_count = g_count + c_count
        gc_percentage = (gc_count / total) * 100 if total > 0 else 0

        at_count = total - gc_count
        at_percentage = (at_count / total) * 100 if total > 0 else 0

        return {
            "gc_count": gc_count,
            "gc_percentage": round(gc_percentage, 2),
            "at_count": at_count,
            "at_percentage": round(at_percentage, 2),
            "g_count": g_count,
            "c_count": c_count
        }

    def _calculate_molecular_weight(self, sequence: str, sequence_type: str) -> Optional[float]:
        """
        Calculate molecular weight
        """
        try:
            if sequence_type == "dna":
                seq_obj = Seq.Seq(sequence)
                return round(molecular_weight(seq_obj, seq_type="DNA"), 2)
            elif sequence_type == "rna":
                seq_obj = Seq.Seq(sequence)
                return round(molecular_weight(seq_obj, seq_type="RNA"), 2)
            elif sequence_type == "protein":
                seq_obj = Seq.Seq(sequence)
                return round(molecular_weight(seq_obj, seq_type="protein"), 2)
        except:
            return None

    def _find_simple_orfs(self, sequence: str, min_length: int = 100) -> List[Dict[str, Any]]:
        """
        Find Open Reading Frames (simple implementation)
        """
        orfs = []
        start_codons = ['ATG']
        stop_codons = ['TAA', 'TAG', 'TGA']

        for frame in range(3):
            for i in range(frame, len(sequence) - 2, 3):
                codon = sequence[i:i+3]

                if codon in start_codons:
                    # Look for stop codon
                    for j in range(i + 3, len(sequence) - 2, 3):
                        stop_codon = sequence[j:j+3]
                        if stop_codon in stop_codons:
                            orf_length = j - i + 3
                            if orf_length >= min_length:
                                orfs.append({
                                    "start": i,
                                    "end": j + 3,
                                    "length": orf_length,
                                    "frame": frame,
                                    "sequence": sequence[i:j+3]
                                })
                            break

        return orfs
