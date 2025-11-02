
import React from 'react';
export default function Button({ children, kind='default', className='', ...props }){
  const cls = ['btn', kind==='primary'?'btn-primary':'', kind==='outline'?'btn-outline':'', className].join(' ');
  return <button className={cls} {...props}>{children}</button>;
}
