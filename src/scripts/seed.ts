import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model';
import Problem from '../models/Problem.model';
import Design from '../models/Design.model';
import { logger } from '../utils/logger.util';

dotenv.config();

const sampleProblems = [
    {
        title: 'Design URL Shortener (TinyURL)',
        difficulty: 'Easy',
        description: 'Design a scalable URL shortening service like TinyURL or bit.ly. The system should convert long URLs into short, unique aliases and redirect users to the original URL when accessed.',
        functionalRequirements: [
            'Given a long URL, generate a unique short URL.',
            'When a user accesses a short URL, redirect them to the original long URL.',
            'Users should be able to specify a custom alias (optional).',
            'Links should expire after a default timespan (e.g., 5 years) but be extendable.',
            'Provide analytics on link clicks (time, location, device).',
        ],
        nonFunctionalRequirements: [
            'High Availability: The system should be up 99.99% of the time.',
            'Low Latency: Redirection should happen in <20ms.',
            'Scalability: Support read-heavy workload (100:1 read/write ratio).',
            'Fault Tolerance: No single point of failure.',
        ],
        scale: {
            users: '500M+ Monthly Active Users',
            requests: '100M URLs generated/month, 10B redirects/month',
            data: '15TB storage per year (assuming 500 bytes/URL)',
        },
        isPro: false,
    },
    {
        title: 'Design Pastebin',
        difficulty: 'Easy',
        description: 'Design a service like Pastebin where users can store and share plain text. The system should allow users to paste text and get a unique URL to access it.',
        functionalRequirements: [
            'Users can paste text and get a unique URL.',
            'Users can set expiration for the paste.',
            'Users can set a custom alias for the paste.',
            'Support syntax highlighting for code snippets.',
            'Allow password protection for sensitive pastes.',
        ],
        nonFunctionalRequirements: [
            'High Reliability: Written data should not be lost.',
            'High Availability: Reads are critical.',
            'Low Latency: Pastes should load quickly.',
            'Consistency: Strong consistency is not required, eventual consistency is acceptable.',
        ],
        scale: {
            users: '10M Daily Active Users',
            requests: '1M new pastes/day, 10M reads/day',
            data: '10TB storage/year',
        },
        isPro: false,
    },
    {
        title: 'Design Rate Limiter',
        difficulty: 'Medium',
        description: 'Design a distributed API Rate Limiter to throttle traffic based on IP, User ID, or API Key. It should prevent abuse and ensure fair usage.',
        functionalRequirements: [
            'Limit the number of requests an entity can send within a time window.',
            'Support different rate limits for different APIs or user tiers.',
            'Return appropriate HTTP 429 error when limit is exceeded.',
            'Allow distributed rate limiting across a cluster of servers.',
        ],
        nonFunctionalRequirements: [
            'Low Latency: Check should verify limits in <5ms.',
            'Why? Because it runs on every request.',
            'High Availability: The limiter itself should not be a point of failure.',
            'Accuracy: Allow some leniency but prevent massive abuse.',
        ],
        scale: {
            users: 'Global API Gateway',
            requests: '1M requests per second',
            data: 'In-memory transient data',
        },
        isPro: false,
    },
    {
        title: 'Design Instagram (News Feed)',
        difficulty: 'Medium',
        description: 'Design a photo-sharing social media service like Instagram. Focus on the core features: uploading photos, following users, and generating a news feed.',
        functionalRequirements: [
            'Users can upload/post photos and videos.',
            'Users can follow other users.',
            'Users can view a news feed of posts from people they follow.',
            'Users can like and comment on posts.',
            'Search for other users and hashtags.',
        ],
        nonFunctionalRequirements: [
            'Latency: News feed generation should be fast (<200ms).',
            'Availability: High availability is preferred over consistency (CAP theorem -> AP).',
            'Storage: Durable and reliable storage for metadata and media files.',
        ],
        scale: {
            users: '1B+ Monthly Active Users',
            requests: '500M photos uploaded/day',
            data: '2PB+ new media generated/day',
        },
        isPro: false,
    },
    {
        title: 'Design WhatsApp (Chat App)',
        difficulty: 'Hard',
        description: 'Design a real-time messaging application like WhatsApp or Facebook Messenger. Support 1-on-1 chats, group chats, and online status.',
        functionalRequirements: [
            '1-on-1 text messaging.',
            'Group chats (up to 256 participants).',
            'Sent / Delivered / Read receipts.',
            'Online / Last Seen status.',
            'Support for image/video sharing.',
            'Push notifications for offline users.',
        ],
        nonFunctionalRequirements: [
            'Real-time delivery: Minimum latency.',
            'Consistency: Messages must be ordered and delivered reliably.',
            'Availability: High availability.',
            'Security: End-to-End Encryption.',
        ],
        scale: {
            users: '2B+ Users',
            requests: '100B messages/day',
            data: 'Ephemeral storage for delivered messages, Persistent for undelivered',
        },
        isPro: true,
    },
    {
        title: 'Design Uber (Ride Sharing)',
        difficulty: 'Hard',
        description: 'Design a ride-hailing service like Uber or Lyft. The system connects passengers with nearby drivers in real-time.',
        functionalRequirements: [
            'Riders can see nearby drivers.',
            'Riders can request a ride.',
            'Drivers receive requests and can accept/decline.',
            'Match rider with the nearest available driver.',
            'Real-time location tracking for trip.',
            'Process payments and ratings.',
        ],
        nonFunctionalRequirements: [
            'Real-time: Location updates and matching must be near-instant.',
            'Consistency: A driver cannot be assigned to two riders simultaneously.',
            'High Availability: System should always be available for transactions.',
        ],
        scale: {
            users: '100M+ Monthly Active Users',
            requests: '1M active rides globally at any time',
            data: 'Geo-spatial index heavy',
        },
        isPro: true,
    },
    {
        title: 'Design YouTube / Netflix',
        difficulty: 'Hard',
        description: 'Design a global video streaming platform. Focus on content upload, transcoding, and scalable playback (CDN).',
        functionalRequirements: [
            'Content Creators upload videos.',
            'System encodes videos into multiple formats/resolutions.',
            'Users view videos with adaptive streaming (MPEG-DASH / HLS).',
            'Track view counts, likes, and comments.',
            'Personalized recommendations.',
        ],
        nonFunctionalRequirements: [
            'Reliability: Uploaded videos must never be lost.',
            'Availability: Playback should rarely fail.',
            'Performance: Minimal buffering using global CDNs.',
        ],
        scale: {
            users: '2B+ Users',
            requests: '500 hours of video uploaded/minute',
            data: 'Exabytes of storage',
        },
        isPro: true,
    },
    {
        title: 'Design Google Drive (File Storage)',
        difficulty: 'Hard',
        description: 'Design a cloud file storage and synchronization service like Google Drive or Dropbox.',
        functionalRequirements: [
            'Users can upload, download, and delete files.',
            'File synchronization across multiple devices.',
            'File sharing with permissions (read/write).',
            'Support for large files (up to 50GB).',
            'Offline editing and conflict resolution.',
        ],
        nonFunctionalRequirements: [
            'Data Integrity: Files must never be corrupted.',
            'Durability: 99.999999999% durability (11 nines).',
            'Synchronization: Changes should reflect quickly across devices.',
            'Security: Encryption at rest and in transit.',
        ],
        scale: {
            users: '1B+ Users',
            requests: 'High bandwidth usage',
            data: '100s of Petabytes',
        },
        isPro: true,
    },
    {
        title: 'Design Web Crawler',
        difficulty: 'Hard',
        description: 'Design a scalable web crawler (like Googlebot) to index the internet for a search engine.',
        functionalRequirements: [
            'Given a set of seed URLs, crawl the web recursively.',
            'Extract text and metadata from pages.',
            'Store indexed content.',
            'Respect `robots.txt` and crawl politeness.',
            'Address duplicate content detection.',
        ],
        nonFunctionalRequirements: [
            'Scalability: Crawl billions of pages.',
            'Politeness: Do not overwhelm target servers.',
            'Extensibility: Support new content types easily.',
        ],
        scale: {
            users: 'Internal System',
            requests: 'Billions of pages indexed per month',
            data: 'Petabytes of raw HTML and index data',
        },
        isPro: true,
    },
    {
        title: 'Design Notification System',
        difficulty: 'Medium',
        description: 'Design a scalable notification service that sends alerts to users across multiple channels (Push, Email, SMS).',
        functionalRequirements: [
            'Send notifications via Email, SMS, and Push (iOS/Android).',
            'Support bulk notifications (e.g., marketing campaigns).',
            'Support transactional notifications (e.g., OTPs, order updates).',
            'Prioritization of messages (High/Low).',
            'User preferences (Opt-in/Opt-out).',
        ],
        nonFunctionalRequirements: [
            'Reliability: Notifications must be delivered (at least once).',
            'Throughput: Handle millions of notifications per minute.',
            'Integrations: Pluggable architecture for different providers (Twilio, SendGrid, FCM).',
        ],
        scale: {
            users: 'Platform Service',
            requests: '10M notifications/minute',
            data: 'Queue-heavy workload',
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

