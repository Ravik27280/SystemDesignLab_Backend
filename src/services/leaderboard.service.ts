import mongoose from 'mongoose';
import Design from '../models/Design.model';
import User from '../models/User.model';

export class LeaderboardService {
    /**
     * Get global leaderboard sorted by total score
     */
    async getGlobalLeaderboard(limit: number = 20) {
        // Aggregate all designs to sum scores by user
        const leaderboard = await Design.aggregate([
            // 1. Filter designs that have a score
            {
                $match: {
                    'evaluationResult.score': { $exists: true, $ne: null }
                }
            },
            // 2. Group by user and calculate total stats
            {
                $group: {
                    _id: '$userId',
                    totalScore: { $sum: '$evaluationResult.score' },
                    averageScore: { $avg: '$evaluationResult.score' },
                    problemsSolved: { $count: {} }
                }
            },
            // 3. Sort by total score descending
            { $sort: { totalScore: -1 } },
            // 4. Limit results
            { $limit: limit },
            // 5. Lookup user details
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            // 6. Unwind user array
            { $unwind: '$user' },
            // 7. Project final shape
            {
                $project: {
                    userId: '$_id',
                    name: '$user.name',
                    email: '$user.email', // Optional: maybe mask this
                    profileImage: '$user.profileImage', // If exists
                    totalScore: 1,
                    averageScore: { $round: ['$averageScore', 1] },
                    problemsSolved: 1,
                    role: '$user.role'
                }
            }
        ]);

        return leaderboard;
    }

    /**
     * Get specific user's rank and stats
     */
    async getUserRank(userId: string) {
        // Calculate total score for this user
        const userStats = await Design.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), 'evaluationResult.score': { $exists: true } } },
            {
                $group: {
                    _id: null,
                    totalScore: { $sum: '$evaluationResult.score' }
                }
            }
        ]);

        const totalScore = userStats.length > 0 ? userStats[0].totalScore : 0;

        // Count how many users have a higher score
        // This is a bit expensive, but accurate
        const designs = await Design.aggregate([
            { $match: { 'evaluationResult.score': { $exists: true } } },
            {
                $group: {
                    _id: '$userId',
                    totalScore: { $sum: '$evaluationResult.score' }
                }
            },
            { $match: { totalScore: { $gt: totalScore } } },
            { $count: 'higherRankCount' }
        ]);

        const rank = (designs.length > 0 ? designs[0].higherRankCount : 0) + 1;

        return {
            rank,
            totalScore
        };
    }
}

export default new LeaderboardService();
