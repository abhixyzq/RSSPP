const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/app/admin/customers/components/CustomerTable.tsx',
  'src/app/admin/components/AddCustomerForm.tsx',
  'src/app/admin/customers/[id]/page.tsx',
  'src/app/admin/customers/components/EditCustomerModal.tsx',
  'src/app/admin/components/AddTransactionForm.tsx',
  'src/app/admin/bulk-interest/components/BulkInterestUI.tsx',
  'src/app/admin/closed-accounts/components/ClosedCustomerTable.tsx',
  'src/app/admin/transactions/page.tsx',
  'src/app/admin/page.tsx'
];

function patchFile(filePath) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) return;
  
  let content = fs.readFileSync(absolutePath, 'utf8');

  const replacements = [
    // Backgrounds
    { from: /dark:bg-slate-900/g, to: 'dark:bg-[#0B1120]' },
    { from: /dark:bg-slate-800\/50/g, to: 'dark:bg-white/5' },
    { from: /dark:bg-slate-800/g, to: 'dark:bg-white/5' },
    { from: /dark:bg-blue-900/g, to: 'dark:bg-indigo-950/50' },
    
    // Borders
    { from: /dark:border-slate-700/g, to: 'dark:border-white/10' },
    
    // Texts
    { from: /dark:text-blue-400/g, to: 'dark:text-blue-300' },
    { from: /dark:text-gray-400/g, to: 'dark:text-slate-400' },
    { from: /dark:text-gray-300/g, to: 'dark:text-slate-300' },
    { from: /dark:text-gray-200/g, to: 'dark:text-slate-200' },
    { from: /dark:text-gray-100/g, to: 'dark:text-slate-100' },

    // Inputs: explicitly add dark:bg-black/40 if it's an input-like element
    { from: /className="w-full px-4 py-3 border/g, to: 'className="w-full px-4 py-3 bg-white dark:bg-black/40 border' },
    { from: /className="w-full pl-10 pr-4 py-2.5 bg-white border/g, to: 'className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black/40 border' },
    { from: /className="flex-1 px-4 py-3 border/g, to: 'className="flex-1 px-4 py-3 bg-white dark:bg-black/40 border' },
  ];

  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });

  fs.writeFileSync(absolutePath, content, 'utf8');
}

targetFiles.forEach(patchFile);
console.log('Polished dark mode classes applied.');
