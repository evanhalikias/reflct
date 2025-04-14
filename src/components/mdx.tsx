import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import Link from 'next/link';

import { SmartImage, SmartLink, Text } from "@/once-ui/components/index";
import { CodeBlock } from "@/once-ui/modules/index";
import { HeadingLink } from "@/components/index";

import type { TextProps } from "@/once-ui/interfaces";
import type { SmartImageProps } from "@/once-ui/components/SmartImage";

type TableProps = {
  data: {
    headers: string[];
    rows: string[][];
  };
};

function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => <th key={index}>{header}</th>);
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

// Custom list item component that handles both checkboxes and wiki links
function CustomListItem({ children }: { children: ReactNode }) {
  if (typeof children !== 'string') {
    return <li>{children}</li>;
  }

  const text = children.toString();
  
  // Check if this is a checkbox item
  const checkboxMatch = text.match(/^\[([ x])\]\s*(.+)$/);
  
  if (checkboxMatch) {
    const [_, checked, content] = checkboxMatch;
    
    // Process wiki links in the content
    const processedContent = content.replace(/\[\[(.*?)\]\]/g, (match, pageName) => {
      const slug = pageName.toLowerCase().replace(/\s+/g, '-').replace(/\.md$/, '');
      return `[[${pageName}]]`; // Keep the original format for CustomLink to process
    });
    
    return (
      <li style={{ 
        listStyle: 'none', 
        display: 'flex', 
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <input
          type="checkbox"
          checked={checked === 'x'}
          readOnly
          style={{
            margin: 0,
            cursor: 'pointer'
          }}
        />
        <CustomLink href={`[[${processedContent}]]`}>
          {processedContent}
        </CustomLink>
      </li>
    );
  }

  return <li>{text}</li>;
}

// Enhanced CustomLink to handle wiki links
function CustomLink({ href, children, ...props }: { href: string; children: ReactNode }) {
  // Handle wiki-style links
  if (href.startsWith('[[') && href.endsWith(']]')) {
    const pageName = href.slice(2, -2);
    // Extract the actual page name if it contains wiki syntax
    const actualPageName = pageName.match(/\[\[(.*?)\]\]/) ? 
      pageName.match(/\[\[(.*?)\]\]/)[1] : 
      pageName;
    
    const slug = actualPageName.toLowerCase().replace(/\s+/g, '-').replace(/\.md$/, '');
    
    return (
      <SmartLink 
        href={`/blog/${slug}`}
        style={{
          color: 'var(--color-primary)',
          textDecoration: 'none',
          borderBottom: '1px dashed currentColor'
        }}
        {...props}
      >
        {actualPageName}
      </SmartLink>
    );
  }

  // Handle regular links
  if (href.startsWith("/")) {
    return <SmartLink href={href} {...props}>{children}</SmartLink>;
  }

  if (href.startsWith("#")) {
    return <a href={href} {...props}>{children}</a>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createImage({ alt, src, ...props }: SmartImageProps & { src: string }) {
  if (!src) {
    console.error("SmartImage requires a valid 'src' property.");
    return null;
  }

  return (
    <SmartImage
      className="my-20"
      enlarge
      radius="m"
      aspectRatio="16 / 9"
      alt={alt}
      src={src}
      {...props}
    />
  );
}

function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const CustomHeading = ({ children, ...props }: TextProps) => {
    const slug = slugify(children as string);
    return (
      <HeadingLink
        style={{ marginTop: "var(--static-space-24)", marginBottom: "var(--static-space-12)" }}
        level={level}
        id={slug}
        {...props}
      >
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `Heading${level}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

const components = {
  p: createParagraph as any,
  h1: createHeading(1) as any,
  h2: createHeading(2) as any,
  h3: createHeading(3) as any,
  h4: createHeading(4) as any,
  h5: createHeading(5) as any,
  h6: createHeading(6) as any,
  img: createImage as any,
  a: CustomLink as any,
  li: CustomListItem as any,
  Table,
  CodeBlock,
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};

// Add some CSS
const styles = `
  .wiki-link {
    color: var(--color-primary, #00ff00);
    text-decoration: none;
    border-bottom: 1px dashed currentColor;
  }
  .wiki-link:hover {
    border-bottom-style: solid;
  }
  .wiki-link-missing {
    color: var(--color-error, #ff0000);
    border-bottom-style: dotted;
  }
`;

// Add a function to check if a page exists
async function checkPageExists(slug: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/check-page?slug=${slug}`);
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Error checking page existence:', error);
    return false;
  }
}

export function CustomMDX(props: CustomMDXProps) {
  return (
    <>
      <style>{styles}</style>
      <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />
    </>
  );
}
