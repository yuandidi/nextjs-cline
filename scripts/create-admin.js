import { PrismaClient } from "@prisma/client/extension";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Admin';

  if (!email || !password) {
    console.error('Usage: node scripts/create-admin.js <email> <password> [name]');
    process.exit(1);
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`User with email ${email} already exists.`);
      
      // Update the user to be an admin if they're not already
      if (existingUser.role !== 'admin') {
        await prisma.user.update({
          where: { email },
          data: { role: 'admin' },
        });
        console.log(`Updated user ${email} to admin role.`);
      } else {
        console.log(`User ${email} is already an admin.`);
      }
      
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log(`Admin user created successfully:`);
    console.log(`- Name: ${user.name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
