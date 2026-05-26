'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function UploadLogoCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem('qc_uploaded_logo', reader.result as string);
        toast.success('Logo uploaded — pick a template to customize');
        router.push('/business-cards/editor/new');
      } catch {
        toast.error('Could not save logo');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className={`aspect-[1.75] w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 px-4 text-center transition-colors ${
        dragOver
          ? 'border-brand-500 bg-brand-50'
          : 'border-gray-300 bg-white hover:border-brand-400 hover:bg-gray-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <Upload className="w-8 h-8 text-gray-400" />
      <span className="text-sm font-semibold text-gray-700">Upload your logo</span>
      <span className="text-xs text-gray-500 leading-snug">
        Drop your file here or click to upload
      </span>
    </button>
  );
}
