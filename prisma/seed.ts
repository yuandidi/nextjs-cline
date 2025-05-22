import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient();
const postsDirectory = path.join(process.cwd(), 'src/content/blog');

async function main() {
  console.log('Starting to seed the database...');

  // Get all files in the posts directory
  const fileNames = fs.readdirSync(postsDirectory);
  
  for (const fileName of fileNames) {
    // Remove ".mdx" from file name to get slug
    const slug = fileName.replace(/\.mdx$/, '');
    
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);
    
    console.log(`Processing post: ${data.title}`);
    
    // Check if post already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });
    
    if (existingPost) {
      console.log(`Post with slug ${slug} already exists, skipping...`);
      continue;
    }
    
    // Create tags first
    const tagObjects = [];
    if (data.tags && Array.isArray(data.tags)) {
      for (const tagName of data.tags) {
        // Check if tag exists
        let tag = await prisma.tag.findUnique({
          where: { name: tagName },
        });
        
        // Create tag if it doesn't exist
        if (!tag) {
          tag = await prisma.tag.create({
            data: { name: tagName },
          });
          console.log(`Created tag: ${tagName}`);
        }
        
        tagObjects.push(tag);
      }
    }
    
    // Create post
    const post = await prisma.post.create({
      data: {
        slug,
        title: data.title,
        date: new Date(data.date),
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        content,
        tags: {
          connect: tagObjects.map(tag => ({ id: tag.id })),
        },
      },
    });
    
    console.log(`Created post: ${post.title}`);
  }
  
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
