import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template, TemplateDocument, TemplateCategory } from './schemas/template.schema';
import { CreateTemplateDto } from './dto/create-template.dto';

// ─── Template HTML Definitions ───────────────────────────────────────────────
// Each template has a frontHTML and backHTML with {{placeholder}} tokens.
// Back faces include a QR block: shows <img> when {{qrCodeUrl}} is non-empty,
// falls back to a dashed 48x48 placeholder box when empty.

// ═══════════════════════════════════════════════════════════════════════════════
// LOGO CENTER TEMPLATE — matches Koush Consult reference style
// Front: logo top-left + contact details right side
// Back: logo + company name centered, clean white
// ═══════════════════════════════════════════════════════════════════════════════

const logoCenterFront = `<div style="width:100%;height:100%;background:#ffffff;font-family:'Inter',sans-serif;padding:18px 22px;box-sizing:border-box;display:flex;flex-direction:row;align-items:stretch;position:relative;overflow:hidden;">
  <!-- Background decoration: subtle dot grid -->
  <div style="position:absolute;inset:0;background-image:radial-gradient(circle,#e5e7eb 1px,transparent 1px);background-size:14px 14px;opacity:0.5;pointer-events:none;"></div>

  <!-- LEFT: Logo block -->
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:38%;padding-right:16px;border-right:1px solid #f1f5f9;position:relative;z-index:1;">
    <!-- Logo image (shown when logoUrl is set) -->
    <img src="{{logoUrl}}" alt="Logo" style="width:56px;height:56px;object-fit:contain;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
    <!-- Logo placeholder (shown when no logo) -->
    <div style="width:56px;height:56px;border-radius:12px;background:linear-gradient(135deg,#3b82f6,#6366f1);display:none;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#fff;letter-spacing:-1px;">{{businessName}}</div>
    <!-- Company name below logo -->
    <div style="margin-top:8px;text-align:center;">
      <div style="font-size:11px;font-weight:800;color:#1f2937;letter-spacing:0.5px;text-transform:uppercase;line-height:1.2;">{{businessName}}</div>
      <div style="font-size:7px;color:#6b7280;letter-spacing:2px;text-transform:uppercase;margin-top:2px;">{{tagline}}</div>
    </div>
  </div>

  <!-- RIGHT: Contact details -->
  <div style="flex:1;padding-left:16px;display:flex;flex-direction:column;justify-content:center;gap:0;position:relative;z-index:1;">
    <div style="font-size:13px;font-weight:700;color:#111827;line-height:1.2;margin-bottom:2px;">{{name}}</div>
    <div style="font-size:8px;color:#6b7280;margin-bottom:10px;font-style:italic;">{{tagline}}</div>
    <div style="display:flex;flex-direction:column;gap:5px;">
      <div style="display:flex;align-items:center;gap:5px;font-size:8.5px;color:#374151;">
        <span style="width:14px;height:14px;border-radius:50%;background:#3b82f6;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;font-size:7px;">📞</span>
        <span>{{phone}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:5px;font-size:8.5px;color:#374151;">
        <span style="width:14px;height:14px;border-radius:50%;background:#10b981;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;font-size:7px;">✉</span>
        <span>{{email}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:5px;font-size:8.5px;color:#374151;">
        <span style="width:14px;height:14px;border-radius:50%;background:#8b5cf6;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;font-size:7px;">🌐</span>
        <span>{{website}}</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:5px;font-size:8.5px;color:#374151;">
        <span style="width:14px;height:14px;border-radius:50%;background:#f59e0b;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;font-size:7px;margin-top:1px;">📍</span>
        <span style="white-space:normal;word-break:break-word;line-height:1.4;">{{address}}</span>
      </div>
    </div>
  </div>
</div>`;

const logoCenterBack = `<div style="width:100%;height:100%;background:#ffffff;font-family:'Inter',sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <!-- Background decoration: subtle dot grid -->
  <div style="position:absolute;inset:0;background-image:radial-gradient(circle,#e5e7eb 1px,transparent 1px);background-size:14px 14px;opacity:0.5;pointer-events:none;"></div>

  <!-- Centered logo block -->
  <div style="display:flex;flex-direction:column;align-items:center;gap:10px;position:relative;z-index:1;">
    <!-- Logo image -->
    <img src="{{logoUrl}}" alt="Logo" style="width:72px;height:72px;object-fit:contain;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
    <!-- Logo placeholder -->
    <div style="width:72px;height:72px;border-radius:16px;background:linear-gradient(135deg,#3b82f6,#6366f1);display:none;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#fff;letter-spacing:-1px;">{{businessName}}</div>
    <!-- Company name -->
    <div style="text-align:center;">
      <div style="font-size:14px;font-weight:800;color:#1f2937;letter-spacing:1px;text-transform:uppercase;">{{businessName}}</div>
      <div style="font-size:7px;color:#9ca3af;letter-spacing:3px;text-transform:uppercase;margin-top:3px;">{{tagline}}</div>
    </div>
  </div>
</div>`;

const minimalWhiteLuxuryFront = `<div style="width:100%;height:100%;background:#ffffff;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;border-left:4px solid #2563EB;box-shadow:0 4px 24px rgba(37,99,235,0.08);">
  <div>
    <div style="font-size:17px;font-weight:800;color:#1a1a1a;letter-spacing:-0.5px;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#2563EB;margin-top:4px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">{{tagline}}</div>
    <div style="width:32px;height:2px;background:#2563EB;margin-top:8px;border-radius:2px;"></div>
    <div style="font-size:12px;font-weight:700;color:#374151;margin-top:8px;">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#6b7280;display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#6b7280;display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#6b7280;display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#6b7280;display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const minimalWhiteLuxuryBack = `<div style="width:100%;height:100%;background:#f8fafc;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;border-left:4px solid #2563EB;">
  <div>
    <div style="font-size:14px;font-weight:800;color:#1a1a1a;">{{businessName}}</div>
    <div style="width:28px;height:2px;background:#2563EB;margin-top:6px;border-radius:2px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#6b7280;display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#6b7280;display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#6b7280;display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#6b7280;display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed #cbd5e1;border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:#94a3b8;">QR</div>
    </div>
  </div>
