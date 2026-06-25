"""
Analysis Service
Handles comparative genomics, translation, ORF finding, and other analyses
"""

from Bio import Seq, pairwise2
from Bio.pairwise2 import format_alignment
from typing import Dict, List, Any, Optional
import difflib


class AnalysisService:
    """
    Provides advanced genomic analysis capabilities
    """

    def __init__(self):
        self.genetic_code = {
            'ATA':'I', 'ATC':'I', 'ATT':'I', 'ATG':'M',
            'ACA':'T', 'ACC':'T', 'ACG':'T', 'ACT':'T',
            'AAC':'N', 'AAT':'N', 'AAA':'K', 'AAG':'K',
            'AGC':'S', 'AGT':'S', 'AGA':'R', 'AGG':'R',
            'CTA':'L', 'CTC':'L', 'CTG':'L', 'CTT':'L',
            'CCA':'P', 'CCC':'P', 'CCG':'P', 'CCT':'P',
            'CAC':'H', 'CAT':'H', 'CAA':'Q', 'CAG':'Q',
            'CGA':'R', 'CGC':'R', 'CGG':'R', 'CGT':'R',
            'GTA':'V', 'GTC':'V', 'GTG':'V', 'GTT':'V',
            'GCA':'A', 'GCC':'A', 'GCG':'A', 'GCT':'A',
            'GAC':'D', 'GAT':'D', 'GAA':'E', 'GAG':'E',
            'GGA':'G', 'GGC':'G', 'GGG':'G', 'GGT':'G',
            'TCA':'S', 'TCC':'S', 'TCG':'S', 'TCT':'S',
            'TTC':'F', 'TTT':'F', 'TTA':'L', 'TTG':'L',
            'TAC':'Y', 'TAT':'Y', 'TAA':'*', 'TAG':'*',
            'TGC':'C', 'TGT':'C', 'TGA':'*', 'TGG':'W',
        }

    async def compare_sequences(self, seq1: str, seq2: str, alignment_type: str = "global") -> Dict[str, Any]:
        """
        Compare two sequences using pairwise alignment
        """
        try:
            # Clean sequences
            seq1 = seq1.upper().replace(' ', '').replace('\n', '')
            seq2 = seq2.upper().replace(' ', '').replace('\n', '')

            # Perform alignment
            if alignment_type == "global":
                alignments = pairwise2.align.globalxx(seq1, seq2, one_alignment_only=True)
            else:  # local
                alignments = pairwise2.align.localxx(seq1, seq2, one_alignment_only=True)

            if not alignments:
                return {
                    "success": False,
                    "error": "No alignment found"
                }

            alignment = alignments[0]

            # Calculate statistics
            aligned1 = alignment.seqA
            aligned2 = alignment.seqB

            matches = sum(a == b and a != '-' for a, b in zip(aligned1, aligned2))
            mismatches = sum(a != b and a != '-' and b != '-' for a, b in zip(aligned1, aligned2))
            gaps = sum(a == '-' or b == '-' for a, b in zip(aligned1, aligned2))

            total_aligned = len(aligned1)
            similarity = (matches / total_aligned) * 100 if total_aligned > 0 else 0

            # Find differences
            differences = []
            for i, (a, b) in enumerate(zip(aligned1, aligned2)):
                if a != b:
                    differences.append({
                        "position": i,
                        "seq1_base": a,
                        "seq2_base": b,
                        "type": "gap" if a == '-' or b == '-' else "mismatch"
                    })

            return {
                "success": True,
                "alignment_type": alignment_type,
                "score": alignment.score,
                "similarity_percentage": round(similarity, 2),
                "statistics": {
                    "matches": matches,
                    "mismatches": mismatches,
                    "gaps": gaps,
                    "total_length": total_aligned
                },
                "aligned_seq1": aligned1[:1000],  # Limit for display
                "aligned_seq2": aligned2[:1000],
                "differences": differences[:100],  # Limit to first 100
                "total_differences": len(differences)
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def compare_with_reference(self, sequence: str, organism: str = "human") -> Dict[str, Any]:
        """
        Compare sequence with reference genome (simplified)
        """
        # In a real implementation, this would use BLAST or similar
        # For now, return a mock structure
        return {
            "success": True,
            "organism": organism,
            "message": "Full reference comparison requires BLAST alignment",
            "recommendation": "Use NCBI BLAST or similar tools for comprehensive reference genome comparison",
            "sequence_length": len(sequence),
            "reference_info": {
                "organism": organism,
                "assembly": "GRCh38" if organism == "human" else "Unknown"
            }
        }

    async def find_orfs(self, sequence: str, min_length: int = 100) -> Dict[str, Any]:
        """
        Find all Open Reading Frames
        """
        sequence = sequence.upper().replace(' ', '').replace('\n', '')
        orfs = []

        start_codon = 'ATG'
        stop_codons = ['TAA', 'TAG', 'TGA']

        # Check all 6 reading frames (3 forward, 3 reverse)
        sequences = [
            (sequence, '+'),
            (str(Seq.Seq(sequence).reverse_complement()), '-')
        ]

        for seq, strand in sequences:
            for frame in range(3):
                i = frame
                while i < len(seq) - 2:
                    codon = seq[i:i+3]

                    if codon == start_codon:
                        # Found start, look for stop
                        for j in range(i + 3, len(seq) - 2, 3):
                            stop_codon = seq[j:j+3]
                            if stop_codon in stop_codons:
                                orf_length = j - i + 3
                                if orf_length >= min_length:
                                    orf_seq = seq[i:j+3]
                                    protein = self._translate_sequence(orf_seq)

                                    orfs.append({
                                        "start": i if strand == '+' else len(sequence) - j - 3,
                                        "end": j + 3 if strand == '+' else len(sequence) - i,
                                        "length": orf_length,
                                        "strand": strand,
                                        "frame": frame,
                                        "sequence": orf_seq,
                                        "protein": protein,
                                        "protein_length": len(protein)
                                    })
                                break
                    i += 3

        # Sort by length
        orfs.sort(key=lambda x: x['length'], reverse=True)

        return {
            "success": True,
            "orfs_found": len(orfs),
            "min_length": min_length,
            "orfs": orfs[:50],  # Return top 50
            "sequence_length": len(sequence)
        }

    async def translate_dna(self, sequence: str) -> Dict[str, Any]:
        """
        Translate DNA sequence to protein
        """
        try:
            sequence = sequence.upper().replace(' ', '').replace('\n', '')

            # Translate all 6 reading frames
            translations = []

            # Forward strand
            for frame in range(3):
                protein = self._translate_sequence(sequence[frame:])
                translations.append({
                    "frame": frame + 1,
                    "strand": "+",
                    "protein": protein,
                    "length": len(protein)
                })

            # Reverse complement
            rev_comp = str(Seq.Seq(sequence).reverse_complement())
            for frame in range(3):
                protein = self._translate_sequence(rev_comp[frame:])
                translations.append({
                    "frame": frame + 1,
                    "strand": "-",
                    "protein": protein,
                    "length": len(protein)
                })

            return {
                "success": True,
                "sequence_length": len(sequence),
                "translations": translations
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    async def reverse_complement(self, sequence: str) -> Dict[str, Any]:
        """
        Generate reverse complement of DNA sequence
        """
        try:
            sequence = sequence.upper().replace(' ', '').replace('\n', '')
            seq_obj = Seq.Seq(sequence)
            rev_comp = str(seq_obj.reverse_complement())

            return {
                "success": True,
                "original": sequence,
                "reverse_complement": rev_comp,
                "length": len(sequence)
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def _translate_sequence(self, sequence: str) -> str:
        """
        Translate DNA sequence to protein using genetic code
        """
        protein = []

        for i in range(0, len(sequence) - 2, 3):
            codon = sequence[i:i+3]
            if len(codon) == 3:
                amino_acid = self.genetic_code.get(codon, 'X')
                if amino_acid == '*':
                    break
                protein.append(amino_acid)

        return ''.join(protein)

    async def generate_explanation(self, data: Dict[str, Any]) -> str:
        """
        Generate educational explanation of genomic data
        """
        # This would integrate with an AI model in production
        # For now, return template-based explanations

        explanation_type = data.get("type", "general")

        explanations = {
            "gc_content": "GC content refers to the percentage of guanine (G) and cytosine (C) bases in a DNA sequence. Higher GC content typically indicates more stable DNA due to the three hydrogen bonds between G-C pairs (compared to two in A-T pairs). This affects melting temperature and can influence gene expression.",

            "orf": "Open Reading Frames (ORFs) are continuous stretches of DNA codons that begin with a start codon (usually ATG) and end with a stop codon (TAA, TAG, or TGA). ORFs potentially encode proteins and are key features in identifying genes in genomic sequences.",

            "mutation": "Mutations are changes in DNA sequences that can affect gene function. They include single nucleotide polymorphisms (SNPs), insertions, deletions, and structural variants. Mutations can be benign, pathogenic, or beneficial depending on their location and effect.",

            "general": "Genomic analysis helps us understand the structure and function of DNA. By examining sequences, we can identify genes, regulatory elements, and variations that influence traits and diseases."
        }

        return explanations.get(explanation_type, explanations["general"])
