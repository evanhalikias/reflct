import { NextResponse } from 'next/server';
import { getPosts } from '@/app/utils/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ exists: false });
  }

  const posts = getPosts(["content"]);
  const exists = posts.some(post => post.slug === slug);

  return NextResponse.json({ exists });
} 