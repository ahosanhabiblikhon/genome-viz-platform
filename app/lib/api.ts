/**
 * API Client for GenomeViz Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SequenceAnalysisRequest {
  sequence: string;
  sequence_type: string;
  name?: string;
  description?: string;
}

export interface SequenceAnalysisResponse {
  success: boolean;
  name: string;
  sequence_type: string;
  sequence_hash: string;
  length: number;
  statistics: any;
  composition: any;
  gc_content?: any;
  molecular_weight?: number;
  orfs_found: number;
  orf_details?: any[];
  sequence_preview: string;
  full_sequence?: string;
}

export class GenomeAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async analyzeSequence(data: SequenceAnalysisRequest): Promise<SequenceAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/analyze/sequence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async uploadFasta(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/api/upload/fasta`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload error: ${response.status}`);
    }

    return await response.json();
  }

  async uploadFastq(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/api/upload/fastq`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload error: ${response.status}`);
    }

    return await response.json();
  }

  async searchGene(query: string, searchType: string = 'gene_name', organism: string = 'human'): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/search/gene`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, search_type: searchType, organism }),
    });

    if (!response.ok) {
      throw new Error(`Search error: ${response.status}`);
    }

    return await response.json();
  }

  async compareSequences(seq1: string, seq2: string, alignmentType: string = 'global'): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/compare/sequences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sequence1: seq1, sequence2: seq2, alignment_type: alignmentType }),
    });

    if (!response.ok) {
      throw new Error(`Compare error: ${response.status}`);
    }

    return await response.json();
  }

  async findORFs(sequence: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/analysis/orf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sequence }),
    });

    if (!response.ok) {
      throw new Error(`ORF analysis error: ${response.status}`);
    }

    return await response.json();
  }

  async translateSequence(sequence: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/analysis/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sequence }),
    });

    if (!response.ok) {
      throw new Error(`Translation error: ${response.status}`);
    }

    return await response.json();
  }

  async reverseComplement(sequence: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/analysis/reverse-complement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sequence }),
    });

    if (!response.ok) {
      throw new Error(`Reverse complement error: ${response.status}`);
    }

    return await response.json();
  }

  async getEnsemblGene(geneId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/external/ensembl/gene/${geneId}`);

    if (!response.ok) {
      throw new Error(`Ensembl API error: ${response.status}`);
    }

    return await response.json();
  }

  async getUniprotProtein(proteinId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/external/uniprot/protein/${proteinId}`);

    if (!response.ok) {
      throw new Error(`UniProt API error: ${response.status}`);
    }

    return await response.json();
  }

  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      return { status: 'offline' };
    }
  }
}

// Export singleton instance
export const genomeAPI = new GenomeAPI();
