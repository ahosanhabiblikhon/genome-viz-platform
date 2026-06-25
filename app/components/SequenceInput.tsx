'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { genomeAPI } from '../lib/api';
import { generateMockAnalysis, demoSequence } from '../lib/demoData';

interface SequenceInputProps {
  onClose: () => void;
}

export default function SequenceInput({ onClose }: SequenceInputProps) {
  const router = useRouter();
  const [inputMethod, setInputMethod] = useState<'paste' | 'upload' | 'example'>('paste');
  const [sequence, setSequence] = useState('');
  const [sequenceName, setSequenceName] = useState('');
  const [sequenceType, setSequenceType] = useState('dna');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useDemoMode, setUseDemoMode] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setSequence(text);
        setSequenceName(file.name);
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.fasta', '.fa', '.fastq', '.fq', '.txt', '.gb', '.gff', '.gtf']
    },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!sequence.trim()) {
      setError('Please enter a sequence');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;

      if (useDemoMode) {
        // Use local processing (demo mode)
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
        result = generateMockAnalysis(sequence, sequenceName || 'Unnamed Sequence', sequenceType);
      } else {
        // Try backend API
        try {
          result = await genomeAPI.analyzeSequence({
            sequence: sequence,
            sequence_type: sequenceType,
            name: sequenceName || 'Unnamed Sequence'
          });
        } catch (apiError) {
          // If backend fails, offer demo mode
          setError('Backend server is offline. Would you like to use demo mode instead?');
          setUseDemoMode(true);
          setLoading(false);
          return;
        }
      }

      if (result.success || result) {
        // Store results in localStorage temporarily
        localStorage.setItem('genomeAnalysisResult', JSON.stringify(result));
        localStorage.setItem('genomeDemoMode', useDemoMode ? 'true' : 'false');
        router.push('/analysis');
      } else {
        setError('Analysis failed');
      }
    } catch (err: any) {
      setError('Failed to analyze sequence. Using demo mode...');
      setUseDemoMode(true);
      // Try again with demo mode
      setTimeout(() => handleAnalyze(), 500);
    } finally {
      setLoading(false);
    }
  };

  const loadExampleSequence = () => {
    setSequence(demoSequence);
    setSequenceName('Example BRCA1 Fragment');
    setSequenceType('dna');
    setInputMethod('paste');
  };

  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl border border-blue-500/30 overflow-hidden max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Genome Sequence Input</h2>
            <p className="text-gray-400 mt-1">Upload or paste your DNA/RNA sequence for analysis</p>
            {useDemoMode && (
              <span className="inline-block mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                🚀 Demo Mode Active
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Input Method Selector */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'paste', label: 'Paste Sequence', icon: '📝' },
            { id: 'upload', label: 'Upload File', icon: '📁' },
            { id: 'example', label: 'Example Data', icon: '🧬' }
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => {
                setInputMethod(method.id as any);
                if (method.id === 'example') {
                  loadExampleSequence();
                }
              }}
              className={`flex-1 p-3 rounded-lg font-medium transition ${
                inputMethod === method.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              <span className="mr-2">{method.icon}</span>
              {method.label}
            </button>
          ))}
        </div>

        {/* Sequence Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sequence Name (Optional)
          </label>
          <input
            type="text"
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
            placeholder="e.g., Human BRCA1 Gene"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition"
          />
        </div>

        {/* Sequence Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sequence Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['dna', 'rna', 'protein'].map((type) => (
              <button
                key={type}
                onClick={() => setSequenceType(type)}
                className={`p-3 rounded-lg font-medium transition ${
                  sequenceType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <AnimatePresence mode="wait">
          {inputMethod === 'paste' && (
            <motion.div
              key="paste"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paste Sequence (FASTA format or raw sequence)
              </label>
              <textarea
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                placeholder=">Sequence_Name&#10;ATCGATCGATCG..."
                rows={12}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition resize-none"
              />
              <div className="text-xs text-gray-400 mt-2">
                {sequence.length} characters
              </div>
            </motion.div>
          )}

          {inputMethod === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 hover:border-blue-500/50 bg-slate-800/50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-4xl mb-4">📁</div>
                <p className="text-white font-medium mb-2">
                  {isDragActive ? 'Drop file here' : 'Drag & drop file here'}
                </p>
                <p className="text-gray-400 text-sm mb-4">or click to browse</p>
                <p className="text-xs text-gray-500">
                  Supports: FASTA, FASTQ, GenBank, GFF, GTF
                </p>
              </div>
              {sequence && (
                <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                  <div className="text-sm text-gray-300">
                    File loaded: <span className="text-white font-medium">{sequenceName}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {sequence.length} characters
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="text-red-400 mb-2">{error}</div>
            {error.includes('demo mode') && (
              <button
                onClick={() => {
                  setUseDemoMode(true);
                  setError('');
                }}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition"
              >
                Enable Demo Mode
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !sequence.trim()}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
              loading || !sequence.trim()
                ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Sequence'
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition"
          >
            Cancel
          </button>
        </div>

        {/* Quick Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-sm text-blue-300">
            <strong>💡 Tip:</strong> For best results, use FASTA format or clean sequences (ATCG for DNA, AUCG for RNA).
            {!useDemoMode && ' Backend server required for full features.'}
            {useDemoMode && ' Demo mode provides basic analysis without backend.'}
          </div>
        </div>
      </div>
    </div>
  );
}
