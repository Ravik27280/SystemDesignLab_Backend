import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.model';
import { logger } from '../utils/logger.util';

dotenv.config();

const sampleProblems = [
    {
        title: 'Design URL Shortener',
        difficulty: 'Easy',
        description: 'Design a URL shortening service like bit.ly or TinyURL that converts long URLs into short, manageable links.',
        functionalRequirements: [
            'Generate short URL from long URL',
            'Redirect short URL to original URL',
            'Custom short URL aliases (optional)',
            'URL expiration (optional)',
        ],
        nonFunctionalRequirements: [
            'Low latency for redirects',
            'High availability',
            'Handle 1000 requests per second',
        ],
        scale: {
            users: '1 million users',
            requests: '1000 req/sec',
            data: '100 million URLs',
        },
        isPro: false,
    },
    {
        title: 'Design Instagram',
        difficulty: 'Medium',
        description: 'Design a photo-sharing social media platform like Instagram with feed, stories, and messaging.',
        functionalRequirements: [
            'Upload and share photos/videos',
            'News feed with posts from followed users',
            'Like, comment, share functionality',
            'User profiles and followers',
            'Direct messaging',
            'Stories (24-hour expiry)',
        ],
        nonFunctionalRequirements: [
            'Handle millions of daily active users',
            'Low latency for feed and uploads',
            'High consistency for user data',
            'Eventually consistent for likes/comments',
        ],
        scale: {
            users: '500 million users',
            requests: '100K req/sec',
            data: '50 billion photos',
        },
        isPro: false,
    },
    {
        title: 'Design Netflix',
        difficulty: 'Hard',
        description: 'Design a video streaming platform like Netflix that can handle millions of concurrent users watching different content.',
        functionalRequirements: [
            'Video streaming with adaptive bitrate',
            'Content recommendation engine',
            'User profiles and watch history',
            'Content search and discovery',
            'Download for offline viewing',
            'Multiple device support',
        ],
        nonFunctionalRequirements: [
            'Handle millions of concurrent streams',
            'Low buffering and latency',
            'Global content delivery',
            'High availability (99.99% uptime)',
            'Content security and DRM',
        ],
        scale: {
            users: '200 million subscribers',
            requests: '1 million concurrent streams',
            data: '100K hours of content',
        },
        isPro: true,
    },
    {
        title: 'Design Twitter',
        difficulty: 'Medium',
        description: 'Design a microblogging platform like Twitter (X) where users can post short messages and follow others.',
        functionalRequirements: [
            'Post tweets (280 characters)',
            'Follow/unfollow users',
            'Timeline feed (home and user)',
            'Like, retweet, reply',
            'Trending topics',
            'Notifications',
        ],
        nonFunctionalRequirements: [
            'Real-time feed updates',
            'Handle viral tweets (millions of views)',
            'Low latency for timeline',
            'Eventually consistent for likes/retweets',
        ],
        scale: {
            users: '300 million users',
            requests: '10K tweets per second',
            data: '500 billion tweets',
        },
        isPro: false,
    },
    {
        title: 'Design Uber',
        difficulty: 'Hard',
        description: 'Design a ride-sharing platform like Uber that connects riders with drivers in real-time.',
        functionalRequirements: [
            'Real-time driver location tracking',
            'Ride matching algorithm',
            'Fare calculation',
            'Payment processing',
            'Rating system',
            'Trip history',
            'Surge pricing',
        ],
        nonFunctionalRequirements: [
            'Real-time GPS updates',
            'Low latency for matching',
            'High availability',
            'Accurate ETA calculations',
            'Handle peak traffic times',
        ],
        scale: {
            users: '100 million users',
            requests: '50K concurrent rides',
            data: '10 billion trips',
        },
        isPro: true,
    },
    {
        title: 'Design Dropbox',
        difficulty: 'Medium',
        description: 'Design a file storage and synchronization service like Dropbox that allows users to store and share files across devices.',
        functionalRequirements: [
            'File upload and download',
            'File synchronization across devices',
            'File sharing (public/private)',
            'Version history',
            'Folder organization',
            'Collaboration features',
        ],
        nonFunctionalRequirements: [
            'Fast sync across devices',
            'Handle large files (GBs)',
            'Data consistency',
            'High availability',
            'Efficient storage',
        ],
        scale: {
            users: '50 million users',
            requests: '10K uploads per second',
            data: '1 PB of storage',
        },
        isPro: true,
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/systemdesignlab');
        logger.success('Connected to MongoDB');

        // Clear existing problems
        await Problem.deleteMany({});
        logger.info('Cleared existing problems');

        // Insert sample problems
        await Problem.insertMany(sampleProblems);
        logger.success(`Inserted ${sampleProblems.length} sample problems`);

        logger.info('\nSample problems added:');
        sampleProblems.forEach((p, i) => {
            logger.info(`${i + 1}. ${p.title} (${p.difficulty}) ${p.isPro ? '👑 PRO' : '🆓'}`);
        });

        await mongoose.connection.close();
        logger.success('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
