import { Column, Flex, Heading, Text } from "@/once-ui/components";
import { Mailchimp } from "@/components";
import { getPosts } from "@/app/utils/utils";
import { baseURL } from "@/app/resources";
import { blog, person, newsletter } from "@/app/resources/content";
import Link from "next/link";

export async function generateMetadata() {
  const title = blog.title;
  const description = blog.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/blog`,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

function BlogPost({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-post-link">
      <Column gap="s" className="blog-post">
        <Heading variant="heading-strong-m">{post.metadata.title}</Heading>
        {post.metadata.publishedAt && (
          <Text variant="body-default-s" onBackground="neutral-weak">
            {new Date(post.metadata.publishedAt).toLocaleDateString()}
          </Text>
        )}
        {post.metadata.summary && (
          <Text variant="body-default-m" onBackground="neutral-medium">
            {post.metadata.summary}
          </Text>
        )}
        {post.metadata.tag && (
          <Text variant="label-strong-s" onBackground="neutral-weak">
            {post.metadata.tag}
          </Text>
        )}
      </Column>
    </Link>
  );
}

export default function Blog() {
  const posts = getPosts(["content"]);  // Get posts from content directory

  return (
    <Column maxWidth="s">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            headline: blog.title,
            description: blog.description,
            url: `https://${baseURL}/blog`,
            image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
            author: {
              "@type": "Person",
              name: person.name,
              image: {
                "@type": "ImageObject",
                url: `${baseURL}${person.avatar}`,
              },
            },
          }),
        }}
      />
      <Heading marginBottom="l" variant="display-strong-s">
        {blog.title}
      </Heading>
      <Column fillWidth gap="l">
        {posts.map((post) => (
          <BlogPost key={post.slug} post={post} />
        ))}
      </Column>
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}
