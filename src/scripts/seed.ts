import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model';
import Problem from '../models/Problem.model';
import Design from '../models/Design.model';
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
    {
        title: 'Design WhatsApp',
        difficulty: 'Hard',
        description: 'Design a real-time messaging application like WhatsApp that supports one-on-one and group messaging.',
        functionalRequirements: [
            'One-to-one messaging',
            'Group chat (up to 256 members)',
            'Media sharing (photos, videos, documents)',
            'Message delivery status (sent, delivered, read)',
            'End-to-end encryption',
            'Voice and video calls',
        ],
        nonFunctionalRequirements: [
            'Real-time message delivery (<100ms)',
            'Support 2B users',
            'High availability',
            'Low bandwidth usage',
            'Offline message queue',
        ],
        scale: {
            users: '2 billion users',
            requests: '1M messages/sec',
            data: '10 PB',
        },
        isPro: true,
    },
    {
        title: 'Design YouTube',
        difficulty: 'Hard',
        description: 'Design a video sharing platform like YouTube where users can upload, watch, and interact with videos.',
        functionalRequirements: [
            'Video upload and encoding',
            'Video playback with quality selection',
            'Comments and likes',
            'Subscriptions and notifications',
            'Search and recommendations',
            'Playlists',
        ],
        nonFunctionalRequirements: [
            'Handle billions of video views',
            'Fast video start time',
            'Global CDN distribution',
            'Efficient encoding pipeline',
            'Handle peak traffic',
        ],
        scale: {
            users: '2 billion users',
            requests: '500K videos watched/sec',
            data: '500PB',
        },
        isPro: true,
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/systemdesignlab');
        logger.success('Connected to MongoDB');

        // Clear existing data
        logger.info('Clearing existing data...');
        await User.deleteMany({});
        await Problem.deleteMany({});
        await Design.deleteMany({});
        logger.success('Cleared existing data');

        // Create test users
        logger.info('Creating test users...');
        const users = await User.create([
            {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'free',
                subscriptionStatus: 'active',
            },
            {
                name: 'Pro User',
                email: 'pro@example.com',
                password: 'password123',
                role: 'pro',
                subscriptionStatus: 'active',
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'free',
                subscriptionStatus: 'active',
            },
        ]);
        logger.success(`Created ${users.length} users`);

        // Insert sample problems
        logger.info('Creating problems...');
        const problems = await Problem.insertMany(sampleProblems);
        logger.success(`Created ${problems.length} problems`);

        // Create sample designs
        logger.info('Creating sample designs...');
        const designs = await Design.insertMany([
            // Design 1: URL Shortener - Well-architected design for evaluation testing
            {
                userId: users[0]._id.toString(),
                problemId: problems[0]._id.toString(), // URL Shortener
                nodes: [
                    {
                        id: 'client',
                        type: 'customNode',
                        position: { x: 50, y: 200 },
                        data: {
                            label: 'Client (Browser/App)',
                            nodeType: 'client',
                            config: {},
                        },
                    },
                    {
                        id: 'cdn',
                        type: 'customNode',
                        position: { x: 250, y: 200 },
                        data: {
                            label: 'CDN / DNS',
                            nodeType: 'cdn',
                            config: { provider: 'CloudFlare' },
                        },
                    },
                    {
                        id: 'lb',
                        type: 'customNode',
                        position: { x: 450, y: 200 },
                        data: {
                            label: 'Load Balancer',
                            nodeType: 'loadBalancer',
                            config: { algorithm: 'Round Robin' },
                        },
                    },
                    {
                        id: 'api1',
                        type: 'customNode',
                        position: { x: 650, y: 100 },
                        data: {
                            label: 'API Server 1',
                            nodeType: 'apiServer',
                            config: { replicationFactor: 3 },
                        },
                    },
                    {
                        id: 'api2',
                        type: 'customNode',
                        position: { x: 650, y: 200 },
                        data: {
                            label: 'API Server 2',
                            nodeType: 'apiServer',
                            config: { replicationFactor: 3 },
                        },
                    },
                    {
                        id: 'api3',
                        type: 'customNode',
                        position: { x: 650, y: 300 },
                        data: {
                            label: 'API Server 3',
                            nodeType: 'apiServer',
                            config: { replicationFactor: 3 },
                        },
                    },
                    {
                        id: 'redis',
                        type: 'customNode',
                        position: { x: 900, y: 150 },
                        data: {
                            label: 'Redis Cache',
                            nodeType: 'cache',
                            config: {
                                caching: true,
                                purpose: 'Cache short URL mappings for fast redirects'
                            },
                        },
                    },
                    {
                        id: 'db-primary',
                        type: 'customNode',
                        position: { x: 900, y: 280 },
                        data: {
                            label: 'PostgreSQL Primary',
                            nodeType: 'database',
                            config: {
                                storage: 'PostgreSQL',
                                role: 'Primary',
                                replication: true
                            },
                        },
                    },
                    {
                        id: 'db-replica',
                        type: 'customNode',
                        position: { x: 1100, y: 280 },
                        data: {
                            label: 'PostgreSQL Replica',
                            nodeType: 'database',
                            config: {
                                storage: 'PostgreSQL',
                                role: 'Replica',
                                replication: true
                            },
                        },
                    },
                    {
                        id: 'analytics',
                        type: 'customNode',
                        position: { x: 900, y: 420 },
                        data: {
                            label: 'Analytics Service',
                            nodeType: 'queue',
                            config: { purpose: 'Track clicks asynchronously' },
                        },
                    },
                ],
                edges: [
                    { id: 'e-client-cdn', source: 'client', target: 'cdn' },
                    { id: 'e-cdn-lb', source: 'cdn', target: 'lb' },
                    { id: 'e-lb-api1', source: 'lb', target: 'api1' },
                    { id: 'e-lb-api2', source: 'lb', target: 'api2' },
                    { id: 'e-lb-api3', source: 'lb', target: 'api3' },
                    { id: 'e-api1-redis', source: 'api1', target: 'redis' },
                    { id: 'e-api2-redis', source: 'api2', target: 'redis' },
                    { id: 'e-api3-redis', source: 'api3', target: 'redis' },
                    { id: 'e-api1-db', source: 'api1', target: 'db-primary' },
                    { id: 'e-api2-db', source: 'api2', target: 'db-primary' },
                    { id: 'e-api3-db', source: 'api3', target: 'db-primary' },
                    { id: 'e-db-replica', source: 'db-primary', target: 'db-replica' },
                    { id: 'e-api1-analytics', source: 'api1', target: 'analytics' },
                    { id: 'e-api2-analytics', source: 'api2', target: 'analytics' },
                    { id: 'e-api3-analytics', source: 'api3', target: 'analytics' },
                ],
                evaluationResult: {
                    strengths: [
                        'Excellent use of Redis cache for fast URL redirects (<50ms)',
                        'Load balancer distributes traffic across multiple API servers',
                        'Database replication ensures high availability',
                        'CDN integration reduces latency globally',
                        'Analytics service decoupled for async click tracking',
                        'Scalable architecture can handle high traffic'
                    ],
                    risks: [
                        'Cache invalidation strategy needed for URL updates',
                        'Consider adding rate limiting to prevent abuse'
                    ],
                    criticalIssues: [],
                    optimizations: [
                        'Add connection pooling for database',
                        'Implement auto-scaling for API servers during peak traffic',
                        'Consider adding a message queue (Kafka/RabbitMQ) for analytics pipeline'
                    ],
                },
            },
            {
                userId: users[1]._id.toString(),
                problemId: problems[1]._id.toString(),
                nodes: [
                    {
                        id: 'client-app',
                        type: 'custom',
                        position: { x: 50, y: 200 },
                        data: {
                            label: 'Mobile App',
                            nodeType: 'client',
                            config: {},
                        },
                    },
                    {
                        id: 'cdn-1',
                        type: 'custom',
                        position: { x: 250, y: 100 },
                        data: {
                            label: 'CDN',
                            nodeType: 'cdn',
                            config: { provider: 'CloudFront' },
                        },
                    },
                    {
                        id: 'api-gateway',
                        type: 'custom',
                        position: { x: 250, y: 250 },
                        data: {
                            label: 'API Gateway',
                            nodeType: 'apiGateway',
                            config: {},
                        },
                    },
                    {
                        id: 'image-service',
                        type: 'custom',
                        position: { x: 450, y: 100 },
                        data: {
                            label: 'Image Service',
                            nodeType: 'apiService',
                            config: {},
                        },
                    },
                    {
                        id: 'auth-service',
                        type: 'custom',
                        position: { x: 450, y: 250 },
                        data: {
                            label: 'Auth Service',
                            nodeType: 'auth',
                            config: {},
                        },
                    },
                    {
                        id: 'notification-service',
                        type: 'custom',
                        position: { x: 450, y: 350 },
                        data: {
                            label: 'Notification Service',
                            nodeType: 'notification',
                            config: {},
                        },
                    },
                    {
                        id: 's3-storage',
                        type: 'custom',
                        position: { x: 650, y: 100 },
                        data: {
                            label: 'S3 Storage',
                            nodeType: 'objectStorage',
                            config: { storage: 'S3' },
                        },
                    },
                    {
                        id: 'db-primary',
                        type: 'custom',
                        position: { x: 650, y: 250 },
                        data: {
                            label: 'Database',
                            nodeType: 'database',
                            config: {},
                        },
                    },
                    {
                        id: 'analytics',
                        type: 'custom',
                        position: { x: 650, y: 350 },
                        data: {
                            label: 'Analytics Service',
                            nodeType: 'analytics',
                            config: {},
                        },
                    },
                ],
                edges: [
                    { id: 'e1', source: 'client-app', target: 'cdn-1' },
                    { id: 'e2', source: 'client-app', target: 'api-gateway' },
                    { id: 'e3', source: 'cdn-1', target: 'image-service' },
                    { id: 'e4', source: 'api-gateway', target: 'image-service' },
                    { id: 'e5', source: 'api-gateway', target: 'auth-service' },
                    { id: 'e6', source: 'api-gateway', target: 'notification-service' },
                    { id: 'e7', source: 'image-service', target: 's3-storage' },
                    { id: 'e8', source: 'auth-service', target: 'db-primary' },
                    { id: 'e9', source: 'notification-service', target: 'analytics' },
                ],
                evaluationResult: {
                    strengths: ['Good use of CDN for static content', 'Scalable storage with S3', 'Separate auth service for security', 'API Gateway for routing'],
                    risks: ['Single database could be bottleneck', 'No caching layer for frequently accessed data'],
                    criticalIssues: ['Missing load balancer', 'No database replication'],
                    optimizations: ['Add Redis cache', 'Implement load balancing', 'Add database replicas', 'Use message queue for notifications'],
                },
            },
        ]);
        logger.success(`Created ${designs.length} sample designs`);

        logger.info('\n📊 Database Seeding Summary:');
        logger.success(`✅ Users: ${users.length}`);
        logger.success(`✅ Problems: ${problems.length}`);
        logger.success(`✅ Designs: ${designs.length}`);

        logger.info('\n🔐 Test Credentials:');
        logger.info('   📧 Email: test@example.com');
        logger.info('   🔑 Password: password123');
        logger.info('\n   📧 Pro Email: pro@example.com');
        logger.info('   🔑 Password: password123');

        logger.info('\n📋 Sample problems:');
        sampleProblems.forEach((p, i) => {
            logger.info(`   ${i + 1}. ${p.title} (${p.difficulty}) ${p.isPro ? '👑 PRO' : '🆓'}`);
        });

        await mongoose.connection.close();
        logger.success('\n✨ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();

