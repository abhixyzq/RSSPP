const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/app/admin/customers/components/CustomerTable.tsx',
  'src/app/admin/closed-accounts/components/ClosedCustomerTable.tsx'
];

function patchFile(filePath) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) return;
  
  let content = fs.readFileSync(absolutePath, 'utf8');

  const replacements = [
    { from: /bg-gray-50\/80/g, to: 'bg-gray-50/80 dark:bg-slate-700/50' },
    { from: /border-gray-100(?![\w/])(?![^"']*dark:border-)/g, to: 'border-gray-100 dark:border-slate-700' },
  ];

  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });

  fs.writeFileSync(absolutePath, content, 'utf8');
}

targetFiles.forEach(patchFile);
console.log('Fixed theads.');
