"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function AboutPage() {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        About Me
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/3">
          <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            {!imageError ? (
              <Image
                src="/images/profile/profile.jpg"
                alt="Profile picture"
                fill
                className="object-cover"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                  Profile Photo
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Hello, I&apos;m Didi Yuan
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            I&apos;m a web developer and technical writer passionate about creating intuitive, 
            user-friendly applications and sharing knowledge with the developer community.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            With over 5 years of experience in web development, I specialize in 
            React, Next.js, and modern frontend technologies. I enjoy solving complex 
            problems and continuously learning new skills.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300">
            When I&apos;m not coding, you can find me hiking, reading, or experimenting 
            with new recipes in the kitchen.
          </p>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Skills & Expertise
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 dark:text-white">Frontend Development</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">React, Next.js, TypeScript</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 dark:text-white">Backend Development</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Node.js, Express, MongoDB</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 dark:text-white">UI/UX Design</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Figma, Tailwind CSS</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 dark:text-white">DevOps</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Docker, CI/CD, AWS</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 dark:text-white">Technical Writing</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Documentation, Tutorials</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 dark:text-white">Project Management</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Agile, Scrum, Jira</p>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Get In Touch
        </h2>
        
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
        
        <div className="flex space-x-4">
          <a 
            href="https://github.com/didiyuan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            GitHub
          </a>
          <a 
            href="https://twitter.com/didiyuan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Twitter
          </a>
          <a 
            href="https://linkedin.com/in/didiyuan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            LinkedIn
          </a>
          <a 
            href="mailto:didi.yuan@example.com" 
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Email
          </a>
        </div>
      </div>
      
      <div>
        <Link 
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
