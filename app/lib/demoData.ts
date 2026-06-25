/**
 * Demo data for testing the application without backend
 */

export const demoSequence = `>Example Human BRCA1 Gene Fragment
ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCT
GTCTGGAGTTGATCAAGGAACCTGTCTCCACAAAGTGTGACCACATATTTTGCAAATTTTGCATGCTGAAACTTCTCAA
CCAGAAGAAAGGGCCTTCACAGTGTCCTTTATGTAAGAATGATATAACCAAAAGGAGCCTACAAGAAAGTACGAGATTT
CGTAGAAACTTCTCAACCAGAAGAAAGGGCCTTCACAGTGTCCTTTATGTAAGAATGATATAACCAAAAGGAGCCTACA
AGAAAGTACGAGATTTAGTCAACTTGTTGAAGAGCTATTGAAAATCATTTGTGCTTTTCAGCTTGACACAGGTTTGGAG
TATGCAAACAGCTATAATTTTGCAAAAAAGGAAAATAACTCTCCTGAACATCTAAAAGATGAAGTTTCTATCATCCAAA
GTATGGGCTACAGAAACCGTGCCAAAAGACTTCTACAGAGTGAACCCGAAAATCCTTCCTTGCAGGAAACCAGTCTCAG
TGTCCAACTCTCTAACCTTGGAACTGTGAGAACTCTGAGGACAAAGCAGCGGATACAACCTCAAAAGACGTCTGTCTAC
ATTGAATTGGGATCTGATTCTTCTGAAGATACCGTTAATAAGGCAACTTATTGCAGTGTGGGAGATCAAGAATTGTTAC`;

export const demoAnalysisResult = {
  "success": true,
  "name": "Example Human BRCA1 Gene Fragment",
  "sequence_type": "dna",
  "sequence_hash": "a1b2c3d4e5f6",
  "length": 720,
  "statistics": {
    "length": 720,
    "unique_bases": 4,
    "type": "dna"
  },
  "composition": {
    "A": { "count": 205, "percentage": 28.47 },
    "T": { "count": 188, "percentage": 26.11 },
    "G": { "count": 168, "percentage": 23.33 },
    "C": { "count": 159, "percentage": 22.08 }
  },
  "gc_content": {
    "gc_count": 327,
    "gc_percentage": 45.42,
    "at_count": 393,
    "at_percentage": 54.58,
    "g_count": 168,
    "c_count": 159
  },
  "molecular_weight": 220847.2,
  "orfs_found": 6,
  "orf_details": [
    {
      "start": 0,
      "end": 720,
      "length": 720,
      "frame": 0,
      "sequence": "ATG..."
    },
    {
      "start": 120,
      "end": 480,
      "length": 360,
      "frame": 0,
      "sequence": "ATG..."
    },
    {
      "start": 240,
      "end": 600,
      "length": 360,
      "frame": 1,
      "sequence": "TGA..."
    },
    {
      "start": 60,
      "end": 360,
      "length": 300,
      "frame": 2,
      "sequence": "ATG..."
    },
    {
      "start": 180,
      "end": 540,
      "length": 360,
      "frame": 2,
      "sequence": "TGA..."
    },
    {
      "start": 300,
      "end": 660,
      "length": 360,
      "frame": 1,
      "sequence": "ATG..."
    }
  ],
  "sequence_preview": "ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCT...",
  "full_sequence": null
};

export function generateMockAnalysis(sequence: string, name: string, type: string) {
  const cleanSeq = sequence.replace(/[^ATCGUNatcgun]/g, '').toUpperCase();
  const length = cleanSeq.length;

  // Calculate base composition
  const composition: any = {};
  const bases = ['A', 'T', 'G', 'C', 'U', 'N'];
  bases.forEach(base => {
    const count = (cleanSeq.match(new RegExp(base, 'g')) || []).length;
    if (count > 0) {
      composition[base] = {
        count: count,
        percentage: parseFloat(((count / length) * 100).toFixed(2))
      };
    }
  });

  // Calculate GC content
  const gCount = (cleanSeq.match(/G/g) || []).length;
  const cCount = (cleanSeq.match(/C/g) || []).length;
  const gcCount = gCount + cCount;
  const gcPercentage = parseFloat(((gcCount / length) * 100).toFixed(2));

  const atCount = length - gcCount;
  const atPercentage = parseFloat(((atCount / length) * 100).toFixed(2));

  return {
    success: true,
    name: name,
    sequence_type: type,
    sequence_hash: Math.random().toString(36).substring(7),
    length: length,
    statistics: {
      length: length,
      unique_bases: Object.keys(composition).length,
      type: type
    },
    composition: composition,
    gc_content: {
      gc_count: gcCount,
      gc_percentage: gcPercentage,
      at_count: atCount,
      at_percentage: atPercentage,
      g_count: gCount,
      c_count: cCount
    },
    molecular_weight: length * 330, // Rough estimate
    orfs_found: Math.floor(Math.random() * 10),
    orf_details: [],
    sequence_preview: cleanSeq.substring(0, 100) + (cleanSeq.length > 100 ? '...' : ''),
    full_sequence: cleanSeq.length < 10000 ? cleanSeq : null
  };
}
