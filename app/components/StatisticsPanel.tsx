'use client';

import { motion } from 'framer-motion';

interface StatisticsPanelProps {
  data: any;
}

export default function StatisticsPanel({ data }: StatisticsPanelProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Detailed Statistics</h3>

      {/* Base Statistics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sequence Information */}
        <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/20">
          <h4 className="text-lg font-semibold text-white mb-4">Sequence Information</h4>
          <div className="space-y-3">
            <StatItem label="Name" value={data.name} />
            <StatItem label="Type" value={data.sequence_type?.toUpperCase()} />
            <StatItem label="Length" value={`${data.length?.toLocaleString()} bp`} />
            <StatItem label="Unique Bases" value={data.statistics?.unique_bases} />
            {data.molecular_weight && (
              <StatItem label="Molecular Weight" value={`${data.molecular_weight.toLocaleString()} g/mol`} />
            )}
          </div>
        </div>

        {/* GC/AT Content */}
        {data.gc_content && (
          <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/20">
            <h4 className="text-lg font-semibold text-white mb-4">GC/AT Content</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">GC Content</span>
                  <span className="text-white font-semibold">{data.gc_content.gc_percentage}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.gc_content.gc_percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                  ></motion.div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">AT Content</span>
                  <span className="text-white font-semibold">{data.gc_content.at_percentage}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.gc_content.at_percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                  ></motion.div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700">
                <div>
                  <div className="text-xs text-gray-400">G Count</div>
                  <div className="text-lg text-white font-semibold">{data.gc_content.g_count}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">C Count</div>
                  <div className="text-lg text-white font-semibold">{data.gc_content.c_count}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Base Composition */}
      {data.composition && (
        <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/20">
          <h4 className="text-lg font-semibold text-white mb-4">Base Composition</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(data.composition).map(([base, info]: [string, any], index) => (
              <motion.div
                key={base}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-800 rounded-lg text-center"
              >
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {base}
                </div>
                <div className="text-2xl text-white font-semibold mb-1">
                  {info.count}
                </div>
                <div className="text-sm text-gray-400 mb-3">
                  {info.percentage}%
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${info.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 + 0.5 }}
                    className={`h-full ${getBaseColor(base)}`}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ORF Statistics */}
      {data.orf_details && data.orf_details.length > 0 && (
        <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/20">
          <h4 className="text-lg font-semibold text-white mb-4">ORF Statistics</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Total ORFs</div>
              <div className="text-2xl text-white font-bold">{data.orfs_found}</div>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Longest ORF</div>
              <div className="text-2xl text-white font-bold">
                {Math.max(...data.orf_details.map((o: any) => o.length))} bp
              </div>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Average Length</div>
              <div className="text-2xl text-white font-bold">
                {Math.round(
                  data.orf_details.reduce((sum: number, o: any) => sum + o.length, 0) / data.orf_details.length
                )} bp
              </div>
            </div>
          </div>

          {/* ORF Distribution by Frame */}
          <div>
            <div className="text-sm text-gray-300 mb-3">ORF Distribution by Reading Frame</div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((frame) => {
                const frameORFs = data.orf_details.filter((o: any) => o.frame === frame);
                const percentage = (frameORFs.length / data.orf_details.length) * 100;
                return (
                  <div key={frame} className="p-3 bg-slate-800 rounded-lg">
                    <div className="text-xs text-gray-400 mb-2">Frame {frame}</div>
                    <div className="text-lg text-white font-semibold mb-2">{frameORFs.length}</div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Summary */}
      <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30">
        <h4 className="text-lg font-semibold text-white mb-4">Analysis Summary</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🧬</div>
            <div>
              <div className="text-gray-300 mb-1">
                This sequence is <strong className="text-white">{data.length?.toLocaleString()} base pairs</strong> long
                with a GC content of <strong className="text-white">{data.gc_content?.gc_percentage}%</strong>.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔬</div>
            <div>
              <div className="text-gray-300 mb-1">
                Found <strong className="text-white">{data.orfs_found || 0} potential genes</strong> (ORFs)
                across all reading frames.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function getBaseColor(base: string): string {
  const colors: Record<string, string> = {
    'A': 'bg-green-500',
    'T': 'bg-red-500',
    'G': 'bg-blue-500',
    'C': 'bg-yellow-500',
    'U': 'bg-red-500',
    'N': 'bg-gray-500'
  };
  return colors[base] || 'bg-purple-500';
}
