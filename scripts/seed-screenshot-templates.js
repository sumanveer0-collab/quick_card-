/**
 * Seed Script — Screenshot Templates
 * Run: node scripts/seed-screenshot-templates.js
 * Adds 12 new business card designs matching the design.com screenshot
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcard';

// ── Template HTML Definitions ────────────────────────────────────────────────

// 1. GREEN DARK DIAMOND — dark green with diamond geometric shape
const greenDiamondFront = `<div style="width:100%;height:100%;background:#0a3d2e;font-family:'Poppins',sans-serif;padding:18px 20px;box-sizing:border-box;display:flex;flex-direction:row;align-items:center;position:relative;overflow:hidden;">
  <!-- Diamond shape decoration -->
  <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg);width:110px;height:110px;border:2px solid rgba(34,197,94,0.5);pointer-events:none;"></div>
  <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg);width:90px;height:90px;border:1px solid rgba(34,197,94,0.3);pointer-events:none;"></div>
  <!-- Logo block left -->
  <div style="width:36%;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;z-index:2;">
    <div style="background:rgba(255,255,255,0.08);border:1px solid rgba(34,197,94,0.3);padding:6px 8px;border-radius:6px;text-align:center;">
      <img src="{{logoUrl}}" alt="Logo" style="width:40px;height:30px;object-fit:contain;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"/>
      <div style="color:#22c55e;font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:1px;display:none;">{{businessName}}</div>
      <div style="color:rgba(255,255,255,0.5);font-size:6px;margin-top:3px;letter-spacing:0.5px;">LOGO TEXT HERE</div>
      <div style="color:rgba(255,255,255,0.35);font-size:5px;margin-top:1px;">Slogan Here</div>
    </div>
  </div>
  <!-- Right: name + contact -->
  <div style="flex:1;padding-left:14px;position:relative;z-index:2;">
    <div style="font-size:13px;font-weight:800;color:#ffffff;line-height:1.2;letter-spacing:0.3px;">{{name}}</div>
    <div style="font-size:7.5px;color:#22c55e;margin-top:2px;text-transform:uppercase;letter-spacing:1px;">Founder / CEO</div>
    <div style="margin-top:10px;display:flex;flex-direction:column;gap:3.5px;">
      <div style="font-size:7.5px;color:rgba(255,255,255,0.7);">{{email}}</div>
      <div style="font-size:7.5px;color:rgba(255,255,255,0.7);">{{phone}}</div>
      <div style="font-size:7.5px;color:rgba(255,255,255,0.7);">{{website}}</div>
      <div style="font-size:7px;color:rgba(255,255,255,0.5);">{{address}}</div>
    </div>
  </div>
</div>`;

const greenDiamondBack = `<div style="width:100%;height:100%;background:#062318;font-family:'Poppins',sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg);width:120px;height:120px;border:2px solid rgba(34,197,94,0.4);pointer-events:none;"></div>
  <div style="position:relative;z-index:2;text-align:center;">
    <div style="font-size:14px;font-weight:800;color:#ffffff;letter-spacing:1px;">{{businessName}}</div>
    <div style="font-size:7px;color:#22c55e;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">{{tagline}}</div>
  </div>
</div>`;

// 2. BLUE HEALTHCARE / MEDICAL — cyan/blue with cross medical symbol
const blueMedicalFront = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#e0f7ff 0%,#b8eaf9 100%);font-family:'Inter',sans-serif;padding:18px 20px;box-sizing:border-box;display:flex;flex-direction:row;align-items:center;position:relative;overflow:hidden;">
  <!-- Wave top right decoration -->
  <div style="position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:rgba(14,165,233,0.15);pointer-events:none;"></div>
  <div style="position:absolute;top:10px;right:10px;width:60px;height:60px;border-radius:50%;background:rgba(14,165,233,0.1);pointer-events:none;"></div>
  <!-- Logo / cross symbol left -->
  <div style="width:38%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <div style="width:52px;height:52px;background:linear-gradient(135deg,#0ea5e9,#06b6d4);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(14,165,233,0.35);">
      <img src="{{logoUrl}}" alt="Logo" style="width:34px;height:34px;object-fit:contain;border-radius:50%;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>
      <div style="display:none;color:#fff;font-size:22px;font-weight:900;align-items:center;justify-content:center;">✚</div>
    </div>
    <div style="font-size:7px;color:#0369a1;font-weight:700;margin-top:5px;letter-spacing:0.5px;">LOGO TEXT HERE</div>
    <div style="font-size:5.5px;color:#64748b;margin-top:1px;">Slogan Here</div>
  </div>
  <!-- Right: details -->
  <div style="flex:1;padding-left:14px;border-left:1px solid rgba(14,165,233,0.25);">
    <div style="font-size:14px;font-weight:800;color:#0c4a6e;line-height:1.2;text-transform:uppercase;letter-spacing:0.5px;">FULL NAME</div>
    <div style="font-size:7.5px;color:#0369a1;margin-top:2px;font-weight:600;">FOUNDER & CEO</div>
    <div style="margin-top:8px;display:flex;flex-direction:column;gap:3px;">
      <div style="font-size:7.5px;color:#334155;">{{phone}}</div>
      <div style="font-size:7.5px;color:#334155;">{{email}}</div>
      <div style="font-size:7.5px;color:#334155;">{{website}}</div>
      <div style="font-size:7px;color:#64748b;">{{address}}</div>
    </div>
  </div>
</div>`;

const blueMedicalBack = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#0ea5e9 0%,#0891b2 100%);font-family:'Inter',sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <div style="position:absolute;top:-30px;left:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.08);"></div>
  <div style="position:absolute;bottom:-20px;right:-20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.06);"></div>
  <div style="text-align:center;position:relative;z-index:2;">
    <div style="font-size:14px;font-weight:800;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">{{businessName}}</div>
    <div style="font-size:7px;color:rgba(255,255,255,0.7);letter-spacing:2px;text-transform:uppercase;margin-top:4px;">{{tagline}}</div>
  </div>
</div>`;

// 3. DARK MAROON LUXURY — deep dark with gold logo/name split layout
const darkMaroonFront = `<div style="width:100%;height:100%;background:#1a0a0a;font-family:'Montserrat',sans-serif;padding:18px 22px;box-sizing:border-box;display:flex;flex-direction:row;align-items:stretch;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,#c9a84c,#f5d78a,#c9a84c);"></div>
  <div style="position:absolute;bottom:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,#c9a84c,#f5d78a,#c9a84c);"></div>
  <!-- Left: content -->
  <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;padding-right:16px;border-right:1px solid rgba(201,168,76,0.3);">
    <div>
      <div style="font-size:14px;font-weight:800;color:#f5d78a;letter-spacing:0.5px;line-height:1.2;text-transform:uppercase;">Full Name</div>
      <div style="font-size:7.5px;color:#c9a84c;margin-top:3px;letter-spacing:1.5px;text-transform:uppercase;">Founder & CEO</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px;">
      <div style="font-size:8px;color:rgba(245,215,138,0.8);display:flex;gap:5px;align-items:center;"><span style="color:#c9a84c;">✉</span>{{email}}</div>
      <div style="font-size:8px;color:rgba(245,215,138,0.8);display:flex;gap:5px;align-items:center;"><span style="color:#c9a84c;">📞</span>{{phone}}</div>
      <div style="font-size:8px;color:rgba(245,215,138,0.8);display:flex;gap:5px;align-items:center;"><span style="color:#c9a84c;">🌐</span>{{website}}</div>
    </div>
  </div>
  <!-- Right: logo -->
  <div style="width:38%;padding-left:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;">
    <div style="width:48px;height:48px;border-radius:50%;border:2px solid #c9a84c;display:flex;align-items:center;justify-content:center;overflow:hidden;">
      <img src="{{logoUrl}}" alt="Logo" style="width:40px;height:40px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>
      <div style="display:none;font-size:16px;color:#c9a84c;font-weight:900;align-items:center;justify-content:center;">⚜</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:7px;color:#c9a84c;font-weight:700;letter-spacing:1px;text-transform:uppercase;">LOGO TEXT</div>
      <div style="font-size:5.5px;color:rgba(201,168,76,0.6);margin-top:2px;letter-spacing:0.5px;">HERE</div>
    </div>
  </div>
</div>`;

const darkMaroonBack = `<div style="width:100%;height:100%;background:#0d0505;font-family:'Montserrat',sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,#c9a84c,#f5d78a,#c9a84c);"></div>
  <div style="position:absolute;bottom:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,#c9a84c,#f5d78a,#c9a84c);"></div>
  <div style="text-align:center;position:relative;z-index:2;">
    <div style="width:56px;height:56px;border-radius:50%;border:2px solid #c9a84c;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;">
      <span style="font-size:24px;color:#c9a84c;">⚜</span>
    </div>
    <div style="font-size:13px;font-weight:800;color:#f5d78a;letter-spacing:1px;text-transform:uppercase;">{{businessName}}</div>
    <div style="font-size:6.5px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">{{tagline}}</div>
  </div>
</div>`;

// 4. PINK DOTS MINIMAL — white background with pink/red dot pattern and cross symbol
const pinkDotsMinimalFront = `<div style="width:100%;height:100%;background:#ffffff;font-family:'Inter',sans-serif;padding:16px 20px;box-sizing:border-box;display:flex;flex-direction:row;align-items:center;position:relative;overflow:hidden;">
  <!-- Dot pattern top-left -->
  <div style="position:absolute;top:8px;left:8px;display:grid;grid-template-columns:repeat(5,8px);grid-template-rows:repeat(4,8px);gap:4px;opacity:0.35;">
    ${Array(20).fill('<div style="width:4px;height:4px;border-radius:50%;background:#ef4444;"></div>').join('')}
  </div>
  <!-- Bottom arc decoration -->
  <div style="position:absolute;bottom:-30px;right:20px;width:80px;height:80px;border-radius:50%;border:12px solid rgba(239,68,68,0.1);pointer-events:none;"></div>
  <!-- Left: icons/logo -->
  <div style="width:40%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;position:relative;z-index:2;">
    <div style="width:44px;height:44px;background:linear-gradient(135deg,#fee2e2,#fecaca);border-radius:50%;border:2px solid #fca5a5;display:flex;align-items:center;justify-content:center;">
      <img src="{{logoUrl}}" alt="Logo" style="width:30px;height:30px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"/>
      <span style="display:none;font-size:18px;color:#ef4444;">✚</span>
    </div>
    <div style="text-align:center;">
      <div style="font-size:7px;color:#ef4444;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">LOGO TEXT HERE</div>
      <div style="font-size:5.5px;color:#9ca3af;margin-top:1px;">Slogan Here</div>
    </div>
  </div>
  <!-- Right: name + contact -->
  <div style="flex:1;padding-left:12px;border-left:2px solid #fee2e2;position:relative;z-index:2;">
    <div style="font-size:13px;font-weight:800;color:#111827;text-transform:uppercase;line-height:1.2;letter-spacing:0.5px;">FULL NAME</div>
    <div style="font-size:7px;color:#ef4444;font-weight:600;margin-top:2px;text-transform:uppercase;letter-spacing:1px;">FOUNDER & CEO</div>
    <div style="margin-top:8px;display:flex;flex-direction:column;gap:3px;">
      <div style="font-size:7px;color:#6b7280;">{{phone}}</div>
      <div style="font-size:7px;color:#6b7280;">{{email}}</div>
    </div>
  </div>
</div>`;

const pinkDotsMinimalBack = `<div style="width:100%;height:100%;background:#fff5f5;font-family:'Inter',sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <div style="position:absolute;top:8px;left:8px;display:grid;grid-template-columns:repeat(6,10px);grid-template-rows:repeat(3,10px);gap:4px;opacity:0.2;">
    ${Array(18).fill('<div style="width:4px;height:4px;border-radius:50%;background:#ef4444;"></div>').join('')}
  </div>
  <div style="text-align:center;position:relative;z-index:2;">
    <div style="font-size:13px;font-weight:800;color:#111827;text-transform:uppercase;letter-spacing:1px;">{{businessName}}</div>
    <div style="font-size:7px;color:#ef4444;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">{{tagline}}</div>
  </div>
</div>`;

// 5. PURPLE WAVE — deep purple with curved wave and your name bold
const purpleWaveFront = `<div style="width:100%;height:100%;background:#4c1d95;font-family:'Poppins',sans-serif;padding:18px 22px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
  <!-- SVG Wave shape -->
  <svg style="position:absolute;right:0;top:0;height:100%;width:45%;" viewBox="0 0 120 200" preserveAspectRatio="none">
    <path d="M120,0 C60,0 80,50 60,100 C40,150 60,200 120,200 Z" fill="rgba(255,255,255,0.07)"/>
    <path d="M120,0 C70,0 90,50 70,100 C50,150 70,200 120,200 Z" fill="rgba(255,255,255,0.04)"/>
  </svg>
  <div>
    <div style="font-size:18px;font-weight:900;color:#ffffff;line-height:1.1;letter-spacing:-0.5px;">YOUR NAME</div>
    <div style="font-size:8px;color:rgba(255,255,255,0.65);margin-top:4px;letter-spacing:0.5px;">Founder & CEO</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div style="font-size:8px;color:rgba(255,255,255,0.8);">{{phone}}</div>
    <div style="font-size:8px;color:rgba(255,255,255,0.8);">{{email}}</div>
    <div style="font-size:8px;color:rgba(255,255,255,0.8);">{{website}}</div>
  </div>
  <!-- Logo bottom right -->
  <div style="position:absolute;bottom:14px;right:16px;text-align:center;z-index:2;">
    <img src="{{logoUrl}}" alt="Logo" style="width:36px;height:28px;object-fit:contain;display:block;margin:0 auto;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"/>
    <div style="display:none;font-size:7px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.5px;">{{businessName}}</div>
    <div style="font-size:5.5px;color:rgba(255,255,255,0.4);margin-top:2px;text-transform:uppercase;letter-spacing:1px;">LOGO TEXT HERE</div>
    <div style="font-size:4.5px;color:rgba(255,255,255,0.3);margin-top:1px;">Slogan Here</div>
  </div>
</div>`;

const purpleWaveBack = `<div style="width:100%;height:100%;background:#2e1065;font-family:'Poppins',sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <svg style="position:absolute;left:0;top:0;height:100%;width:40%;" viewBox="0 0 120 200" preserveAspectRatio="none">
    <path d="M0,0 C60,0 40,50 60,100 C80,150 60,200 0,200 Z" fill="rgba(255,255,255,0.05)"/>
  </svg>
  <div style="text-align:center;position:relative;z-index:2;">
    <div style="font-size:14px;font-weight:800;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">{{businessName}}</div>
    <div style="font-size:7px;color:rgba(255,255,255,0.55);letter-spacing:2px;text-transform:uppercase;margin-top:5px;">{{tagline}}</div>
  </div>
</div>`;

// 6. CIRCULAR ORNATE LOGO MINIMAL — white with circular ornamental badge center-left
const circularOrnateFront = `<div style="width:100%;height:100%;background:#ffffff;font-family:'Cormorant Garamond','Georgia',serif;padding:18px 20px;box-sizing:border-box;display:flex;flex-direction:row;align-items:center;position:relative;overflow:hidden;">
  <!-- Left: ornate circular logo -->
  <div style="width:40%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;">
    <!-- Outer decorative ring -->
    <div style="position:relative;width:58px;height:58px;">
      <svg viewBox="0 0 60 60" style="position:absolute;inset:0;width:100%;height:100%;">
        <circle cx="30" cy="30" r="28" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-dasharray="3 2"/>
        <circle cx="30" cy="30" r="22" fill="none" stroke="#c9a84c" stroke-width="0.8"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:50%;">
        <img src="{{logoUrl}}" alt="Logo" style="width:38px;height:38px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>
        <div style="display:none;width:38px;height:38px;align-items:center;justify-content:center;font-size:8px;color:#c9a84c;font-weight:700;text-align:center;line-height:1.1;">LOGO</div>
      </div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:6.5px;color:#4b4b4b;font-weight:700;text-transform:uppercase;letter-spacing:1px;">LOGO TEXT HERE</div>
      <div style="font-size:5px;color:#9ca3af;margin-top:1px;letter-spacing:0.5px;">Slogan Here</div>
    </div>
  </div>
  <!-- Divider -->
  <div style="width:1px;height:70%;background:linear-gradient(to bottom,transparent,#d1d5db,transparent);margin:0 14px;"></div>
  <!-- Right: name + contact -->
  <div style="flex:1;">
    <div style="font-size:14px;font-weight:700;color:#1c1c1c;letter-spacing:0.5px;line-height:1.2;text-transform:uppercase;">Full Name</div>
    <div style="font-size:7px;color:#c9a84c;font-weight:600;margin-top:2px;text-transform:uppercase;letter-spacing:1px;">Founder & CEO</div>
    <div style="margin-top:8px;display:flex;flex-direction:column;gap:3.5px;">
      <div style="font-size:7.5px;color:#374151;">{{phone}}</div>
      <div style="font-size:7.5px;color:#374151;">{{email}}</div>
      <div style="font-size:7.5px;color:#374151;">{{website}}</div>
      <div style="font-size:7px;color:#6b7280;">{{address}}</div>
    </div>
  </div>
</div>`;

const circularOrnateBack = `<div style="width:100%;height:100%;background:#f9f7f3;font-family:'Cormorant Garamond','Georgia',serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <div style="position:relative;width:70px;height:70px;margin-bottom:12px;">
    <svg viewBox="0 0 60 60" style="position:absolute;inset:0;width:100%;height:100%;">
      <circle cx="30" cy="30" r="28" fill="none" stroke="#c9a84c" stroke-width="1.2" stroke-dasharray="3 2"/>
      <circle cx="30" cy="30" r="22" fill="none" stroke="#c9a84c" stroke-width="0.8"/>
    </svg>
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
      <span style="font-size:20px;color:#c9a84c;">⚜</span>
    </div>
  </div>
  <div style="font-size:13px;font-weight:700;color:#1c1c1c;text-transform:uppercase;letter-spacing:2px;">{{businessName}}</div>
  <div style="font-size:6.5px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">{{tagline}}</div>
</div>`;

// 7. PINK RESTAURANT / FOOD — white with hot pink accents and cutlery icon
const pinkRestaurantFront = `<div style="width:100%;height:100%;background:#ffffff;font-family:'Playfair Display','Georgia',serif;padding:18px 22px;box-sizing:border-box;display:flex;flex-direction:row;align-items:stretch;position:relative;overflow:hidden;">
  <!-- Hot pink bottom accent bar -->
  <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#ec4899,#f9a8d4);"></div>
  <!-- Left: logo with fork-knife graphic -->
  <div style="width:40%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding-right:14px;border-right:1px solid #fce7f3;">
    <div style="width:52px;height:52px;border-radius:50%;background:#fff0f7;border:2px solid #f9a8d4;display:flex;align-items:center;justify-content:center;overflow:hidden;">
      <img src="{{logoUrl}}" alt="Logo" style="width:36px;height:36px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>
      <div style="display:none;font-size:22px;color:#ec4899;align-items:center;justify-content:center;">🍴</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:7px;color:#be185d;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">LOGO TEXT HERE</div>
      <div style="font-size:5.5px;color:#9ca3af;margin-top:1px;">Slogan Here</div>
    </div>
  </div>
  <!-- Right: name + contact -->
  <div style="flex:1;padding-left:14px;display:flex;flex-direction:column;justify-content:center;gap:3px;">
    <div style="font-size:13px;font-weight:800;color:#be185d;font-style:italic;line-height:1.2;letter-spacing:0.3px;">Name</div>
    <div style="font-size:7.5px;color:#4b5563;font-weight:600;">Job Title</div>
    <div style="margin-top:6px;display:flex;flex-direction:column;gap:2.5px;">
      <div style="font-size:7.5px;color:#6b7280;font-family:'Inter',sans-serif;">{{phone}}</div>
      <div style="font-size:7.5px;color:#6b7280;font-family:'Inter',sans-serif;">{{email}}</div>
      <div style="font-size:7.5px;color:#ec4899;font-family:'Inter',sans-serif;">{{website}}</div>
    </div>
  </div>
</div>`;

const pinkRestaurantBack = `<div style="width:100%;height:100%;background:#fff0f7;font-family:'Playfair Display','Georgia',serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#ec4899,#f9a8d4);"></div>
  <div style="text-align:center;position:relative;z-index:2;">
    <div style="font-size:14px;font-weight:800;color:#be185d;font-style:italic;">{{businessName}}</div>
    <div style="font-size:7px;color:#ec4899;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">{{tagline}}</div>
  </div>
</div>`;

// 8. DARK GOLD ORNATE — very dark background with gold flourish/crest logo
const darkGoldOrnateFront = `<div style="width:100%;height:100%;background:#0d0d0d;font-family:'Montserrat',sans-serif;padding:16px 18px;box-sizing:border-box;display:flex;flex-direction:row;align-items:center;position:relative;overflow:hidden;">
  <!-- Thin gold border lines top/bottom -->
  <div style="position:absolute;top:8px;left:10px;right:10px;height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);"></div>
  <div style="position:absolute;bottom:8px;left:10px;right:10px;height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);"></div>
  <!-- Left: ornamental logo crest -->
  <div style="width:38%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding-right:12px;border-right:1px solid rgba(201,168,76,0.25);">
    <div style="width:52px;height:52px;border-radius:50%;border:1.5px solid #c9a84c;display:flex;align-items:center;justify-content:center;background:rgba(201,168,76,0.05);overflow:hidden;">
      <img src="{{logoUrl}}" alt="Logo" style="width:38px;height:38px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>
      <div style="display:none;font-size:22px;color:#c9a84c;align-items:center;justify-content:center;">🏛</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:6.5px;color:#c9a84c;font-weight:700;text-transform:uppercase;letter-spacing:1px;">LOGO TEXT</div>
      <div style="font-size:5px;color:rgba(201,168,76,0.5);margin-top:1px;letter-spacing:0.5px;">Slogan Here</div>
    </div>
  </div>
  <!-- Right: name + details -->
  <div style="flex:1;padding-left:14px;">
    <div style="font-size:13px;font-weight:800;color:#f5d78a;line-height:1.2;text-transform:uppercase;letter-spacing:0.5px;">Full Name</div>
    <div style="font-size:7px;color:#c9a84c;margin-top:2px;text-transform:uppercase;letter-spacing:1.5px;">Founder & CEO</div>
    <div style="margin-top:8px;display:flex;flex-direction:column;gap:3.5px;">
      <div style="font-size:7.5px;color:rgba(245,215,138,0.7);">{{email}}</div>
      <div style="font-size:7.5px;color:rgba(245,215,138,0.7);">{{phone}}</div>
      <div style="font-size:7.5px;color:rgba(245,215,138,0.7);">{{website}}</div>
    </div>
  </div>
</div>`;

const darkGoldOrnateBack = `<div style="width:100%;height:100%;background:#080808;font-family:'Montserrat',sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <div style="position:absolute;top:8px;left:10px;right:10px;height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);"></div>
  <div style="position:absolute;bottom:8px;left:10px;right:10px;height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);"></div>
  <div style="text-align:center;position:relative;z-index:2;">
    <div style="font-size:24px;color:#c9a84c;margin-bottom:8px;">⚜</div>
    <div style="font-size:13px;font-weight:800;color:#f5d78a;letter-spacing:2px;text-transform:uppercase;">{{businessName}}</div>
    <div style="font-size:6px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">{{tagline}}</div>
  </div>
</div>`;

// 9. BEIGE BRUSH STROKE — light beige/cream with brown brush strokes
const beigeBrushFront = `<div style="width:100%;height:100%;background:#f5f0e8;font-family:'Playfair Display','Georgia',serif;padding:18px 22px;box-sizing:border-box;display:flex;flex-direction:row;align-items:center;position:relative;overflow:hidden;">
  <!-- Brush stroke SVG decoration -->
  <svg style="position:absolute;top:10px;left:10px;width:90px;height:40px;opacity:0.25;" viewBox="0 0 90 40">
    <path d="M5,30 Q30,5 85,20 Q60,25 80,35 Q40,15 10,35 Z" fill="#8B6914"/>
  </svg>
  <svg style="position:absolute;bottom:10px;right:10px;width:70px;height:30px;opacity:0.2;" viewBox="0 0 70 30">
    <path d="M5,20 Q30,5 65,15 Q50,20 60,25 Q30,10 10,25 Z" fill="#8B6914"/>
  </svg>
  <!-- Left: logo -->
  <div style="width:40%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding-right:14px;border-right:1px solid rgba(139,105,20,0.2);position:relative;z-index:2;">
    <div style="width:50px;height:50px;border-radius:8px;border:1.5px solid #c9a058;display:flex;align-items:center;justify-content:center;background:rgba(201,160,88,0.08);overflow:hidden;">
      <img src="{{logoUrl}}" alt="Logo" style="width:36px;height:36px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>
      <div style="display:none;font-size:18px;color:#8B6914;align-items:center;justify-content:center;">🏺</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:7px;color:#7c5c14;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">LOGO TEXT HERE</div>
      <div style="font-size:5px;color:#9ca3af;margin-top:1px;font-style:italic;">Slogan Here</div>
    </div>
  </div>
  <!-- Right: name + contact -->
  <div style="flex:1;padding-left:14px;position:relative;z-index:2;">
    <div style="font-size:12px;font-weight:700;color:#2c1810;line-height:1.2;">LOGO TEXT HERE</div>
    <div style="font-size:6px;color:#8B6914;margin-top:2px;font-style:italic;letter-spacing:0.5px;">Slogan Here</div>
    <div style="margin-top:8px;display:flex;flex-direction:column;gap:3px;">
      <div style="font-size:7.5px;color:#4b3822;font-family:'Inter',sans-serif;">{{phone}}</div>
      <div style="font-size:7.5px;color:#4b3822;font-family:'Inter',sans-serif;">{{email}}</div>
      <div style="font-size:7.5px;color:#4b3822;font-family:'Inter',sans-serif;">{{website}}</div>
      <div style="font-size:6.5px;color:#7c5c3a;font-family:'Inter',sans-serif;">{{address}}</div>
    </div>
  </div>
</div>`;

const beigeBrushBack = `<div style="width:100%;height:100%;background:#ede8dc;font-family:'Playfair Display','Georgia',serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <svg style="position:absolute;top:5px;left:5px;width:120px;height:50px;opacity:0.15;" viewBox="0 0 120 50">
    <path d="M5,40 Q50,5 115,25 Q80,30 110,42 Q55,15 10,42 Z" fill="#8B6914"/>
  </svg>
  <div style="text-align:center;position:relative;z-index:2;">
    <div style="font-size:13px;font-weight:700;color:#2c1810;">{{businessName}}</div>
    <div style="font-size:7px;color:#8B6914;letter-spacing:2px;text-transform:uppercase;margin-top:4px;font-style:italic;">{{tagline}}</div>
  </div>
</div>`;

// 10. CREAM LUXURY CLEAN — clean cream/ivory, large bold name, icon contact rows
const creamLuxuryFront = `<div style="width:100%;height:100%;background:#faf6ef;font-family:'Montserrat',sans-serif;padding:18px 22px;box-sizing:border-box;display:flex;flex-direction:row;align-items:stretch;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:linear-gradient(to bottom,#c9a84c,#f5d78a,#c9a84c);"></div>
  <!-- Left: name section -->
  <div style="flex:1;padding-left:10px;display:flex;flex-direction:column;justify-content:space-between;">
    <div>
      <div style="font-size:15px;font-weight:900;color:#1c1c1c;line-height:1.1;text-transform:uppercase;letter-spacing:0.5px;">FULL NAME</div>
      <div style="font-size:7.5px;color:#c9a84c;margin-top:3px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">CEO & Founder</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px;">
      <div style="font-size:7.5px;color:#4b4b4b;display:flex;align-items:center;gap:5px;">
        <span style="width:13px;height:13px;background:#c9a84c;border-radius:2px;display:inline-flex;align-items:center;justify-content:center;font-size:7px;color:#fff;flex-shrink:0;">📞</span>
        {{phone}}
      </div>
      <div style="font-size:7.5px;color:#4b4b4b;display:flex;align-items:center;gap:5px;">
        <span style="width:13px;height:13px;background:#c9a84c;border-radius:2px;display:inline-flex;align-items:center;justify-content:center;font-size:7px;color:#fff;flex-shrink:0;">✉</span>
        {{email}}
      </div>
      <div style="font-size:7.5px;color:#4b4b4b;display:flex;align-items:center;gap:5px;">
        <span style="width:13px;height:13px;background:#c9a84c;border-radius:2px;display:inline-flex;align-items:center;justify-content:center;font-size:7px;color:#fff;flex-shrink:0;">🌐</span>
        {{website}}
      </div>
    </div>
  </div>
  <!-- Right: logo -->
  <div style="width:36%;padding-left:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;border-left:1px solid rgba(201,168,76,0.3);">
    <div style="width:46px;height:46px;border-radius:50%;border:1.5px solid #c9a84c;display:flex;align-items:center;justify-content:center;overflow:hidden;">
      <img src="{{logoUrl}}" alt="Logo" style="width:36px;height:36px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>
      <div style="display:none;font-size:18px;color:#c9a84c;align-items:center;justify-content:center;">⚜</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:6.5px;color:#7c5c14;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">LOGO TEXT HERE</div>
      <div style="font-size:5px;color:#9ca3af;margin-top:1px;">Slogan Here</div>
    </div>
  </div>
</div>`;

const creamLuxuryBack = `<div style="width:100%;height:100%;background:#f5f0e4;font-family:'Montserrat',sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:linear-gradient(to bottom,#c9a84c,#f5d78a,#c9a84c);"></div>
  <div style="text-align:center;position:relative;z-index:2;">
    <div style="font-size:14px;font-weight:800;color:#1c1c1c;text-transform:uppercase;letter-spacing:1.5px;">{{businessName}}</div>
    <div style="width:40px;height:1.5px;background:#c9a84c;margin:6px auto;border-radius:2px;"></div>
    <div style="font-size:6.5px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;">{{tagline}}</div>
  </div>
</div>`;

// 11. DARK MAROON GOLD CONTACT — dark maroon with gold accents, full contact on right
const maroonGoldContactFront = `<div style="width:100%;height:100%;background:#2d0a0a;font-family:'Montserrat',sans-serif;padding:18px 22px;box-sizing:border-box;display:flex;flex-direction:row;align-items:stretch;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c9a84c,#f5d78a,#c9a84c);"></div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c9a84c,#f5d78a,#c9a84c);"></div>
  <!-- Left: big name block -->
  <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;padding-right:14px;border-right:1px solid rgba(201,168,76,0.25);">
    <div>
      <div style="font-size:15px;font-weight:900;color:#f5d78a;text-transform:uppercase;line-height:1.1;letter-spacing:0.5px;">FULL NAME</div>
      <div style="font-size:7px;color:#c9a84c;margin-top:3px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">CEO & Founder</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px;">
      <div style="font-size:7.5px;color:rgba(245,215,138,0.75);display:flex;gap:5px;align-items:center;"><span style="color:#c9a84c;font-size:8px;">📞</span>{{phone}}</div>
      <div style="font-size:7.5px;color:rgba(245,215,138,0.75);display:flex;gap:5px;align-items:center;"><span style="color:#c9a84c;font-size:8px;">✉</span>{{email}}</div>
      <div style="font-size:7.5px;color:rgba(245,215,138,0.75);display:flex;gap:5px;align-items:center;"><span style="color:#c9a84c;font-size:8px;">🌐</span>{{website}}</div>
    </div>
  </div>
  <!-- Right: logo crest -->
  <div style="width:36%;padding-left:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;">
    <div style="width:50px;height:50px;border-radius:50%;border:1.5px solid #c9a84c;display:flex;align-items:center;justify-content:center;background:rgba(201,168,76,0.06);overflow:hidden;">
      <img src="{{logoUrl}}" alt="Logo" style="width:36px;height:36px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>
      <div style="display:none;font-size:20px;color:#c9a84c;align-items:center;justify-content:center;">⚜</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:6px;color:#c9a84c;text-transform:uppercase;letter-spacing:1px;font-weight:700;">LOGO TEXT HERE</div>
      <div style="font-size:5px;color:rgba(201,168,76,0.5);margin-top:1px;">Slogan Here</div>
    </div>
  </div>
</div>`;

const maroonGoldContactBack = `<div style="width:100%;height:100%;background:#1a0505;font-family:'Montserrat',sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c9a84c,#f5d78a,#c9a84c);"></div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c9a84c,#f5d78a,#c9a84c);"></div>
  <div style="text-align:center;position:relative;z-index:2;">
    <div style="font-size:24px;color:#c9a84c;margin-bottom:8px;">⚜</div>
    <div style="font-size:13px;font-weight:800;color:#f5d78a;text-transform:uppercase;letter-spacing:2px;">{{businessName}}</div>
    <div style="font-size:6px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">{{tagline}}</div>
  </div>
</div>`;

// 12. TAN EAGLE MINIMAL — warm tan/beige with eagle/wings icon top-right
const tanEagleFront = `<div style="width:100%;height:100%;background:#f0e6d3;font-family:'Montserrat',sans-serif;padding:18px 22px;box-sizing:border-box;display:flex;flex-direction:row;align-items:stretch;position:relative;overflow:hidden;">
  <!-- Eagle/wings watermark top right -->
  <div style="position:absolute;top:10px;right:14px;font-size:28px;opacity:0.12;user-select:none;">🦅</div>
  <!-- Left: content -->
  <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;padding-right:12px;">
    <div>
      <div style="font-size:15px;font-weight:900;color:#2c1810;text-transform:uppercase;line-height:1.1;letter-spacing:0.5px;">FULL NAME</div>
      <div style="font-size:7.5px;color:#8B6914;margin-top:3px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">CEO & Founder</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px;">
      <div style="font-size:7.5px;color:#4b3822;display:flex;gap:5px;align-items:center;"><span style="color:#8B6914;">📞</span>{{phone}}</div>
      <div style="font-size:7.5px;color:#4b3822;display:flex;gap:5px;align-items:center;"><span style="color:#8B6914;">✉</span>{{email}}</div>
      <div style="font-size:7.5px;color:#4b3822;display:flex;gap:5px;align-items:center;"><span style="color:#8B6914;">🌐</span>{{website}}</div>
    </div>
  </div>
  <!-- Right: logo -->
  <div style="width:36%;padding-left:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;border-left:1px solid rgba(139,105,20,0.2);">
    <div style="width:46px;height:46px;border-radius:8px;border:1.5px solid #c9a058;display:flex;align-items:center;justify-content:center;background:rgba(201,160,88,0.1);overflow:hidden;">
      <img src="{{logoUrl}}" alt="Logo" style="width:34px;height:34px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"/>
      <div style="display:none;font-size:20px;color:#8B6914;align-items:center;justify-content:center;">🦅</div>
    </div>
    <div style="text-align:center;">
      <div style="font-size:6.5px;color:#7c5c14;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">LOGO TEXT HERE</div>
      <div style="font-size:5px;color:#9ca3af;margin-top:1px;">Slogan Here</div>
    </div>
  </div>
</div>`;

const tanEagleBack = `<div style="width:100%;height:100%;background:#e8dcc8;font-family:'Montserrat',sans-serif;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:80px;opacity:0.05;user-select:none;">🦅</div>
  <div style="text-align:center;position:relative;z-index:2;">
    <div style="font-size:13px;font-weight:800;color:#2c1810;text-transform:uppercase;letter-spacing:2px;">{{businessName}}</div>
    <div style="width:40px;height:1.5px;background:#8B6914;margin:6px auto;border-radius:2px;"></div>
    <div style="font-size:6.5px;color:#8B6914;letter-spacing:3px;text-transform:uppercase;">{{tagline}}</div>
  </div>
</div>`;

// ── MongoDB Seed Logic ───────────────────────────────────────────────────────

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  previewImage: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  layoutConfig: { type: Object, required: true },
  frontHTML: { type: String, default: null },
  frontCSS: { type: String, default: null },
  backHTML: { type: String, default: null },
  backCSS: { type: String, default: null },
  html: { type: String, default: null },
  css: { type: String, default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const TemplateModel = mongoose.model('Template', TemplateSchema);

const NEW_TEMPLATES = [
  {
    name: 'Green Diamond',
    category: 'creative',
    isPremium: false,
    previewImage: 'https://placehold.co/400x240/0a3d2e/22c55e?text=Green+Diamond',
    layoutConfig: { background: '#0a3d2e', primaryColor: '#22c55e', secondaryColor: 'rgba(255,255,255,0.7)', fontFamily: 'Poppins', accent: '#22c55e' },
    frontHTML: greenDiamondFront, backHTML: greenDiamondBack, frontCSS: '', backCSS: '',
  },
  {
    name: 'Blue Medical',
    category: 'professional',
    isPremium: false,
    previewImage: 'https://placehold.co/400x240/e0f7ff/0c4a6e?text=Blue+Medical',
    layoutConfig: { background: 'linear-gradient(135deg,#e0f7ff,#b8eaf9)', primaryColor: '#0c4a6e', secondaryColor: '#334155', fontFamily: 'Inter', accent: '#0ea5e9' },
    frontHTML: blueMedicalFront, backHTML: blueMedicalBack, frontCSS: '', backCSS: '',
  },
  {
    name: 'Dark Maroon Luxury',
    category: 'professional',
    isPremium: true,
    previewImage: 'https://placehold.co/400x240/1a0a0a/c9a84c?text=Dark+Maroon+Luxury',
    layoutConfig: { background: '#1a0a0a', primaryColor: '#f5d78a', secondaryColor: '#c9a84c', fontFamily: 'Montserrat', accent: '#c9a84c' },
    frontHTML: darkMaroonFront, backHTML: darkMaroonBack, frontCSS: '', backCSS: '',
  },
  {
    name: 'Pink Dots Minimal',
    category: 'minimal',
    isPremium: false,
    previewImage: 'https://placehold.co/400x240/ffffff/ef4444?text=Pink+Dots+Minimal',
    layoutConfig: { background: '#ffffff', primaryColor: '#111827', secondaryColor: '#6b7280', fontFamily: 'Inter', accent: '#ef4444' },
    frontHTML: pinkDotsMinimalFront, backHTML: pinkDotsMinimalBack, frontCSS: '', backCSS: '',
  },
  {
    name: 'Purple Wave',
    category: 'creative',
    isPremium: false,
    previewImage: 'https://placehold.co/400x240/4c1d95/ffffff?text=Purple+Wave',
    layoutConfig: { background: '#4c1d95', primaryColor: '#ffffff', secondaryColor: 'rgba(255,255,255,0.65)', fontFamily: 'Poppins', accent: '#a855f7' },
    frontHTML: purpleWaveFront, backHTML: purpleWaveBack, frontCSS: '', backCSS: '',
  },
  {
    name: 'Circular Ornate',
    category: 'minimal',
    isPremium: false,
    previewImage: 'https://placehold.co/400x240/ffffff/c9a84c?text=Circular+Ornate',
    layoutConfig: { background: '#ffffff', primaryColor: '#1c1c1c', secondaryColor: '#374151', fontFamily: 'Cormorant Garamond', accent: '#c9a84c' },
    frontHTML: circularOrnateFront, backHTML: circularOrnateBack, frontCSS: '', backCSS: '',
  },
  {
    name: 'Pink Restaurant',
    category: 'food',
    isPremium: false,
    previewImage: 'https://placehold.co/400x240/ffffff/ec4899?text=Pink+Restaurant',
    layoutConfig: { background: '#ffffff', primaryColor: '#be185d', secondaryColor: '#4b5563', fontFamily: 'Playfair Display', accent: '#ec4899' },
    frontHTML: pinkRestaurantFront, backHTML: pinkRestaurantBack, frontCSS: '', backCSS: '',
  },
  {
    name: 'Dark Gold Ornate',
    category: 'professional',
    isPremium: true,
    previewImage: 'https://placehold.co/400x240/0d0d0d/c9a84c?text=Dark+Gold+Ornate',
    layoutConfig: { background: '#0d0d0d', primaryColor: '#f5d78a', secondaryColor: 'rgba(245,215,138,0.7)', fontFamily: 'Montserrat', accent: '#c9a84c' },
    frontHTML: darkGoldOrnateFront, backHTML: darkGoldOrnateBack, frontCSS: '', backCSS: '',
  },
  {
    name: 'Beige Brush',
    category: 'minimal',
    isPremium: false,
    previewImage: 'https://placehold.co/400x240/f5f0e8/4b3822?text=Beige+Brush',
    layoutConfig: { background: '#f5f0e8', primaryColor: '#2c1810', secondaryColor: '#4b3822', fontFamily: 'Playfair Display', accent: '#8B6914' },
    frontHTML: beigeBrushFront, backHTML: beigeBrushBack, frontCSS: '', backCSS: '',
  },
  {
    name: 'Cream Luxury',
    category: 'minimal',
    isPremium: true,
    previewImage: 'https://placehold.co/400x240/faf6ef/1c1c1c?text=Cream+Luxury',
    layoutConfig: { background: '#faf6ef', primaryColor: '#1c1c1c', secondaryColor: '#4b4b4b', fontFamily: 'Montserrat', accent: '#c9a84c' },
    frontHTML: creamLuxuryFront, backHTML: creamLuxuryBack, frontCSS: '', backCSS: '',
  },
  {
    name: 'Maroon Gold Contact',
    category: 'professional',
    isPremium: true,
    previewImage: 'https://placehold.co/400x240/2d0a0a/c9a84c?text=Maroon+Gold+Contact',
    layoutConfig: { background: '#2d0a0a', primaryColor: '#f5d78a', secondaryColor: 'rgba(245,215,138,0.75)', fontFamily: 'Montserrat', accent: '#c9a84c' },
    frontHTML: maroonGoldContactFront, backHTML: maroonGoldContactBack, frontCSS: '', backCSS: '',
  },
  {
    name: 'Tan Eagle',
    category: 'minimal',
    isPremium: false,
    previewImage: 'https://placehold.co/400x240/f0e6d3/2c1810?text=Tan+Eagle',
    layoutConfig: { background: '#f0e6d3', primaryColor: '#2c1810', secondaryColor: '#4b3822', fontFamily: 'Montserrat', accent: '#8B6914' },
    frontHTML: tanEagleFront, backHTML: tanEagleBack, frontCSS: '', backCSS: '',
  },
];

async function seed() {
  console.log('🔗 Connecting to MongoDB:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected');

  let added = 0, skipped = 0;
  for (const tmpl of NEW_TEMPLATES) {
    const exists = await TemplateModel.findOne({ name: tmpl.name });
    if (exists) {
      console.log(`⏭  Skipping "${tmpl.name}" (already exists)`);
      skipped++;
    } else {
      await TemplateModel.create(tmpl);
      console.log(`✅ Added "${tmpl.name}"`);
      added++;
    }
  }

  console.log(`\n🎉 Done — Added: ${added}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
