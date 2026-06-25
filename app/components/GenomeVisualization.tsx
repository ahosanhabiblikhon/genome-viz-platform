'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface GenomeVisualizationProps {
  data: any;
}

export default function GenomeVisualization({ data }: GenomeVisualizationProps) {
  const [viewType, setViewType] = useState<'circular' | 'linear'>('linear');

  return (
    <div className="space-y-6">
      {/* View Type Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Genome Visualization</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('linear')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewType === 'linear'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            Linear View
          </button>
          <button
            onClick={() => setViewType('circular')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewType === 'circular'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            Circular View
          </button>
        </div>
      </div>

      {/* Visualization Container */}
      <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/20">
        {viewType === 'linear' ? (
          <LinearGenomeView data={data} />
        ) : (
          <CircularGenomeView data={data} />
        )}
      </div>

      {/* Legend */}
      <div className="p-4 bg-slate-900/50 rounded-xl border border-blue-500/20">
        <h4 className="text-white font-semibold mb-3">Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-300 text-sm">High GC Content</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-300 text-sm">ORF/Gene</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-300 text-sm">Low GC Content</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinearGenomeView({ data }: { data: any }) {
  const length = data.length || 0;
  const gcContent = data.gc_content?.gc_percentage || 50;

  return (
    <div className="space-y-6">
      {/* Scale */}
      <div className="relative h-12 bg-slate-800 rounded-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-4 text-xs text-gray-400">
          <span>0</span>
          <span>{Math.floor(length / 4).toLocaleString()}</span>
          <span>{Math.floor(length / 2).toLocaleString()}</span>
          <span>{Math.floor((length * 3) / 4).toLocaleString()}</span>
          <span>{length.toLocaleString()} bp</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 opacity-50"></div>
      </div>

      {/* GC Content Track */}
      <div>
        <div className="text-sm text-gray-300 mb-2">GC Content Distribution</div>
        <div className="h-32 bg-slate-800 rounded-lg relative overflow-hidden">
          <svg className="w-full h-full" preserveAspectRatio="none">
            {/* Simulated GC content wave */}
            <path
              d={`M 0,${128 - (gcContent * 1.28)} Q ${length/4},${64} ${length/2},${128 - (gcContent * 1.28)} T ${length},${128 - (gcContent * 1.28)}`}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              className="opacity-75"
            />
            <path
              d={`M 0,${128 - (gcContent * 1.28)} Q ${length/4},${64} ${length/2},${128 - (gcContent * 1.28)} T ${length},${128 - (gcContent * 1.28)} L ${length},128 L 0,128 Z`}
              fill="url(#gradient)"
              className="opacity-30"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-2 left-2 text-xs text-blue-300">
            Avg: {gcContent}%
          </div>
        </div>
      </div>

      {/* ORF Track */}
      {data.orf_details && data.orf_details.length > 0 && (
        <div>
          <div className="text-sm text-gray-300 mb-2">Open Reading Frames</div>
          <div className="h-16 bg-slate-800 rounded-lg relative">
            {data.orf_details.slice(0, 20).map((orf: any, index: number) => {
              const startPercent = (orf.start / length) * 100;
              const widthPercent = ((orf.end - orf.start) / length) * 100;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="absolute top-4 h-8 bg-green-500 hover:bg-green-400 transition rounded cursor-pointer group"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`
                  }}
                  title={`ORF: ${orf.start}-${orf.end} (${orf.length} bp)`}
                >
                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-green-500/50">
                    {orf.start}-{orf.end} ({orf.length} bp)
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CircularGenomeView({ data }: { data: any }) {
  const length = data.length || 0;

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-96 h-96">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Outer circle - chromosome */}
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="20"
            className="opacity-30"
          />

          {/* GC Content ring */}
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="15"
            strokeDasharray={`${(data.gc_content?.gc_percentage || 50) * 9.42} ${1000 - (data.gc_content?.gc_percentage || 50) * 9.42}`}
            transform="rotate(-90 200 200)"
            className="opacity-75"
          />

          {/* Inner ring - AT Content */}
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="#ef4444"
            strokeWidth="15"
            strokeDasharray={`${(data.gc_content?.at_percentage || 50) * 7.54} ${1000 - (data.gc_content?.at_percentage || 50) * 7.54}`}
            transform="rotate(-90 200 200)"
            className="opacity-50"
          />

          {/* Center text */}
          <text x="200" y="190" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold">
            {data.name?.slice(0, 15)}
          </text>
          <text x="200" y="215" textAnchor="middle" fill="#9ca3af" fontSize="14">
            {length.toLocaleString()} bp
          </text>

          {/* ORF markers */}
          {data.orf_details?.slice(0, 12).map((orf: any, index: number) => {
            const angle = (orf.start / length) * 360 - 90;
            const x = 200 + 145 * Math.cos((angle * Math.PI) / 180);
            const y = 200 + 145 * Math.sin((angle * Math.PI) / 180);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="5"
                fill="#10b981"
                className="hover:r-8 transition-all cursor-pointer"
              />
            );
          })}
        </svg>

        {/* Animated DNA helix in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 -z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <path
                d="M 200,50 Q 250,100 200,150 T 200,250 T 200,350"
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 200,50 Q 150,100 200,150 T 200,250 T 200,350"
                stroke="#8b5cf6"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
