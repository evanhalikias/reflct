import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  publishedAt?: string;
  summary?: string;
  image?: string;
  images?: string[];
  tag?: string;
  team?: Team[];
  link?: string;
};

import { notFound } from 'next/navigation';

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    notFound();
  }

  return fs.readdirSync(dir).filter((file) => 
    ['.md', '.mdx'].includes(path.extname(file))
  );
}

function processObsidianContent(content: string): string {
  // Convert wiki links to markdown links
  content = content.replace(/\[\[(.*?)\]\]/g, (match, pageName) => {
    if (pageName.includes('|')) {
      const [page, displayText] = pageName.split('|');
      return `[${displayText}]([[${page}]])`;
    }
    return `[${pageName}]([[${pageName}]])`;
  });

  return content;
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);
  
  // Process Obsidian-specific syntax
  const processedContent = processObsidianContent(content);
  
  let title = data.title;
  if (!title) {
    const titleMatch = processedContent.match(/^#\s+(.+)$/m);
    title = titleMatch ? titleMatch[1] : path.basename(filePath, path.extname(filePath));
  }

  const metadata: Metadata = {
    title,
    publishedAt: data.publishedAt,
    summary: data.summary || getFirstParagraph(processedContent),
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || "Note",
    team: data.team || [],
    link: data.link || "",
  };

  return { metadata, content: processedContent };
}

function getFirstParagraph(content: string): string {
  const paragraphMatch = content.match(/^(?!#)(.+?)(?:\n\n|$)/s);
  return paragraphMatch ? paragraphMatch[1].trim() : "";
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts(directory: string[] = ["content"]) {
  const postsDir = path.join(process.cwd(), ...directory);
  return getMDXData(postsDir)
    .sort((a, b) => {
      if (a.metadata.publishedAt && b.metadata.publishedAt) {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
      }
      return a.metadata.title.localeCompare(b.metadata.title);
    });
}
