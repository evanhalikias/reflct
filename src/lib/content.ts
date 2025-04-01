import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

// Define interfaces for content types
interface Frontmatter {
  title?: string;
  date?: string;
  tags?: string[];
  [key: string]: any; // Allow other frontmatter properties
}

interface ContentItem extends Frontmatter {
  slug: string;
}

interface SearchResult extends ContentItem {
  type: string;
}

export function getContentBySlug(contentType: string, slug: string) {
  const fullPath = path.join(contentDirectory, contentType, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    frontmatter: data as Frontmatter,
    content
  };
}

export function getAllContent(contentType: string): ContentItem[] {
  const contentTypePath = path.join(contentDirectory, contentType);
  
  // Check if directory exists
  if (!fs.existsSync(contentTypePath)) {
    return [];
  }
  
  const filenames = fs.readdirSync(contentTypePath);
  
  return filenames
    .filter((filename: string) => filename.endsWith('.md'))
    .map((filename: string) => {
      const slug = filename.replace(/\.md$/, '');
      const { frontmatter } = getContentBySlug(contentType, slug);
      
      return {
        slug,
        ...frontmatter
      } as ContentItem;
    })
    .sort((a: ContentItem, b: ContentItem) => {
      // Sort by date if available
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
}

// Get content types (directories inside content folder)
export function getContentTypes(): string[] {
  return fs.readdirSync(contentDirectory, { withFileTypes: true })
    .filter((dirent: fs.Dirent) => dirent.isDirectory())
    .map((dirent: fs.Dirent) => dirent.name);
}

// Search content across all types
export function searchContent(query: string): SearchResult[] {
  const contentTypes = getContentTypes();
  const results: SearchResult[] = [];
  
  contentTypes.forEach((type: string) => {
    const typeContent = getAllContent(type);
    
    typeContent.forEach((item: ContentItem) => {
      // Simple search in title and tags
      const titleMatch = item.title?.toLowerCase().includes(query.toLowerCase());
      const tagsMatch = item.tags?.some(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
      );
      
      if (titleMatch || tagsMatch) {
        results.push({
          ...item,
          type
        });
      }
    });
  });
  
  return results;
}