</div>`;

const slateDarkFront = `<div style="width:100%;height:100%;background:#1e293b;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#38bdf8,#0ea5e9);"></div>
  <div>
    <div style="font-size:17px;font-weight:800;color:#f8fafc;letter-spacing:-0.3px;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#38bdf8;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#cbd5e1;margin-top:10px;padding-top:8px;border-top:1px solid rgba(56,189,248,0.2);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#38bdf8;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#38bdf8;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#38bdf8;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#38bdf8;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const slateDarkBack = `<div style="width:100%;height:100%;background:#0f172a;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#38bdf8,#0ea5e9);"></div>
  <div>
    <div style="font-size:14px;font-weight:800;color:#f8fafc;">{{businessName}}</div>
    <div style="font-size:8px;color:#38bdf8;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">{{tagline}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#38bdf8;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#38bdf8;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#38bdf8;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#38bdf8;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(56,189,248,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(56,189,248,0.4);">QR</div>
    </div>
  </div>
</div>`;

const softGrayFront = `<div style="width:100%;height:100%;background:#f1f5f9;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;">
  <div style="position:absolute;top:0;right:0;width:80px;height:80px;background:linear-gradient(135deg,#6366f1,#8b5cf6);opacity:0.12;border-radius:0 0 0 80px;"></div>
  <div>
    <div style="font-size:17px;font-weight:800;color:#334155;letter-spacing:-0.3px;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#6366f1;margin-top:4px;font-weight:600;letter-spacing:0.5px;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#475569;margin-top:10px;">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#64748b;display:flex;align-items:flex-start;gap:5px;"><span style="color:#6366f1;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#64748b;display:flex;align-items:flex-start;gap:5px;"><span style="color:#6366f1;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#64748b;display:flex;align-items:flex-start;gap:5px;"><span style="color:#6366f1;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#64748b;display:flex;align-items:flex-start;gap:5px;"><span style="color:#6366f1;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const softGrayBack = `<div style="width:100%;height:100%;background:#e2e8f0;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
  <div>
    <div style="font-size:14px;font-weight:800;color:#334155;">{{businessName}}</div>
    <div style="width:28px;height:3px;background:#6366f1;margin-top:6px;border-radius:2px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#64748b;display:flex;align-items:flex-start;gap:5px;"><span style="color:#6366f1;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#64748b;display:flex;align-items:flex-start;gap:5px;"><span style="color:#6366f1;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#64748b;display:flex;align-items:flex-start;gap:5px;"><span style="color:#6366f1;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#64748b;display:flex;align-items:flex-start;gap:5px;"><span style="color:#6366f1;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed #94a3b8;border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:#94a3b8;">QR</div>
    </div>
  </div>
</div>`;

const ivoryMinimalFront = `<div style="width:100%;height:100%;background:#fafaf8;font-family:'Georgia',serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;border-bottom:3px solid #d97706;">
  <div>
    <div style="font-size:17px;font-weight:800;color:#1c1917;letter-spacing:0.3px;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#d97706;margin-top:4px;font-style:italic;letter-spacing:0.5px;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#44403c;margin-top:10px;font-style:italic;">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#78716c;display:flex;align-items:flex-start;gap:5px;font-family:'Inter',sans-serif;"><span style="color:#d97706;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#78716c;display:flex;align-items:flex-start;gap:5px;font-family:'Inter',sans-serif;"><span style="color:#d97706;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#78716c;display:flex;align-items:flex-start;gap:5px;font-family:'Inter',sans-serif;"><span style="color:#d97706;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#78716c;display:flex;align-items:flex-start;gap:5px;font-family:'Inter',sans-serif;"><span style="color:#d97706;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const ivoryMinimalBack = `<div style="width:100%;height:100%;background:#f5f5f0;font-family:'Georgia',serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;border-bottom:3px solid #d97706;">
  <div>
    <div style="font-size:14px;font-weight:800;color:#1c1917;">{{businessName}}</div>
    <div style="font-size:8px;color:#d97706;margin-top:4px;font-style:italic;">{{tagline}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;font-family:'Inter',sans-serif;">
    <div style="font-size:9px;color:#78716c;display:flex;align-items:flex-start;gap:5px;"><span style="color:#d97706;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#78716c;display:flex;align-items:flex-start;gap:5px;"><span style="color:#d97706;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#78716c;display:flex;align-items:flex-start;gap:5px;"><span style="color:#d97706;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#78716c;display:flex;align-items:flex-start;gap:5px;"><span style="color:#d97706;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed #d97706;border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:#d97706;">QR</div>
    </div>
  </div>
</div>`;

// ═══════════════════════════════════════════════════════════════════════════════
// GROUP 2: GRADIENT MODERN (4 templates) — gradient backgrounds, Poppins font
// ═══════════════════════════════════════════════════════════════════════════════

const gradientProFront = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.1);"></div>
  <div style="position:absolute;bottom:-20px;left:-20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.08);"></div>
  <div>
    <div style="font-size:17px;font-weight:800;color:#ffffff;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:rgba(255,255,255,0.75);margin-top:4px;font-style:italic;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.9);margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.2);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const gradientProBack = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#764ba2 0%,#667eea 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:-40px;left:-40px;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,0.06);"></div>
  <div>
    <div style="font-size:14px;font-weight:800;color:#ffffff;">{{businessName}}</div>
    <div style="width:28px;height:2px;background:rgba(255,255,255,0.5);margin-top:6px;border-radius:2px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(255,255,255,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(255,255,255,0.4);">QR</div>
    </div>
  </div>
</div>`;

const purpleGradientFront = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#7c3aed 0%,#db2777 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;right:0;width:100px;height:100px;background:rgba(255,255,255,0.07);border-radius:0 0 0 100px;"></div>
  <div>
    <div style="font-size:17px;font-weight:800;color:#ffffff;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:rgba(255,255,255,0.7);margin-top:4px;letter-spacing:0.5px;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#fce7f3;margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.2);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const purpleGradientBack = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#db2777 0%,#7c3aed 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
  <div>
    <div style="font-size:14px;font-weight:800;color:#ffffff;">{{businessName}}</div>
    <div style="font-size:8px;color:rgba(255,255,255,0.7);margin-top:4px;">{{tagline}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:rgba(255,255,255,0.85);display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(255,255,255,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(255,255,255,0.4);">QR</div>
    </div>
  </div>
</div>`;

const sunsetOrangeFront = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#ea580c 0%,#dc2626 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;bottom:0;right:0;width:120px;height:120px;background:rgba(255,255,255,0.06);border-radius:120px 0 0 0;"></div>
  <div>
 v vvvvv    <div style="font-size:17px;font-weight:800;color:#fff7ed;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#fed7aa;margin-top:4px;letter-spacing:0.5px;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#ffedd5;margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.2);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#ffedd5;display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#ffedd5;display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#ffedd5;display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#ffedd5;display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const sunsetOrangeBack = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#dc2626 0%,#ea580c 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
  <div>
    <div style="font-size:14px;font-weight:800;color:#fff7ed;">{{businessName}}</div>
    <div style="font-size:8px;color:#fed7aa;margin-top:4px;">{{tagline}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#ffedd5;display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#ffedd5;display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#ffedd5;display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#ffedd5;display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(255,255,255,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(255,255,255,0.4);">QR</div>
    </div>
  </div>
</div>`;

const oceanBlueFront = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#0369a1 0%,#0891b2 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.08);"></div>
  <div style="position:absolute;bottom:-30px;left:-10px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.05);"></div>
  <div>
    <div style="font-size:17px;font-weight:800;color:#e0f2fe;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#bae6fd;margin-top:4px;letter-spacing:0.5px;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#e0f2fe;margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.2);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#e0f2fe;display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#e0f2fe;display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#e0f2fe;display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#e0f2fe;display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const oceanBlueBack = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#0891b2 0%,#0369a1 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
  <div>
    <div style="font-size:14px;font-weight:800;color:#e0f2fe;">{{businessName}}</div>
    <div style="font-size:8px;color:#bae6fd;margin-top:4px;">{{tagline}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#e0f2fe;display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#e0f2fe;display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#e0f2fe;display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#e0f2fe;display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(255,255,255,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(255,255,255,0.4);">QR</div>
    </div>
  </div>
</div>`;

// ═══════════════════════════════════════════════════════════════════════════════
// PREMIUM MODERN BUSINESS CARD — Ocean Blue Premium with Glassmorphism
// Smooth gradient background, modern corporate layout, professional print-ready
// ═══════════════════════════════════════════════════════════════════════════════

const oceanBluePremiumFront = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#0369a1 0%,#0891b2 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.15);">
  <!-- Glassmorphism overlay circle on top-right -->
  <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.12);filter:blur(20px);"></div>
  
  <!-- Logo container at top-right with glassmorphism -->
  <div style="position:absolute;top:16px;right:16px;width:52px;height:52px;border-radius:12px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:6px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    <img src="{{logoUrl}}" alt="Logo" style="width:100%;height:100%;object-fit:contain;border-radius:8px;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
    <div style="width:100%;height:100%;border-radius:8px;background:linear-gradient(135deg,#fbbf24,#f59e0b);display:none;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;letter-spacing:-1px;">{{businessName}}</div>
  </div>

  <!-- Business name at top-left -->
  <div style="padding-right:60px;">
    <div style="font-size:17px;font-weight:700;color:#e0f2fe;line-height:1.2;letter-spacing:-0.3px;">{{businessName}}</div>
    <div style="font-size:9px;color:rgba(224,242,254,0.7);margin-top:4px;letter-spacing:0.5px;font-style:italic;">{{tagline}}</div>
    <!-- Horizontal divider line -->
    <div style="width:48px;height:2px;background:#fbbf24;margin-top:8px;border-radius:2px;box-shadow:0 2px 8px rgba(251,191,36,0.3);"></div>
  </div>

  <!-- Contact details aligned vertically -->
  <div style="display:flex;flex-direction:column;gap:5px;">
    <div style="font-size:10px;color:#e0f2fe;font-weight:500;display:flex;align-items:center;gap:6px;">
      <span style="width:16px;height:16px;border-radius:50%;background:rgba(251,191,36,0.2);display:inline-flex;align-items:center;justify-content:center;font-size:8px;color:#fbbf24;">📞</span>
      <span>{{phone}}</span>
    </div>
    <div style="font-size:10px;color:#e0f2fe;font-weight:500;display:flex;align-items:center;gap:6px;">
      <span style="width:16px;height:16px;border-radius:50%;background:rgba(251,191,36,0.2);display:inline-flex;align-items:center;justify-content:center;font-size:8px;color:#fbbf24;">✉</span>
      <span>{{email}}</span>
    </div>
    <div style="font-size:10px;color:#e0f2fe;font-weight:500;display:flex;align-items:center;gap:6px;">
      <span style="width:16px;height:16px;border-radius:50%;background:rgba(251,191,36,0.2);display:inline-flex;align-items:center;justify-content:center;font-size:8px;color:#fbbf24;">🌐</span>
      <span>{{website}}</span>
    </div>
    <div style="font-size:10px;color:#e0f2fe;font-weight:500;display:flex;align-items:flex-start;gap:6px;">
      <span style="width:16px;height:16px;border-radius:50%;background:rgba(251,191,36,0.2);display:inline-flex;align-items:center;justify-content:center;font-size:8px;color:#fbbf24;flex-shrink:0;margin-top:1px;">📍</span>
      <span style="white-space:normal;word-break:break-word;line-height:1.4;">{{address}}</span>
    </div>
  </div>
</div>`;

const oceanBluePremiumBack = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#0891b2 0%,#0369a1 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.15);">
  <!-- Subtle background glow -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.08);filter:blur(40px);"></div>
  
  <!-- Centered logo with glassmorphism container -->
  <div style="display:flex;flex-direction:column;align-items:center;gap:12px;position:relative;z-index:1;">
    <div style="width:68px;height:68px;border-radius:16px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:8px;box-shadow:0 8px 24px rgba(0,0,0,0.15);">
      <img src="{{logoUrl}}" alt="Logo" style="width:100%;height:100%;object-fit:contain;border-radius:12px;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
      <div style="width:100%;height:100%;border-radius:12px;background:linear-gradient(135deg,#fbbf24,#f59e0b);display:none;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#fff;letter-spacing:-1px;">{{businessName}}</div>
    </div>
    
    <!-- Company name and tagline -->
    <div style="text-align:center;">
      <div style="font-size:14px;font-weight:700;color:#e0f2fe;letter-spacing:0.5px;text-transform:uppercase;">{{businessName}}</div>
      <div style="font-size:7px;color:rgba(224,242,254,0.7);letter-spacing:2px;text-transform:uppercase;margin-top:3px;">{{tagline}}</div>
    </div>
    
    <!-- QR Code section -->
    <div style="margin-top:8px;display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:52px;height:52px;border-radius:8px;display:block;background:#fff;padding:3px;box-shadow:0 4px 12px rgba(0,0,0,0.1);" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:52px;height:52px;border:2px dashed rgba(251,191,36,0.4);border-radius:8px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(251,191,36,0.5);background:rgba(255,255,255,0.05);">QR</div>
    </div>
  </div>
</div>`;

// ═══════════════════════════════════════════════════════════════════════════════
// GROUP 3: DARK PREMIUM (4 templates) — dark backgrounds, Montserrat font
// ═══════════════════════════════════════════════════════════════════════════════

const darkLuxuryFront = `<div style="width:100%;height:100%;background:#0f0f0f;font-family:'Montserrat',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;right:0;width:3px;height:100%;background:linear-gradient(to bottom,#f59e0b,#d97706);"></div>
  <div style="position:absolute;top:0;right:0;width:60px;height:60px;background:linear-gradient(135deg,#f59e0b,transparent);opacity:0.1;"></div>
  <div>
    <div style="font-size:16px;font-weight:800;color:#ffffff;letter-spacing:0.5px;text-transform:uppercase;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:8px;color:#f59e0b;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#d1d5db;margin-top:10px;">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#9ca3af;display:flex;align-items:flex-start;gap:5px;"><span style="color:#f59e0b;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#9ca3af;display:flex;align-items:flex-start;gap:5px;"><span style="color:#f59e0b;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#9ca3af;display:flex;align-items:flex-start;gap:5px;"><span style="color:#f59e0b;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#9ca3af;display:flex;align-items:flex-start;gap:5px;"><span style="color:#f59e0b;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const darkLuxuryBack = `<div style="width:100%;height:100%;background:#0f0f0f;font-family:'Montserrat',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;right:0;width:3px;height:100%;background:linear-gradient(to bottom,#f59e0b,#d97706);"></div>
  <div>
    <div style="font-size:14px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;">{{businessName}}</div>
    <div style="width:28px;height:2px;background:#f59e0b;margin-top:6px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#9ca3af;display:flex;align-items:flex-start;gap:5px;"><span style="color:#f59e0b;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#9ca3af;display:flex;align-items:flex-start;gap:5px;"><span style="color:#f59e0b;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#9ca3af;display:flex;align-items:flex-start;gap:5px;"><span style="color:#f59e0b;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#9ca3af;display:flex;align-items:flex-start;gap:5px;"><span style="color:#f59e0b;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(245,158,11,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(245,158,11,0.4);">QR</div>
    </div>
  </div>
</div>`;

const neonDarkFront = `<div style="width:100%;height:100%;background:#09090b;font-family:'Montserrat',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#00ff88,transparent);"></div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#00ff88,transparent);opacity:0.4;"></div>
  <div>
    <div style="font-size:16px;font-weight:800;color:#00ff88;letter-spacing:0.5px;line-height:1.2;text-shadow:0 0 20px rgba(0,255,136,0.4);">{{businessName}}</div>
    <div style="font-size:9px;color:#4ade80;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#d4d4d8;margin-top:10px;padding-top:8px;border-top:1px solid rgba(0,255,136,0.15);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#a1a1aa;display:flex;align-items:flex-start;gap:5px;"><span style="color:#00ff88;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#a1a1aa;display:flex;align-items:flex-start;gap:5px;"><span style="color:#00ff88;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#a1a1aa;display:flex;align-items:flex-start;gap:5px;"><span style="color:#00ff88;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#a1a1aa;display:flex;align-items:flex-start;gap:5px;"><span style="color:#00ff88;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const neonDarkBack = `<div style="width:100%;height:100%;background:#09090b;font-family:'Montserrat',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#00ff88,transparent);"></div>
  <div>
    <div style="font-size:14px;font-weight:800;color:#00ff88;text-shadow:0 0 20px rgba(0,255,136,0.4);">{{businessName}}</div>
    <div style="font-size:8px;color:#4ade80;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">{{tagline}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#a1a1aa;display:flex;align-items:flex-start;gap:5px;"><span style="color:#00ff88;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#a1a1aa;display:flex;align-items:flex-start;gap:5px;"><span style="color:#00ff88;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#a1a1aa;display:flex;align-items:flex-start;gap:5px;"><span style="color:#00ff88;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#a1a1aa;display:flex;align-items:flex-start;gap:5px;"><span style="color:#00ff88;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(0,255,136,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(0,255,136,0.4);">QR</div>
    </div>
  </div>
</div>`;

const navyGoldFront = `<div style="width:100%;height:100%;background:#1e3a5f;font-family:'Montserrat',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#ffd700,#f59e0b,#ffd700);"></div>
  <div style="position:absolute;bottom:0;right:0;width:80px;height:80px;background:radial-gradient(circle,rgba(255,215,0,0.1),transparent);"></div>
  <div>
    <div style="font-size:16px;font-weight:800;color:#ffd700;letter-spacing:0.5px;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#e2e8f0;margin-top:4px;letter-spacing:0.5px;font-style:italic;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#e2e8f0;margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,215,0,0.2);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#cbd5e1;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ffd700;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#cbd5e1;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ffd700;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#cbd5e1;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ffd700;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#cbd5e1;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ffd700;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const navyGoldBack = `<div style="width:100%;height:100%;background:#152a47;font-family:'Montserrat',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#ffd700,#f59e0b,#ffd700);"></div>
  <div>
    <div style="font-size:14px;font-weight:800;color:#ffd700;">{{businessName}}</div>
    <div style="font-size:8px;color:#e2e8f0;margin-top:4px;font-style:italic;">{{tagline}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#cbd5e1;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ffd700;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#cbd5e1;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ffd700;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#cbd5e1;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ffd700;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#cbd5e1;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ffd700;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(255,215,0,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(255,215,0,0.4);">QR</div>
    </div>
  </div>
</div>`;

const matteBlackGoldFront = `<div style="width:100%;height:100%;background:#111111;font-family:'Montserrat',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,rgba(201,168,76,0.03) 0px,rgba(201,168,76,0.03) 1px,transparent 1px,transparent 8px);pointer-events:none;"></div>
  <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);"></div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);"></div>
  <div>
    <div style="font-size:16px;font-weight:800;color:#c9a84c;letter-spacing:1px;text-transform:uppercase;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:8px;color:#8a7340;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#d4d4d4;margin-top:10px;">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#a3a3a3;display:flex;align-items:flex-start;gap:5px;"><span style="color:#c9a84c;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#a3a3a3;display:flex;align-items:flex-start;gap:5px;"><span style="color:#c9a84c;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#a3a3a3;display:flex;align-items:flex-start;gap:5px;"><span style="color:#c9a84c;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#a3a3a3;display:flex;align-items:flex-start;gap:5px;"><span style="color:#c9a84c;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const matteBlackGoldBack = `<div style="width:100%;height:100%;background:#111111;font-family:'Montserrat',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,rgba(201,168,76,0.03) 0px,rgba(201,168,76,0.03) 1px,transparent 1px,transparent 8px);pointer-events:none;"></div>
  <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);"></div>
  <div>
    <div style="font-size:14px;font-weight:800;color:#c9a84c;text-transform:uppercase;letter-spacing:1px;">{{businessName}}</div>
    <div style="font-size:8px;color:#8a7340;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">{{tagline}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#a3a3a3;display:flex;align-items:flex-start;gap:5px;"><span style="color:#c9a84c;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#a3a3a3;display:flex;align-items:flex-start;gap:5px;"><span style="color:#c9a84c;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#a3a3a3;display:flex;align-items:flex-start;gap:5px;"><span style="color:#c9a84c;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#a3a3a3;display:flex;align-items:flex-start;gap:5px;"><span style="color:#c9a84c;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(201,168,76,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(201,168,76,0.4);">QR</div>
    </div>
  </div>
</div>`;

// ═══════════════════════════════════════════════════════════════════════════════
// GROUP 4: CORPORATE PROFESSIONAL (4 templates) — solid colors, Inter font, CORPORATE category
// ═══════════════════════════════════════════════════════════════════════════════

const corporateBlueFront = `<div style="width:100%;height:100%;background:#1d4ed8;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;bottom:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.07);"></div>
  <div style="position:absolute;bottom:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.04);"></div>
  <div>
    <div style="font-size:17px;font-weight:800;color:#ffffff;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#bfdbfe;margin-top:4px;letter-spacing:0.5px;">{{tagline}}</div>
    <div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.2);">
      <div style="font-size:12px;font-weight:700;color:#ffffff;">{{name}}</div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const corporateBlueBack = `<div style="width:100%;height:100%;background:#1e40af;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:-50px;left:-50px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.04);"></div>
  <div>
    <div style="font-size:14px;font-weight:800;color:#ffffff;">{{businessName}}</div>
    <div style="width:28px;height:2px;background:#fbbf24;margin-top:6px;border-radius:2px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(255,255,255,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(255,255,255,0.4);">QR</div>
    </div>
  </div>
</div>`;

const forestGreenFront = `<div style="width:100%;height:100%;background:#14532d;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;right:0;width:60px;height:100%;background:rgba(255,255,255,0.03);clip-path:polygon(30% 0,100% 0,100% 100%,0 100%);"></div>
  <div>
    <div style="font-size:17px;font-weight:800;color:#f0fdf4;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#86efac;margin-top:4px;letter-spacing:0.5px;">{{tagline}}</div>
    <div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(134,239,172,0.2);">
      <div style="font-size:12px;font-weight:700;color:#dcfce7;">{{name}}</div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#bbf7d0;display:flex;align-items:flex-start;gap:5px;"><span style="color:#4ade80;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#bbf7d0;display:flex;align-items:flex-start;gap:5px;"><span style="color:#4ade80;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#bbf7d0;display:flex;align-items:flex-start;gap:5px;"><span style="color:#4ade80;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#bbf7d0;display:flex;align-items:flex-start;gap:5px;"><span style="color:#4ade80;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const forestGreenBack = `<div style="width:100%;height:100%;background:#0f3d20;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;">
  <div>
    <div style="font-size:14px;font-weight:800;color:#f0fdf4;">{{businessName}}</div>
    <div style="width:28px;height:2px;background:#4ade80;margin-top:6px;border-radius:2px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#bbf7d0;display:flex;align-items:flex-start;gap:5px;"><span style="color:#4ade80;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#bbf7d0;display:flex;align-items:flex-start;gap:5px;"><span style="color:#4ade80;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#bbf7d0;display:flex;align-items:flex-start;gap:5px;"><span style="color:#4ade80;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#bbf7d0;display:flex;align-items:flex-start;gap:5px;"><span style="color:#4ade80;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(74,222,128,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(74,222,128,0.4);">QR</div>
    </div>
  </div>
</div>`;

const trustBlueFront = `<div style="width:100%;height:100%;background:#1e40af;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:#fbbf24;"></div>
  <div style="padding-left:10px;">
    <div style="font-size:17px;font-weight:800;color:#eff6ff;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#bfdbfe;margin-top:4px;letter-spacing:0.5px;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#eff6ff;margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.15);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;padding-left:10px;">
    <div style="font-size:10px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const trustBlueBack = `<div style="width:100%;height:100%;background:#1e3a8a;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:#fbbf24;"></div>
  <div style="padding-left:10px;">
    <div style="font-size:14px;font-weight:800;color:#eff6ff;">{{businessName}}</div>
    <div style="font-size:8px;color:#bfdbfe;margin-top:4px;">{{tagline}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;padding-left:10px;">
    <div style="font-size:9px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#bfdbfe;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(251,191,36,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(251,191,36,0.4);">QR</div>
    </div>
  </div>
</div>`;

const corporateSlateFront = `<div style="width:100%;height:100%;background:#1e293b;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;right:0;width:80px;height:80px;background:rgba(251,191,36,0.08);clip-path:polygon(100% 0,0 0,100% 100%);"></div>
  <div>
    <div style="font-size:17px;font-weight:800;color:#f8fafc;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#fbbf24;margin-top:4px;letter-spacing:0.5px;font-weight:600;">{{tagline}}</div>
    <div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(251,191,36,0.2);">
      <div style="font-size:12px;font-weight:700;color:#e2e8f0;">{{name}}</div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const corporateSlateBack = `<div style="width:100%;height:100%;background:#0f172a;font-family:'Inter',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;right:0;width:80px;height:80px;background:rgba(251,191,36,0.06);clip-path:polygon(100% 0,0 0,100% 100%);"></div>
  <div>
    <div style="font-size:14px;font-weight:800;color:#f8fafc;">{{businessName}}</div>
    <div style="width:28px;height:2px;background:#fbbf24;margin-top:6px;border-radius:2px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#fbbf24;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(251,191,36,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(251,191,36,0.4);">QR</div>
    </div>
  </div>
</div>`;

// ═══════════════════════════════════════════════════════════════════════════════
// GROUP 5: CREATIVE DESIGNER (4 templates) — creative/colorful, Poppins font
// ═══════════════════════════════════════════════════════════════════════════════

const creativeDesignerFront = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:8px;right:8px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,rgba(233,69,96,0.5),transparent);filter:blur(12px);"></div>
  <div style="position:absolute;bottom:8px;left:8px;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,0.4),transparent);filter:blur(8px);"></div>
  <div>
    <div style="font-size:16px;font-weight:800;color:#ffffff;line-height:1.2;background:linear-gradient(90deg,#e94560,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{businessName}}</div>
    <div style="font-size:9px;color:#a78bfa;margin-top:4px;letter-spacing:1px;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#e2e8f0;margin-top:10px;padding-top:8px;border-top:1px solid rgba(233,69,96,0.2);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#e94560;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#e94560;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#e94560;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#e94560;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const creativeDesignerBack = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#0f3460 0%,#16213e 50%,#1a1a2e 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div>
    <div style="font-size:14px;font-weight:800;color:#ffffff;background:linear-gradient(90deg,#e94560,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{businessName}}</div>
    <div style="width:28px;height:2px;background:linear-gradient(90deg,#e94560,#a855f7);margin-top:6px;border-radius:2px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#e94560;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#e94560;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#e94560;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#94a3b8;display:flex;align-items:flex-start;gap:5px;"><span style="color:#e94560;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(233,69,96,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(233,69,96,0.4);">QR</div>
    </div>
  </div>
</div>`;

const roseGoldFront = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#fda4af 0%,#f9a8d4 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.2);"></div>
  <div>
    <div style="font-size:17px;font-weight:800;color:#4c0519;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#9f1239;margin-top:4px;font-style:italic;letter-spacing:0.5px;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#881337;margin-top:10px;padding-top:8px;border-top:1px solid rgba(76,5,25,0.15);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#9f1239;display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#9f1239;display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#9f1239;display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#9f1239;display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const roseGoldBack = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#f9a8d4 0%,#fda4af 100%);font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;bottom:-20px;left:-20px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.2);"></div>
  <div>
    <div style="font-size:14px;font-weight:800;color:#4c0519;">{{businessName}}</div>
    <div style="width:28px;height:2px;background:#be185d;margin-top:6px;border-radius:2px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#9f1239;display:flex;align-items:flex-start;gap:5px;"><span>📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#9f1239;display:flex;align-items:flex-start;gap:5px;"><span>✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#9f1239;display:flex;align-items:flex-start;gap:5px;"><span>🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#9f1239;display:flex;align-items:flex-start;gap:5px;"><span>📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(190,24,93,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(190,24,93,0.4);">QR</div>
    </div>
  </div>
</div>`;

const powerRedFront = `<div style="width:100%;height:100%;background:#7f1d1d;font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#ef4444,#dc2626,#ef4444);"></div>
  <div style="position:absolute;bottom:0;right:0;width:100px;height:100px;background:radial-gradient(circle,rgba(239,68,68,0.15),transparent);"></div>
  <div>
    <div style="font-size:17px;font-weight:800;color:#fef2f2;line-height:1.2;letter-spacing:0.3px;">{{businessName}}</div>
    <div style="font-size:9px;color:#fca5a5;margin-top:4px;letter-spacing:0.5px;text-transform:uppercase;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#fecaca;margin-top:10px;padding-top:8px;border-top:1px solid rgba(239,68,68,0.3);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#fca5a5;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ef4444;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#fca5a5;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ef4444;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#fca5a5;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ef4444;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#fca5a5;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ef4444;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const powerRedBack = `<div style="width:100%;height:100%;background:#6b1a1a;font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#ef4444,#dc2626,#ef4444);"></div>
  <div>
    <div style="font-size:14px;font-weight:800;color:#fef2f2;">{{businessName}}</div>
    <div style="width:28px;height:2px;background:#ef4444;margin-top:6px;border-radius:2px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#fca5a5;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ef4444;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#fca5a5;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ef4444;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#fca5a5;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ef4444;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#fca5a5;display:flex;align-items:flex-start;gap:5px;"><span style="color:#ef4444;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(239,68,68,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(239,68,68,0.4);">QR</div>
    </div>
  </div>
</div>`;

const steelGrayFront = `<div style="width:100%;height:100%;background:#374151;font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;right:0;width:60px;height:60px;background:rgba(16,185,129,0.1);clip-path:polygon(100% 0,0 0,100% 100%);"></div>
  <div style="position:absolute;top:0;right:0;width:3px;height:100%;background:linear-gradient(to bottom,#10b981,#059669);"></div>
  <div>
    <div style="font-size:17px;font-weight:800;color:#f9fafb;line-height:1.2;">{{businessName}}</div>
    <div style="font-size:9px;color:#10b981;margin-top:4px;letter-spacing:0.5px;">{{tagline}}</div>
    <div style="font-size:12px;font-weight:700;color:#e5e7eb;margin-top:10px;padding-top:8px;border-top:1px solid rgba(16,185,129,0.2);">{{name}}</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:10px;color:#d1d5db;display:flex;align-items:flex-start;gap:5px;"><span style="color:#10b981;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:10px;color:#d1d5db;display:flex;align-items:flex-start;gap:5px;"><span style="color:#10b981;">✉</span><span>{{email}}</span></div>
    <div style="font-size:10px;color:#d1d5db;display:flex;align-items:flex-start;gap:5px;"><span style="color:#10b981;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:10px;color:#d1d5db;display:flex;align-items:flex-start;gap:5px;"><span style="color:#10b981;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
</div>`;

const steelGrayBack = `<div style="width:100%;height:100%;background:#1f2937;font-family:'Poppins',sans-serif;padding:20px 24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;right:0;width:3px;height:100%;background:linear-gradient(to bottom,#10b981,#059669);"></div>
  <div>
    <div style="font-size:14px;font-weight:800;color:#f9fafb;">{{businessName}}</div>
    <div style="width:28px;height:2px;background:#10b981;margin-top:6px;border-radius:2px;"></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:9px;color:#d1d5db;display:flex;align-items:flex-start;gap:5px;"><span style="color:#10b981;">📞</span><span>{{phone}}</span></div>
    <div style="font-size:9px;color:#d1d5db;display:flex;align-items:flex-start;gap:5px;"><span style="color:#10b981;">✉</span><span>{{email}}</span></div>
    <div style="font-size:9px;color:#d1d5db;display:flex;align-items:flex-start;gap:5px;"><span style="color:#10b981;">🌐</span><span>{{website}}</span></div>
    <div style="font-size:9px;color:#d1d5db;display:flex;align-items:flex-start;gap:5px;"><span style="color:#10b981;">📍</span><span style="white-space:normal;word-break:break-word;font-size:10px;">{{address}}</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <img src="{{qrCodeUrl}}" alt="QR" style="width:48px;height:48px;border-radius:6px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div style="width:48px;height:48px;border:2px dashed rgba(16,185,129,0.3);border-radius:6px;display:none;align-items:center;justify-content:center;font-size:7px;color:rgba(16,185,129,0.4);">QR</div>
    </div>
  </div>
</div>`;

// ─── TemplateService ──────────────────────────────────────────────────────────

@Injectable()
export class TemplateService {
  constructor(@InjectModel(Template.name) private templateModel: Model<TemplateDocument>) {}

  async findAll(category?: TemplateCategory, page = 1, limit = 20) {
    const filter: any = { isActive: true };
    if (category) filter.category = category;
    const skip = (page - 1) * limit;

    const [templates, total] = await Promise.all([
      this.templateModel.find(filter).select('-__v').sort({ isPremium: 1, createdAt: 1 }).skip(skip).limit(limit).exec(),
      this.templateModel.countDocuments(filter),
    ]);

    return {
      message: 'Templates fetched',
      data: templates,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<TemplateDocument> {
    const t = await this.templateModel.findById(id).exec();
    if (!t) throw new NotFoundException('Template not found');
    return t;
  }

  async findByIdPublic(id: string) {
    const t = await this.templateModel.findOne({ _id: id, isActive: true }).select('-__v').exec();
    if (!t) throw new NotFoundException('Template not found');
    return { message: 'Template fetched', data: t };
  }

  async findByCategory(category: TemplateCategory): Promise<TemplateDocument[]> {
    return this.templateModel.find({ category, isActive: true }).exec();
  }

  async create(dto: CreateTemplateDto) {
    const t = new this.templateModel(dto);
    return { message: 'Template created', data: await t.save() };
  }

  async seedDefaultTemplates() {
    try {
      // Check if we already have templates with frontHTML (including the Logo Center template)
      const withHtml = await this.templateModel.countDocuments({ frontHTML: { $ne: null } });
      const hasLogoCenter = await this.templateModel.countDocuments({ name: 'Logo Center' });
      const hasOceanPremium = await this.templateModel.countDocuments({ name: 'Ocean Blue Premium' });
      if (withHtml >= 20 && hasLogoCenter > 0 && hasOceanPremium > 0) return;

      // Delete old templates without HTML and re-seed
      await this.templateModel.deleteMany({ frontHTML: null });
      // If Logo Center is missing, upsert it without wiping existing templates
      if (hasLogoCenter === 0 && withHtml >= 20) {
        const logoCenterDoc = new this.templateModel({
          name: 'Logo Center',
          category: TemplateCategory.MINIMAL,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/ffffff/1f2937?text=Logo+Center',
          layoutConfig: { background: '#ffffff', primaryColor: '#1f2937', secondaryColor: '#6b7280', fontFamily: 'Inter', accent: '#3b82f6' },
          frontHTML: logoCenterFront,
          backHTML: logoCenterBack,
          frontCSS: '',
          backCSS: '',
          isActive: true,
        });
        await logoCenterDoc.save();
        console.log('✅ Added Logo Center template');
      }
      // If Ocean Blue Premium is missing, add it
      if (hasOceanPremium === 0 && withHtml >= 20) {
        const oceanDoc = new this.templateModel({
          name: 'Ocean Blue Premium',
          category: TemplateCategory.CREATIVE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/0369a1/e0f2fe?text=Ocean+Blue+Premium',
          layoutConfig: {
            background: 'linear-gradient(135deg,#0369a1,#0891b2)',
            primaryColor: '#e0f2fe',
            secondaryColor: 'rgba(224,242,254,0.7)',
            fontFamily: 'Poppins',
            accent: '#fbbf24',
          },
          frontHTML: oceanBluePremiumFront,
          backHTML: oceanBluePremiumBack,
          frontCSS: '',
          backCSS: '',
          isActive: true,
        });
        await oceanDoc.save();
        console.log('✅ Added Ocean Blue Premium template');
      }
      if ((hasLogoCenter === 0 || hasOceanPremium === 0) && withHtml >= 20) return;
      console.log('🔄 Clearing old templates, seeding new ones with HTML...');

      const templates = [
        // ── OCEAN BLUE PREMIUM ────────────────────────────────────────────────
        {
          name: 'Ocean Blue Premium',
          category: TemplateCategory.CREATIVE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/0369a1/e0f2fe?text=Ocean+Blue+Premium',
          layoutConfig: {
            background: 'linear-gradient(135deg,#0369a1,#0891b2)',
            primaryColor: '#e0f2fe',
            secondaryColor: 'rgba(224,242,254,0.7)',
            fontFamily: 'Poppins',
            accent: '#fbbf24',
          },
          frontHTML: oceanBluePremiumFront,
          backHTML: oceanBluePremiumBack,
          frontCSS: '',
          backCSS: '',
        },

        // ── GROUP 1: MINIMAL CLEAN ────────────────────────────────────────────
        {
          name: 'Minimal White Luxury',
          category: TemplateCategory.MINIMAL,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/ffffff/1a1a1a?text=Minimal+White+Luxury',
          layoutConfig: { background: '#ffffff', primaryColor: '#1a1a1a', secondaryColor: '#6b7280', fontFamily: 'Inter', accent: '#2563EB' },
          frontHTML: minimalWhiteLuxuryFront,
          backHTML: minimalWhiteLuxuryBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Slate Dark',
          category: TemplateCategory.MINIMAL,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/1e293b/f8fafc?text=Slate+Dark',
          layoutConfig: { background: '#1e293b', primaryColor: '#f8fafc', secondaryColor: '#94a3b8', fontFamily: 'Inter', accent: '#38bdf8' },
          frontHTML: slateDarkFront,
          backHTML: slateDarkBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Soft Gray',
          category: TemplateCategory.MINIMAL,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/f1f5f9/334155?text=Soft+Gray',
          layoutConfig: { background: '#f1f5f9', primaryColor: '#334155', secondaryColor: '#64748b', fontFamily: 'Inter', accent: '#6366f1' },
          frontHTML: softGrayFront,
          backHTML: softGrayBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Ivory Minimal',
          category: TemplateCategory.MINIMAL,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/fafaf8/1c1917?text=Ivory+Minimal',
          layoutConfig: { background: '#fafaf8', primaryColor: '#1c1917', secondaryColor: '#78716c', fontFamily: 'Georgia', accent: '#d97706' },
          frontHTML: ivoryMinimalFront,
          backHTML: ivoryMinimalBack,
          frontCSS: '',
          backCSS: '',
        },

        // ── GROUP 2: GRADIENT MODERN ──────────────────────────────────────────
        {
          name: 'Gradient Pro',
          category: TemplateCategory.CREATIVE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/667eea/ffffff?text=Gradient+Pro',
          layoutConfig: { background: 'linear-gradient(135deg,#667eea,#764ba2)', primaryColor: '#ffffff', secondaryColor: 'rgba(255,255,255,0.7)', fontFamily: 'Poppins', accent: '#fbbf24' },
          frontHTML: gradientProFront,
          backHTML: gradientProBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Purple Gradient',
          category: TemplateCategory.CREATIVE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/7c3aed/ffffff?text=Purple+Gradient',
          layoutConfig: { background: 'linear-gradient(135deg,#7c3aed,#db2777)', primaryColor: '#ffffff', secondaryColor: 'rgba(255,255,255,0.7)', fontFamily: 'Poppins', accent: '#fbbf24' },
          frontHTML: purpleGradientFront,
          backHTML: purpleGradientBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Sunset Orange',
          category: TemplateCategory.CREATIVE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/ea580c/fff7ed?text=Sunset+Orange',
          layoutConfig: { background: 'linear-gradient(135deg,#ea580c,#dc2626)', primaryColor: '#fff7ed', secondaryColor: '#fed7aa', fontFamily: 'Poppins', accent: '#fef08a' },
          frontHTML: sunsetOrangeFront,
          backHTML: sunsetOrangeBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Ocean Blue',
          category: TemplateCategory.CREATIVE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/0369a1/e0f2fe?text=Ocean+Blue',
          layoutConfig: { background: 'linear-gradient(135deg,#0369a1,#0891b2)', primaryColor: '#e0f2fe', secondaryColor: '#bae6fd', fontFamily: 'Poppins', accent: '#fbbf24' },
          frontHTML: oceanBlueFront,
          backHTML: oceanBlueBack,
          frontCSS: '',
          backCSS: '',
        },

        // ── GROUP 3: DARK PREMIUM ─────────────────────────────────────────────
        {
          name: 'Dark Luxury',
          category: TemplateCategory.PROFESSIONAL,
          isPremium: true,
          previewImage: 'https://placehold.co/400x240/0f0f0f/f59e0b?text=Dark+Luxury',
          layoutConfig: { background: '#0f0f0f', primaryColor: '#ffffff', secondaryColor: '#9ca3af', fontFamily: 'Montserrat', accent: '#f59e0b' },
          frontHTML: darkLuxuryFront,
          backHTML: darkLuxuryBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Neon Dark',
          category: TemplateCategory.PROFESSIONAL,
          isPremium: true,
          previewImage: 'https://placehold.co/400x240/09090b/00ff88?text=Neon+Dark',
          layoutConfig: { background: '#09090b', primaryColor: '#00ff88', secondaryColor: '#a1a1aa', fontFamily: 'Montserrat', accent: '#00ff88' },
          frontHTML: neonDarkFront,
          backHTML: neonDarkBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Navy Gold',
          category: TemplateCategory.PROFESSIONAL,
          isPremium: true,
          previewImage: 'https://placehold.co/400x240/1e3a5f/ffd700?text=Navy+Gold',
          layoutConfig: { background: '#1e3a5f', primaryColor: '#ffd700', secondaryColor: '#e2e8f0', fontFamily: 'Montserrat', accent: '#ffd700' },
          frontHTML: navyGoldFront,
          backHTML: navyGoldBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Matte Black Gold',
          category: TemplateCategory.PROFESSIONAL,
          isPremium: true,
          previewImage: 'https://placehold.co/400x240/111111/c9a84c?text=Matte+Black+Gold',
          layoutConfig: { background: '#111111', primaryColor: '#c9a84c', secondaryColor: '#a3a3a3', fontFamily: 'Montserrat', accent: '#c9a84c' },
          frontHTML: matteBlackGoldFront,
          backHTML: matteBlackGoldBack,
          frontCSS: '',
          backCSS: '',
        },

        // ── GROUP 4: CORPORATE PROFESSIONAL ──────────────────────────────────
        {
          name: 'Corporate Blue',
          category: TemplateCategory.CORPORATE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/1d4ed8/ffffff?text=Corporate+Blue',
          layoutConfig: { background: '#1d4ed8', primaryColor: '#ffffff', secondaryColor: '#bfdbfe', fontFamily: 'Inter', accent: '#fbbf24' },
          frontHTML: corporateBlueFront,
          backHTML: corporateBlueBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Forest Green',
          category: TemplateCategory.CORPORATE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/14532d/f0fdf4?text=Forest+Green',
          layoutConfig: { background: '#14532d', primaryColor: '#f0fdf4', secondaryColor: '#86efac', fontFamily: 'Inter', accent: '#4ade80' },
          frontHTML: forestGreenFront,
          backHTML: forestGreenBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Trust Blue',
          category: TemplateCategory.CORPORATE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/1e40af/eff6ff?text=Trust+Blue',
          layoutConfig: { background: '#1e40af', primaryColor: '#eff6ff', secondaryColor: '#bfdbfe', fontFamily: 'Inter', accent: '#fbbf24' },
          frontHTML: trustBlueFront,
          backHTML: trustBlueBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Corporate Slate',
          category: TemplateCategory.CORPORATE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/1e293b/fbbf24?text=Corporate+Slate',
          layoutConfig: { background: '#1e293b', primaryColor: '#f8fafc', secondaryColor: '#94a3b8', fontFamily: 'Inter', accent: '#fbbf24' },
          frontHTML: corporateSlateFront,
          backHTML: corporateSlateBack,
          frontCSS: '',
          backCSS: '',
        },

        // ── GROUP 5: CREATIVE DESIGNER ────────────────────────────────────────
        {
          name: 'Creative Designer',
          category: TemplateCategory.CREATIVE,
          isPremium: true,
          previewImage: 'https://placehold.co/400x240/1a1a2e/e94560?text=Creative+Designer',
          layoutConfig: { background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', primaryColor: '#ffffff', secondaryColor: '#94a3b8', fontFamily: 'Poppins', accent: '#e94560' },
          frontHTML: creativeDesignerFront,
          backHTML: creativeDesignerBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Rose Gold',
          category: TemplateCategory.CREATIVE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/fda4af/4c0519?text=Rose+Gold',
          layoutConfig: { background: 'linear-gradient(135deg,#fda4af,#f9a8d4)', primaryColor: '#4c0519', secondaryColor: '#9f1239', fontFamily: 'Poppins', accent: '#be185d' },
          frontHTML: roseGoldFront,
          backHTML: roseGoldBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Power Red',
          category: TemplateCategory.CREATIVE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/7f1d1d/fef2f2?text=Power+Red',
          layoutConfig: { background: '#7f1d1d', primaryColor: '#fef2f2', secondaryColor: '#fca5a5', fontFamily: 'Poppins', accent: '#ef4444' },
          frontHTML: powerRedFront,
          backHTML: powerRedBack,
          frontCSS: '',
          backCSS: '',
        },
        {
          name: 'Steel Gray',
          category: TemplateCategory.CREATIVE,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/374151/f9fafb?text=Steel+Gray',
          layoutConfig: { background: '#374151', primaryColor: '#f9fafb', secondaryColor: '#d1d5db', fontFamily: 'Poppins', accent: '#10b981' },
          frontHTML: steelGrayFront,
          backHTML: steelGrayBack,
          frontCSS: '',
          backCSS: '',
        },

        // ── LOGO CENTER (Koush Consult style) ─────────────────────────────────
        {
          name: 'Logo Center',
          category: TemplateCategory.MINIMAL,
          isPremium: false,
          previewImage: 'https://placehold.co/400x240/ffffff/1f2937?text=Logo+Center',
          layoutConfig: { background: '#ffffff', primaryColor: '#1f2937', secondaryColor: '#6b7280', fontFamily: 'Inter', accent: '#3b82f6' },
          frontHTML: logoCenterFront,
          backHTML: logoCenterBack,
          frontCSS: '',
          backCSS: '',
        },
      ];

      await this.templateModel.insertMany(templates);
      console.log(`✅ Seeded ${templates.length} templates (all with full HTML/CSS)`);
    } catch (e) {
      console.warn('Template seed error (non-fatal):', e.message);
    }
  }
}
