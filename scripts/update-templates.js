const fs = require('fs');
let content = fs.readFileSync('src/modules/template/template.service.ts', 'utf8');
const htmlStart = content.indexOf('const TEMPLATES_HTML = {');
const seedEnd = content.lastIndexOf('\n  }') + 4;
const before = content.substring(0, htmlStart);
const after = content.substring(seedEnd);
console.log('before len:', before.length, 'after:', JSON.stringify(after));
