import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/posts/[slug] - Get a post by slug
export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  const { params } = context;
  try {
    // Ensure params is awaited if it's a promise
    const slug = params.slug;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(`Error fetching post with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug] - Update a post
export async function PUT(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  const { params } = context;
  try {
    // Ensure params is awaited if it's a promise
    const slug = params.slug;
    const body = await request.json();
    const { title, content, excerpt, date, coverImage, tags } = body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
      include: { tags: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        title: title || undefined,
        content: content || undefined,
        excerpt: excerpt || undefined,
        date: date ? new Date(date) : undefined,
        coverImage: coverImage || undefined,
        tags: tags
          ? {
              // Disconnect all existing tags
              disconnect: existingPost.tags.map((tag: { id: number }) => ({ id: tag.id })),
              // Connect or create new tags
              connectOrCreate: tags.map((tag: string) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(`Error updating post with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug] - Delete a post
export async function DELETE(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  const { params } = context;
  try {
    // Ensure params is awaited if it's a promise
    const slug = params.slug;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Delete post
    await prisma.post.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(`Error deleting post with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
