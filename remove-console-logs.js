const fs = require('fs');
const path = require('path');

function removeConsoleLogs(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignorer node_modules et autres dossiers
      if (!['node_modules', '.git', '.nuxt', '.output', 'dist'].includes(file)) {
        removeConsoleLogs(filePath);
      }
    } else if (file.endsWith('.vue') || file.endsWith('.ts') || file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const filteredLines = lines.filter(line => {
        // Garder les lignes qui ne sont pas des console.log/warn/error/info/debug
        const trimmed = line.trim();
        return !trimmed.match(/^console\.(log|warn|error|info|debug)\(/);
      });
      
      const newContent = filteredLines.join('\n');
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Nettoyé: ${filePath}`);
      }
    }
  });
}

// Démarrer depuis le répertoire racine
const rootDir = process.cwd();
removeConsoleLogs(path.join(rootDir, 'app'));
removeConsoleLogs(path.join(rootDir, 'server'));
console.log('Nettoyage terminé!');

