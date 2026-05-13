'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, FileImage, FileText, Printer, Check } from 'lucide-react';
import { BusinessCardDesign, ExportOptions } from '@/types/business-card.types';
import { toast } from 'react-hot-toast';

interface ExportModalProps {
  design: BusinessCardDesign;
  onClose: () => void;
}

export default function ExportModal({ design, onClose }: ExportModalProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    quality: 100,
    dpi: 300,
    includeBleed: false,
    side: 'both',
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // TODO: Implement actual export logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Exported as ${exportOptions.format.toUpperCase()}!`);
      onClose();
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Export Business Card</h2>
            <p className="text-sm text-gray-400 mt-1">Choose your export settings</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="text-white font-semibold mb-3 block">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'png', label: 'PNG', icon: FileImage, desc: 'High quality image' },
                { value: 'jpg', label: 'JPG', icon: FileImage, desc: 'Compressed image' },
                { value: 'pdf', label: 'PDF', icon: FileText, desc: 'Print ready' },
              ].map((format) => {
                const Icon = format.icon;
                const isSelected = exportOptions.format === format.value;
                return (
                  <button
                    key={format.value}
                    onClick={() => setExportOptions({ ...exportOptions, format: format.value as any })}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                    <div className={`font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {format.label}
                    </div>
                    <div className="text-xs text-gray-400">{format.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side Selection */}
          <div>
            <label className="text-white font-semibold mb-3 block">Export Side</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'front', label: 'Front Only' },
                { value: 'back', label: 'Back Only' },
                { value: 'both', label: 'Both Sides' },
              ].map((side) => {
                const isSelected = exportOptions.side === side.value;
                return (
                  <button
                    key={side.value}
                    onClick={() => setExportOptions({ ...exportOptions, side: side.value as any })}
                    className={`p-3 rounded-xl border-2 transition-all font-medium ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {side.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality Settings */}
          {exportOptions.format !== 'pdf' && (
            <div>
              <label className="text-white font-semibold mb-3 block">
                Quality: {exportOptions.quality}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="10"
                value={exportOptions.quality}
                onChange={(e) => setExportOptions({ ...exportOptions, quality: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Lower file size</span>
                <span>Higher quality</span>
              </div>
            </div>
          )}

          {/* DPI Settings */}
          <div>
            <label className="text-white font-semibold mb-3 block">Resolution (DPI)</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 150, label: '150 DPI', desc: 'Screen' },
                { value: 300, label: '300 DPI', desc: 'Print' },
                { value: 600, label: '600 DPI', desc: 'High-end' },
              ].map((dpi) => {
                const isSelected = exportOptions.dpi === dpi.value;
                return (
                  <button
                    key={dpi.value}
                    onClick={() => setExportOptions({ ...exportOptions, dpi: dpi.value })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold">{dpi.label}</div>
                    <div className="text-xs">{dpi.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Print Options */}
          {exportOptions.format === 'pdf' && (
            <div>
              <label className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={exportOptions.includeBleed}
                  onChange={(e) => setExportOptions({ ...exportOptions, includeBleed: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="text-white font-medium">Include Bleed Margins</div>
                  <div className="text-xs text-gray-400">Add 3mm bleed for professional printing</div>
                </div>
                <Printer className="w-5 h-5 text-gray-400" />
              </label>
            </div>
          )}

          {/* Export Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileImage className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium mb-1">Export Details</div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Format: {exportOptions.format.toUpperCase()}</div>
                  <div>Resolution: {exportOptions.dpi} DPI</div>
                  <div>Size: 85mm × 55mm (Standard Business Card)</div>
                  {exportOptions.side === 'both' && <div>Sides: Front & Back</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
