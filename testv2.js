const arr = ['', 'B.aaaaaaaa', "A.ddddddd", "D.aaaaaaaaaaaa", '', '', '', 'uawfwa', 'C.dddddd'];

arr.sort((a, b) => {
  const aPrefix = a.startsWith('A.') ? 'A' : a.startsWith('B.') ? 'B' : a.startsWith('C.') ? 'C' : a.startsWith('D.') ? 'D' : 'Z';
  const bPrefix = b.startsWith('A.') ? 'A' : b.startsWith('B.') ? 'B' : b.startsWith('C.') ? 'C' : b.startsWith('D.') ? 'D' : 'Z';
  
  if (aPrefix < bPrefix) return -1;
  if (aPrefix > bPrefix) return 1;
  return a.localeCompare(b);
});

console.log(arr);