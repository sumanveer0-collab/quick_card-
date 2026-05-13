'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BusinessCardEditor from '@/components/business-cards/BusinessCardEditor';
import { businessCardTemplates } from '@/lib/business-cards/templates';
import { BusinessCardDesign } from '@/types/business-card.types';

export default function BusinessCardEditorPage() {
  const params = useParams();
  const templateId = params.id as string;
  const [design, setDesign] = useState<BusinessCardDesign | null>(null);

  useEffect(() => {
    if (templateId === 'new') {
      // Create blank design
      setDesign({
        templateId: 'blank',
        title: 'Untitled Business Card',
        front: {
          background: { type: 'solid', color: '#ffffff' },
          elements: [],
        },
        back: {
          background: { type: 'solid', color: '#ffffff' },
          elements: [],
        },
        metadata: {
          width: 85,
          height: 55,
          unit: 'mm',
          dpi: 300,
        },
      });
    } else {
      // Load template
      const template = businessCardTemplates.find(t => t.id === templateId);
      if (template) {
        setDesign({
          templateId: template.id,
          title: template.title,
          front: JSON.parse(JSON.stringify(template.front)),
          back: JSON.parse(JSON.stringify(template.back)),
          metadata: {
            width: 85,
            height: 55,
            unit: 'mm',
            dpi: 300,
          },
        });
      }
    }
  }, [templateId]);

  if (!design) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading editor...</div>
      </div>
    );
  }

  return <BusinessCardEditor initialDesign={design} />;
}
