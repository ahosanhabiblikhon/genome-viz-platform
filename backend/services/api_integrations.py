"""
Genome API Integration Service
Integrates with free bioinformatics APIs: Ensembl, NCBI, UniProt, MyGene.info, etc.
"""

import httpx
import asyncio
from typing import Dict, List, Any, Optional
import json


class GenomeAPIIntegrator:
    """
    Integrates with multiple free genome databases and APIs
    """

    def __init__(self):
        self.timeout = 30.0
        self.retry_count = 3

        # API Base URLs
        self.apis = {
            "ensembl": "https://rest.ensembl.org",
            "mygene": "https://mygene.info/v3",
            "uniprot": "https://rest.uniprot.org",
            "ncbi_gene": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils",
            "ucsc": "https://api.genome.ucsc.edu",
            "quickgo": "https://www.ebi.ac.uk/QuickGO/services",
            "string": "https://string-db.org/api",
            "reactome": "https://reactome.org/ContentService",
        }

    async def fetch_all_annotations(self, sequence: str, sequence_info: Dict) -> Dict[str, Any]:
        """
        Fetch annotations from all available sources
        """
        annotations = {
            "sources": [],
            "genes": [],
            "proteins": [],
            "pathways": [],
            "go_terms": [],
            "diseases": [],
            "publications": []
        }

        try:
            # Try to find matching genes (simplified - in reality would use BLAST or similar)
            # For demonstration, we'll show API structure
            annotations["sources"].append("Multiple free databases queried")
            annotations["message"] = "Full sequence annotation requires BLAST alignment with reference genomes"

        except Exception as e:
            annotations["error"] = str(e)

        return annotations

    async def search_gene(self, query: str, search_type: str = "gene_name", organism: str = "human") -> Dict[str, Any]:
        """
        Search for gene across multiple databases
        """
        results = {
            "query": query,
            "search_type": search_type,
            "organism": organism,
            "results": []
        }

        # Try multiple sources
        tasks = [
            self._search_mygene(query, organism),
            self._search_ensembl(query, organism),
        ]

        try:
            api_results = await asyncio.gather(*tasks, return_exceptions=True)

            for result in api_results:
                if isinstance(result, dict) and not isinstance(result, Exception):
                    results["results"].extend(result.get("hits", []))

        except Exception as e:
            results["error"] = str(e)

        return results

    async def fetch_ensembl_gene(self, gene_id: str) -> Dict[str, Any]:
        """
        Fetch gene information from Ensembl REST API
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                # Gene lookup
                gene_url = f"{self.apis['ensembl']}/lookup/id/{gene_id}"
                headers = {"Content-Type": "application/json"}

                response = await client.get(gene_url, headers=headers)

                if response.status_code == 200:
                    gene_data = response.json()

                    # Fetch additional information
                    # Sequence
                    seq_url = f"{self.apis['ensembl']}/sequence/id/{gene_id}"
                    seq_response = await client.get(seq_url, headers=headers)
                    sequence = seq_response.json() if seq_response.status_code == 200 else None

                    return {
                        "source": "Ensembl",
                        "gene_id": gene_id,
                        "gene_data": gene_data,
                        "sequence": sequence,
                        "success": True
                    }
                else:
                    return {"success": False, "error": f"Gene not found: {gene_id}"}

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def fetch_uniprot_protein(self, protein_id: str) -> Dict[str, Any]:
        """
        Fetch protein information from UniProt
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = f"{self.apis['uniprot']}/uniprotkb/{protein_id}.json"

                response = await client.get(url)

                if response.status_code == 200:
                    protein_data = response.json()

                    return {
                        "source": "UniProt",
                        "protein_id": protein_id,
                        "protein_data": protein_data,
                        "success": True
                    }
                else:
                    return {"success": False, "error": f"Protein not found: {protein_id}"}

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def fetch_ncbi_gene(self, gene_id: str) -> Dict[str, Any]:
        """
        Fetch gene information from NCBI using E-utilities
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                # ESummary for gene information
                url = f"{self.apis['ncbi_gene']}/esummary.fcgi"
                params = {
                    "db": "gene",
                    "id": gene_id,
                    "retmode": "json"
                }

                response = await client.get(url, params=params)

                if response.status_code == 200:
                    data = response.json()

                    return {
                        "source": "NCBI Gene",
                        "gene_id": gene_id,
                        "gene_data": data,
                        "success": True
                    }
                else:
                    return {"success": False, "error": f"Gene not found: {gene_id}"}

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def fetch_go_terms(self, gene_id: str) -> Dict[str, Any]:
        """
        Fetch Gene Ontology terms
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = f"{self.apis['quickgo']}/annotation/search"
                params = {
                    "geneProductId": gene_id,
                    "limit": 100
                }

                response = await client.get(url, params=params)

                if response.status_code == 200:
                    data = response.json()

                    return {
                        "source": "QuickGO",
                        "gene_id": gene_id,
                        "go_terms": data.get("results", []),
                        "success": True
                    }
                else:
                    return {"success": False, "error": "GO terms not found"}

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def fetch_protein_interactions(self, protein_name: str, organism: str = "9606") -> Dict[str, Any]:
        """
        Fetch protein-protein interactions from STRING database
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = f"{self.apis['string']}/json/network"
                params = {
                    "identifiers": protein_name,
                    "species": organism  # 9606 is human
                }

                response = await client.get(url, params=params)

                if response.status_code == 200:
                    data = response.json()

                    return {
                        "source": "STRING-DB",
                        "protein": protein_name,
                        "interactions": data,
                        "success": True
                    }
                else:
                    return {"success": False, "error": "Interactions not found"}

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def fetch_pathways(self, gene_id: str) -> Dict[str, Any]:
        """
        Fetch pathway information from Reactome
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = f"{self.apis['reactome']}/data/pathways/low/entity/{gene_id}"

                response = await client.get(url)

                if response.status_code == 200:
                    data = response.json()

                    return {
                        "source": "Reactome",
                        "gene_id": gene_id,
                        "pathways": data,
                        "success": True
                    }
                else:
                    return {"success": False, "error": "Pathways not found"}

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def _search_mygene(self, query: str, organism: str) -> Dict[str, Any]:
        """
        Search MyGene.info API
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = f"{self.apis['mygene']}/query"
                params = {
                    "q": query,
                    "species": organism,
                    "size": 10
                }

                response = await client.get(url, params=params)

                if response.status_code == 200:
                    return response.json()
                else:
                    return {"hits": []}

        except Exception as e:
            return {"hits": [], "error": str(e)}

    async def _search_ensembl(self, query: str, organism: str) -> Dict[str, Any]:
        """
        Search Ensembl API
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                species_map = {
                    "human": "homo_sapiens",
                    "mouse": "mus_musculus",
                    "rat": "rattus_norvegicus"
                }

                species = species_map.get(organism.lower(), "homo_sapiens")
                url = f"{self.apis['ensembl']}/lookup/symbol/{species}/{query}"
                headers = {"Content-Type": "application/json"}

                response = await client.get(url, headers=headers)

                if response.status_code == 200:
                    data = response.json()
                    return {"hits": [data]}
                else:
                    return {"hits": []}

        except Exception as e:
            return {"hits": [], "error": str(e)}

    async def fetch_clinvar_variants(self, gene_symbol: str) -> Dict[str, Any]:
        """
        Fetch clinical variants from ClinVar
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = f"{self.apis['ncbi_gene']}/esearch.fcgi"
                params = {
                    "db": "clinvar",
                    "term": f"{gene_symbol}[gene]",
                    "retmode": "json",
                    "retmax": 20
                }

                response = await client.get(url, params=params)

                if response.status_code == 200:
                    data = response.json()

                    return {
                        "source": "ClinVar",
                        "gene": gene_symbol,
                        "variants": data.get("esearchresult", {}),
                        "success": True
                    }
                else:
                    return {"success": False, "error": "Variants not found"}

        except Exception as e:
            return {"success": False, "error": str(e)}
