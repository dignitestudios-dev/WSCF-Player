const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<DialogContent') && content.includes('className="relative ')) {
    const newContent = content.replace(/<DialogContent([^>]*?)className=\"relative /g, '<DialogContent$1className="');
    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Fixed ' + file);
    }
  }
});
