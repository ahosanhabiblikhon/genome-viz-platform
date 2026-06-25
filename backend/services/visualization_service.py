"""
Visualization Service
Generates data structures for circular and linear genome visualizations
"""

from typing import Dict, List, Any, Optional
import math


class VisualizationService:
    """
    Generates visualization data for genome maps
    """

    def __init__(self):
        pass

    async def generate_circular_map(self, sequence: str, name: str = "Genome") -> Dict[str, Any]:
        """
        Generate circular genome map data
        """
        length = len(sequence)

        # Calculate GC content in windows
        window_size = max(100, length // 100)
        gc_track = self._calculate_gc_windows(sequence, window_size)

        # Find genes/ORFs
        orfs = self._find_features(sequence)

        # Generate tracks
        tracks = [
            {
                "name": "GC Content",
                "type": "line",
                "data": gc_track,
                "color": "#4CAF50"
            },
            {
                "name": "ORFs",
                "type": "rect",
                "data": orfs,
                "color": "#2196F3"
            }
        ]

        return {
            "type": "circular",
            "name": name,
            "length": length,
            "radius": 300,
            "tracks": tracks,
            "sectors": self._generate_sectors(length),
            "success": True
        }

    async def generate_linear_map(self, sequence: str, name: str = "Genome") -> Dict[str, Any]:
        """
        Generate linear genome map data
        """
        length = len(sequence)

        # Calculate GC content in windows
        window_size = max(100, length // 100)
        gc_track = self._calculate_gc_windows(sequence, window_size)

        # Find features
        orfs = self._find_features(sequence)

        # Generate tracks
        tracks = [
            {
                "name": "GC Content",
                "type": "line",
                "data": gc_track
            },
            {
                "name": "Genes/ORFs",
                "type": "rect",
                "data": orfs
            }
        ]

        return {
            "type": "linear",
            "name": name,
            "length": length,
            "tracks": tracks,
            "scale": self._generate_scale(length),
            "success": True
        }

    def _calculate_gc_windows(self, sequence: str, window_size: int) -> List[Dict[str, Any]]:
        """
        Calculate GC content in sliding windows
        """
        gc_data = []
        length = len(sequence)

        for i in range(0, length, window_size):
            window = sequence[i:i+window_size]
            if len(window) < window_size // 2:
                continue

            gc_count = window.count('G') + window.count('C')
            gc_percent = (gc_count / len(window)) * 100

            gc_data.append({
                "position": i,
                "end": min(i + window_size, length),
                "value": round(gc_percent, 2)
            })

        return gc_data

    def _find_features(self, sequence: str) -> List[Dict[str, Any]]:
        """
        Find genomic features (simplified ORF detection)
        """
        features = []
        start_codon = 'ATG'
        stop_codons = ['TAA', 'TAG', 'TGA']

        for frame in range(3):
            for i in range(frame, len(sequence) - 2, 3):
                if sequence[i:i+3] == start_codon:
                    for j in range(i + 3, len(sequence) - 2, 3):
                        if sequence[j:j+3] in stop_codons:
                            length = j - i + 3
                            if length >= 300:  # Minimum ORF length
                                features.append({
                                    "start": i,
                                    "end": j + 3,
                                    "length": length,
                                    "strand": "+",
                                    "type": "ORF",
                                    "frame": frame
                                })
                            break

        return features[:50]  # Limit to 50 features for visualization

    def _generate_sectors(self, length: int, sector_count: int = 12) -> List[Dict[str, Any]]:
        """
        Generate sectors for circular visualization
        """
        sectors = []
        sector_size = length / sector_count

        for i in range(sector_count):
            sectors.append({
                "id": i,
                "start": int(i * sector_size),
                "end": int((i + 1) * sector_size),
                "angle_start": (i * 360 / sector_count),
                "angle_end": ((i + 1) * 360 / sector_count)
            })

        return sectors

    def _generate_scale(self, length: int) -> List[Dict[str, Any]]:
        """
        Generate scale markers for linear visualization
        """
        scale = []

        # Determine appropriate step size
        if length < 1000:
            step = 100
        elif length < 10000:
            step = 1000
        elif length < 100000:
            step = 10000
        else:
            step = 100000

        for i in range(0, length, step):
            scale.append({
                "position": i,
                "label": self._format_position(i)
            })

        return scale

    def _format_position(self, position: int) -> str:
        """
        Format position for display
        """
        if position >= 1000000:
            return f"{position/1000000:.1f}M"
        elif position >= 1000:
            return f"{position/1000:.1f}K"
        else:
            return str(position)
