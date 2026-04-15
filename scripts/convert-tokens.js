const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '..', 'design-tokens.tokens.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'app', 'constants', 'tokens.css');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

function convertTokens() {
  console.log('📖 Reading design tokens...');
  const tokens = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  
  const tokenMap = new Map(); // path -> { name, value, type }
  const cssVars = [];

  // Step 1: Collect all tokens and generate CSS variable names
  function walk(obj, currentPath = []) {
    for (const key in obj) {
      const nextPath = [...currentPath, key];
      const value = obj[key];

      if (value && typeof value === 'object') {
        if (value.type || (value.value !== undefined && typeof value.value !== 'object')) {
          // It's a token
          const pathStr = nextPath.join('.');
          const isSystem = nextPath[0].toLowerCase().includes('roles') || nextPath[0].toLowerCase().includes('font');
          const prefix = isSystem ? 'sys' : 'ref';
          
          // Generate a cleaner name by shortening long collection names if needed
          let nameParts = nextPath.map(slugify);
          if (nameParts[0].includes('primitive-color-collection')) nameParts[0] = 'color';
          if (nameParts[1] === 'color-palettes') nameParts.splice(1, 1);
          if (nameParts[1] === 'key-color-group') nameParts.splice(1, 1);
          if (nameParts[0] === 'color-roles') nameParts[0] = 'color';

          const baseName = `--${prefix}-${nameParts.join('-')}`;
          
          if (value.type === 'custom-fontStyle') {
            for (const prop in value.value) {
              tokenMap.set(`${pathStr}.${prop}`, {
                name: `${baseName}-${slugify(prop)}`,
                value: value.value[prop],
                type: typeof value.value[prop]
              });
            }
          } else {
            tokenMap.set(pathStr, {
              name: baseName,
              value: value.value,
              type: value.type
            });
          }
        } else {
          walk(value, nextPath);
        }
      }
    }
  }

  walk(tokens);

  // Step 2: Resolve references and generate CSS lines
  console.log(`✨ Resolving ${tokenMap.size} tokens...`);
  
  function resolveValue(val) {
    if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
      const refPath = val.slice(1, -1);
      const ref = tokenMap.get(refPath);
      if (ref) return `var(${ref.name})`;
      console.warn(`⚠️ Could not resolve reference: ${val}`);
    }
    
    // Handle dimensions (assuming pixels if number)
    if (typeof val === 'number' && !val.toString().includes('weight')) {
        // Simple heuristic: if it's not a weight or unitless property, add px
        // (In a perfect script we'd check the token type or property name)
        return `${val}px`;
    }
    
    return val;
  }

  const outputLines = [
    '/*',
    ' * CropWatch Design System Variables',
    ' * Generated from design-tokens.tokens.json',
    ' */',
    '',
    ':root {'
  ];

  // Group by type for better organization
  const sortedTokens = Array.from(tokenMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  sortedTokens.forEach(token => {
    const resolvedValue = resolveValue(token.value);
    outputLines.push(`  ${token.name}: ${resolvedValue};`);
  });

  outputLines.push('}');
  outputLines.push('');

  console.log(`💾 Writing to ${OUTPUT_FILE}...`);
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, outputLines.join('\n'));
  console.log('✅ Done!');
}

try {
  convertTokens();
} catch (err) {
  console.error('❌ Conversion failed:', err);
  process.exit(1);
}
