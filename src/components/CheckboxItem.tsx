import React from 'react';

interface CheckboxItemProps {
  checked: boolean;
  children: React.ReactNode;
}

export function CheckboxItem({ checked, children }: CheckboxItemProps) {
  return (
    <li style={{ 
      listStyle: 'none', 
      display: 'flex', 
      alignItems: 'center',
      marginBottom: '0.5em' 
    }}>
      <input
        type="checkbox"
        checked={checked}
        readOnly
        style={{
          marginRight: '0.5em',
          cursor: 'pointer'
        }}
      />
      <span>{children}</span>
    </li>
  );
} 