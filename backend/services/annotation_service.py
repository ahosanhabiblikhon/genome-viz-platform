"""
Annotation Service
Provides gene and genomic feature annotation
"""

from typing import Dict, List, Any, Optional


class AnnotationService:
    """
    Handles genomic feature annotation
    """

    def __init__(self):
        # Common gene features
        self.feature_types = [
            "gene", "CDS", "exon", "intron", "promoter",
            "UTR", "enhancer", "regulatory", "repeat"
        ]

    async def annotate_features(self, sequence: str, features: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Annotate genomic features
        """
        annotated_features = []

        for feature in features:
            annotation = self._annotate_single_feature(feature, sequence)
            annotated_features.append(annotation)

        return {
            "success": True,
            "total_features": len(annotated_features),
            "features": annotated_features
        }

    def _annotate_single_feature(self, feature: Dict[str, Any], sequence: str) -> Dict[str, Any]:
        """
        Annotate a single genomic feature
        """
        feature_type = feature.get("type", "unknown")
        start = feature.get("start", 0)
        end = feature.get("end", 0)

        # Extract sequence
        feature_seq = sequence[start:end] if start < len(sequence) and end <= len(sequence) else ""

        # Calculate GC content
        if feature_seq:
            gc_count = feature_seq.count('G') + feature_seq.count('C')
            gc_content = (gc_count / len(feature_seq)) * 100 if feature_seq else 0
        else:
            gc_content = 0

        return {
            **feature,
            "gc_content": round(gc_content, 2),
            "sequence_length": len(feature_seq),
            "annotation": self._get_feature_description(feature_type)
        }

    def _get_feature_description(self, feature_type: str) -> str:
        """
        Get description for feature type
        """
        descriptions = {
            "gene": "A distinct sequence of nucleotides that encodes a functional product (protein or RNA).",
            "CDS": "Coding DNA Sequence - the portion of a gene that is translated into protein.",
            "exon": "A segment of a gene that is retained in the final mRNA and translated into protein.",
            "intron": "A non-coding segment of a gene that is removed during RNA splicing.",
            "promoter": "A regulatory region that initiates transcription of a particular gene.",
            "UTR": "Untranslated Region - sections of mRNA that are not translated into protein.",
            "enhancer": "A regulatory region that increases transcription of a gene.",
            "regulatory": "A DNA sequence that controls gene expression.",
            "repeat": "A repeated sequence pattern in the genome.",
            "ORF": "Open Reading Frame - a continuous stretch of codons that could encode a protein."
        }

        return descriptions.get(feature_type, "Genomic feature")
