'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-lg border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              GenomeViz
            </Link>
            <div className="flex gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
              >
                Home
              </Link>
              <Link
                href="/analysis"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                New Analysis
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-gray-400 text-lg">Welcome to your genome analysis workspace</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: 'New Analysis',
              description: 'Upload or paste a new sequence',
              icon: '🧬',
              link: '/',
              color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
            },
            {
              title: 'Recent Results',
              description: 'View your latest analyses',
              icon: '📊',
              link: '/analysis',
              color: 'from-green-500/20 to-green-600/20 border-green-500/30'
            },
            {
              title: 'Search Genes',
              description: 'Explore gene databases',
              icon: '🔍',
              link: '/#features',
              color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
            }
          ].map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={action.link}
                className={`block p-6 rounded-xl bg-gradient-to-br ${action.color} border backdrop-blur hover:scale-105 transition-transform group`}
              >
                <div className="text-4xl mb-4">{action.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition">
                  {action.title}
                </h3>
                <p className="text-gray-400">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Available Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '📁', name: 'File Upload', desc: 'FASTA, FASTQ, GenBank' },
              { icon: '🔬', name: 'ORF Detection', desc: 'Find coding sequences' },
              { icon: '⚖️', name: 'Comparison', desc: 'Align sequences' },
              { icon: '🧮', name: 'Translation', desc: 'DNA to Protein' },
              { icon: '🔄', name: 'Reverse Comp', desc: 'Generate complement' },
              { icon: '📈', name: 'GC Content', desc: 'Calculate statistics' },
              { icon: '💾', name: 'Export', desc: 'PDF, CSV, PNG, SVG' },
              { icon: '🌐', name: 'API Access', desc: '100+ databases' }
            ].map((tool, index) => (
              <div
                key={index}
                className="p-4 bg-slate-900/50 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition"
              >
                <div className="text-3xl mb-2">{tool.icon}</div>
                <h4 className="text-white font-semibold text-sm mb-1">{tool.name}</h4>
                <p className="text-gray-400 text-xs">{tool.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Analyses', value: '0', icon: '📊' },
            { label: 'Sequences', value: '0', icon: '🧬' },
            { label: 'ORFs Found', value: '0', icon: '🔬' },
            { label: 'Reports', value: '0', icon: '📄' }
          ].map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/20 text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Getting Started</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Upload Sequence',
                desc: 'Paste or upload your DNA/RNA sequence in FASTA or other formats'
              },
              {
                step: '2',
                title: 'Analyze',
                desc: 'Our platform automatically processes and annotates your sequence'
              },
              {
                step: '3',
                title: 'Explore',
                desc: 'Visualize, compare, and export your genomic analysis results'
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Start Your First Analysis
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
