'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SequenceInput from './components/SequenceInput';
import Hero from './components/Hero';

export default function Home() {
  const [showInput, setShowInput] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-lg border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              <span className="ml-3 text-xl font-bold text-white">GenomeViz</span>
            </div>

            <div className="hidden md:flex space-x-8">
              <Link href="/#features" className="text-gray-300 hover:text-white transition">Features</Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
              <Link href="/analysis" className="text-gray-300 hover:text-white transition">Analysis</Link>
              <Link href="/#about" className="text-gray-300 hover:text-white transition">About</Link>
            </div>

            <button
              onClick={() => setShowInput(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero onGetStarted={() => setShowInput(true)} />

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need for genome analysis</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-blue-500/20 hover:border-blue-500/40 transition group"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Input Modal */}
      {showInput && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl"
          >
            <SequenceInput onClose={() => setShowInput(false)} />
          </motion.div>
        </div>
      )}

      {/* Stats Section */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">About GenomeViz</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              GenomeViz is a comprehensive genome visualization platform that combines cutting-edge bioinformatics
              with beautiful, interactive visualizations. Whether you're a student, researcher, or biotechnology
              professional, our platform makes genome analysis accessible and insightful.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowInput(true)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
              >
                Start Analyzing
              </button>
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition font-medium"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 GenomeViz. Advanced Genome Visualization Platform.</p>
          <p className="mt-2 text-sm">Built with Next.js, FastAPI, and BioPython</p>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: '🧬',
    title: 'Sequence Analysis',
    description: 'Comprehensive DNA/RNA sequence analysis with statistics and composition details'
  },
  {
    icon: '📊',
    title: 'Interactive Visualizations',
    description: 'Beautiful circular and linear genome maps with zoom, pan, and annotations'
  },
  {
    icon: '🔬',
    title: 'Gene Annotation',
    description: 'Automatic annotation using UCSC, Ensembl, NCBI, and other free databases'
  },
  {
    icon: '⚖️',
    title: 'Comparative Analysis',
    description: 'Compare sequences and identify mutations, insertions, and deletions'
  },
  {
    icon: '🤖',
    title: 'AI Assistant',
    description: 'Get simple explanations of complex genomic concepts and results'
  },
  {
    icon: '📁',
    title: 'Multiple Formats',
    description: 'Support for FASTA, FASTQ, GenBank, GFF, and GTF file formats'
  },
  {
    icon: '🔍',
    title: 'Gene Search',
    description: 'Search genes, proteins, diseases, and pathways across databases'
  },
  {
    icon: '📥',
    title: 'Export Results',
    description: 'Download reports as PDF, CSV, PNG, SVG, and Excel formats'
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    description: 'Beautiful dark and light themes optimized for long analysis sessions'
  }
];

const stats = [
  { value: '100+', label: 'API Integrations' },
  { value: '10K+', label: 'Sequences Analyzed' },
  { value: '50+', label: 'Features' },
  { value: '99.9%', label: 'Accuracy' }
];
