'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import heavy visualization components
const GenomeVisualization = dynamic(() => import('../components/GenomeVisualization'), {
  ssr: false,
  loading: () => <div className="text-white">Loading visualization...</div>
});

const StatisticsPanel = dynamic(() => import('../components/StatisticsPanel'), {
  ssr: false
});

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load analysis results from localStorage
    const stored = localStorage.getItem('genomeAnalysisResult');
    if (stored) {
      setAnalysisData(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Analysis Data Found</h2>
          <p className="text-gray-400 mb-6">Please upload a sequence first</p>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium inline-block"
          >
            Upload Sequence
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'visualization', label: 'Visualization', icon: '🧬' },
    { id: 'statistics', label: 'Statistics', icon: '📈' },
    { id: 'orfs', label: 'ORFs', icon: '🔬' },
    { id: 'export', label: 'Export', icon: '💾' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-lg border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                GenomeViz
              </Link>
              <p className="text-gray-400 text-sm mt-1">{analysisData.name}</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
              >
                Dashboard
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                New Analysis
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-blue-500/20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/30">
                <div className="text-sm text-blue-300 mb-2">Sequence Length</div>
                <div className="text-3xl font-bold text-white">{analysisData.length?.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">base pairs</div>
              </div>

              {analysisData.gc_content && (
                <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/30">
                  <div className="text-sm text-green-300 mb-2">GC Content</div>
                  <div className="text-3xl font-bold text-white">{analysisData.gc_content.gc_percentage}%</div>
                  <div className="text-xs text-gray-400 mt-1">
                    G: {analysisData.gc_content.g_count} | C: {analysisData.gc_content.c_count}
                  </div>
                </div>
              )}

              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/30">
                <div className="text-sm text-purple-300 mb-2">ORFs Found</div>
                <div className="text-3xl font-bold text-white">{analysisData.orfs_found || 0}</div>
                <div className="text-xs text-gray-400 mt-1">open reading frames</div>
              </div>
            </div>

            {/* Composition Chart */}
            {analysisData.composition && (
              <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/20 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Base Composition</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysisData.composition).map(([base, data]: [string, any]) => (
                    <div key={base} className="p-4 bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{base}</div>
                      <div className="text-xl text-white mt-2">{data.count}</div>
                      <div className="text-sm text-gray-400">{data.percentage}%</div>
                      <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sequence Preview */}
            <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Sequence Preview</h3>
              <div className="p-4 bg-slate-800 rounded-lg font-mono text-sm text-gray-300 overflow-x-auto">
                {analysisData.sequence_preview}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'visualization' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GenomeVisualization data={analysisData} />
          </motion.div>
        )}

        {activeTab === 'statistics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <StatisticsPanel data={analysisData} />
          </motion.div>
        )}

        {activeTab === 'orfs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Open Reading Frames</h3>
              {analysisData.orf_details && analysisData.orf_details.length > 0 ? (
                <div className="space-y-4">
                  {analysisData.orf_details.map((orf: any, index: number) => (
                    <div key={index} className="p-4 bg-slate-800 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-blue-400 font-semibold">ORF #{index + 1}</span>
                          <span className="text-gray-400 text-sm ml-4">Frame: {orf.frame}</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                          {orf.length} bp
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        Position: {orf.start} - {orf.end}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No ORFs found (minimum length: 100 bp)
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'export' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/20">
              <h3 className="text-xl font-semibold text-white mb-4">Export Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { format: 'PDF Report', icon: '📄', desc: 'Complete analysis report' },
                  { format: 'CSV Data', icon: '📊', desc: 'Statistical data table' },
                  { format: 'JSON', icon: '💻', desc: 'Raw JSON data' },
                  { format: 'PNG Image', icon: '🖼️', desc: 'Visualization snapshot' },
                  { format: 'SVG Vector', icon: '📐', desc: 'Scalable graphics' },
                  { format: 'Excel', icon: '📗', desc: 'Spreadsheet format' }
                ].map((format) => (
                  <button
                    key={format.format}
                    className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-left group"
                  >
                    <div className="text-3xl mb-2">{format.icon}</div>
                    <div className="text-white font-semibold group-hover:text-blue-400 transition">
                      {format.format}
                    </div>
                    <div className="text-gray-400 text-sm">{format.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
