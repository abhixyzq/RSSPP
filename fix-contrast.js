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
    // Inputs: Increase border visibility and lighten background
    { from: /dark:bg-black\/40/g, to: 'dark:bg-slate-800' },
    { from: /dark:border-white\/10/g, to: 'dark:border-slate-600' },
    
    // Change indigo-950/50 to something more grey/neutral and solid for better contrast
    { from: /dark:bg-indigo-950\/50/g, to: 'dark:bg-slate-800' },
    { from: /dark:bg-indigo-950\/80/g, to: 'dark:bg-slate-800' },
    
    // Ensure table headers and subheaders stand out
    { from: /dark:bg-white\/5/g, to: 'dark:bg-slate-700/50' },

    // Text colors
    { from: /dark:text-blue-300/g, to: 'dark:text-blue-400' },
    { from: /dark:text-slate-400/g, to: 'dark:text-gray-300' },
  ];

  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });

  fs.writeFileSync(absolutePath, content, 'utf8');
}

targetFiles.forEach(patchFile);
console.log('Fixed contrast for dark mode.');
