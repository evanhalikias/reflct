import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export function getContentBySlug(contentType: string, slug: string) {
  const fullPath = path.join(contentDirectory, contentType, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    frontmatter: data,
    content
  };
}

export function getAllContent(contentType: string) {
  const contentTypePath = path.join(contentDirectory, contentType);
  
  // Check if directory exists
  if (!fs.existsSync(contentTypePath)) {
    return [];
  }
  
  const filenames = fs.readdirSync(contentTypePath);
  
  return filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const slug = filename.replace(/\.md$/, '');
      const { frontmatter } = getContentBySlug(contentType, slug);
      
      return {
        slug,
        ...frontmatter
      };
    })
    .sort((a, b) => {
      // Sort by date if available
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
}

// Get content types (directories inside content folder)
export function getContentTypes() {
  return fs.readdirSync(contentDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

// Search content across all types
export function searchContent(query: string) {
  const contentTypes = getContentTypes();
  const results = [];
  
  contentTypes.forEach(type => {
    const typeContent = getAllContent(type);
    
    typeContent.forEach(item => {
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