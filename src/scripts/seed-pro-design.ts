
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model';
import Problem from '../models/Problem.model';
import Design from '../models/Design.model';
import { logger } from '../utils/logger.util';

dotenv.config();

const seedProDesign = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/systemdesignlab');
        logger.success('Connected to MongoDB');

        // Find Pro User
        const proUser = await User.findOne({ email: 'pro@example.com' });
        if (!proUser) {
            logger.error('Pro user not found. Run seed.ts first.');
            process.exit(1);
        }

        // Find URL Shortener Problem
        const problem = await Problem.findOne({ title: 'Design URL Shortener' });
        if (!problem) {
            logger.error('URL Shortener problem not found. Run seed.ts first.');
            process.exit(1);
        }

        logger.info(`Found user: ${proUser.email} (${proUser._id})`);
        logger.info(`Found problem: ${problem.title} (${problem._id})`);

        // Create High-Quality Design
        const nodes = [
            // Client Tier
            {
                id: 'client',
                type: 'custom',
                position: { x: 50, y: 300 },
                data: { label: 'Client (Web/Mobile)', nodeType: 'client', config: {} },
            },
            {
                id: 'cdn',
                type: 'custom',
                position: { x: 250, y: 300 },
                data: { label: 'CDN (Cloudfront)', nodeType: 'cdn', config: { provider: 'AWS CloudFront' } },
            },
            // Application Tier
            {
                id: 'lb',
                type: 'custom',
                position: { x: 450, y: 300 },
                data: { label: 'Load Balancer', nodeType: 'loadBalancer', config: { algorithm: 'Least Connections' } },
            },
            {
                id: 'web-1',
                type: 'custom',
                position: { x: 650, y: 150 },
                data: { label: 'Web Server 1', nodeType: 'webServer', config: { instances: 2 } },
            },
            {
                id: 'web-2',
                type: 'custom',
                position: { x: 650, y: 300 },
                data: { label: 'Web Server 2', nodeType: 'webServer', config: { instances: 2 } },
            },
            {
                id: 'web-3',
                type: 'custom',
                position: { x: 650, y: 450 },
                data: { label: 'Web Server 3', nodeType: 'webServer', config: { instances: 2 } },
            },
            // Data Tier - Cache
            {
                id: 'cache',
                type: 'custom',
                position: { x: 850, y: 150 },
                data: { label: 'Redis Cluster', nodeType: 'cache', config: { purpose: 'URL Mapping Cache', policy: 'LRU' } },
            },
            // Data Tier - Database
            {
                id: 'db-primary',
                type: 'custom',
                position: { x: 850, y: 350 },
                data: { label: 'DB Master (Write)', nodeType: 'database', config: { type: 'PostgreSQL', role: 'Primary' } },
            },
            {
                id: 'db-replica',
                type: 'custom',
                position: { x: 1050, y: 350 },
                data: { label: 'DB Slave (Read)', nodeType: 'database', config: { type: 'PostgreSQL', role: 'Replica' } },
            },
            // Async Tier
            {
                id: 'queue',
                type: 'custom',
                position: { x: 850, y: 550 },
                data: { label: 'Kafka Queue', nodeType: 'messageQueue', config: { topic: 'click-events' } },
            },
            {
                id: 'analytics',
                type: 'custom',
                position: { x: 1050, y: 550 },
                data: { label: 'Analytics Worker', nodeType: 'analytics', config: { batchSize: 100 } },
            },
        ];

        const edges = [
            // Client -> CDN -> LB
            { id: 'e1', source: 'client', target: 'cdn', animated: true },
            { id: 'e2', source: 'cdn', target: 'lb', animated: true },

            // LB -> Web Servers
            { id: 'e3', source: 'lb', target: 'web-1', animated: true },
            { id: 'e4', source: 'lb', target: 'web-2', animated: true },
            { id: 'e5', source: 'lb', target: 'web-3', animated: true },

            // Web Servers -> Cache (Read/Write)
            { id: 'e6', source: 'web-1', target: 'cache', animated: true, label: 'Read/Write' },
            { id: 'e7', source: 'web-2', target: 'cache', animated: true, label: 'Read/Write' },
            { id: 'e8', source: 'web-3', target: 'cache', animated: true, label: 'Read/Write' },

            // Web Servers -> DB Master (Write)
            { id: 'e9', source: 'web-1', target: 'db-primary', animated: true, label: 'Write' },
            { id: 'e10', source: 'web-2', target: 'db-primary', animated: true, label: 'Write' },
            { id: 'e11', source: 'web-3', target: 'db-primary', animated: true, label: 'Write' },

            // DB Master -> Replica (Replication)
            { id: 'e12', source: 'db-primary', target: 'db-replica', animated: true, style: { strokeDasharray: '5,5' }, label: 'Replication' },

            // Web Servers -> Queue (Async)
            { id: 'e13', source: 'web-1', target: 'queue', animated: true, label: 'Event' },
            { id: 'e14', source: 'web-2', target: 'queue', animated: true, label: 'Event' },
            { id: 'e15', source: 'web-3', target: 'queue', animated: true, label: 'Event' },

            // Queue -> Analytics
            { id: 'e16', source: 'queue', target: 'analytics', animated: true, label: 'Process' },
        ];

        // Update or create design
        await Design.findOneAndUpdate(
            { userId: proUser._id.toString(), problemId: problem._id.toString() },
            {
                nodes,
                edges,
                updatedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        logger.success('✅ Successfully seeded/updated URL Shortener design for pro@example.com');
        logger.info('Run the app and check the workspace.');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        logger.error('❌ Error seeding design:', error);
        process.exit(1);
    }
};

seedProDesign();
