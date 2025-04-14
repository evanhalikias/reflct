import React from 'react';
import Link from 'next/link';

interface WikiLinkProps {
  href: string;
  children: React.ReactNode;
}

export function WikiLink({ href, children }: WikiLinkProps) {
  // Convert the wiki link to a URL-friendly slug
  const slug = href.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Link 
      href={`/blog/${slug}`}
      className="wiki-link"
      style={{
        color: 'var(--color-primary)',
        textDecoration: 'none',
        borderBottom: '1px dashed var(--color-primary)',
      }}
    >
      {children}
    </Link>
  );
} 