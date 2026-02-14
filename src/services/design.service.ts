import Design from '../models/Design.model';
import { DesignInput } from '../validators/design.validator';

export class DesignService {
    async createDesign(userId: string, data: DesignInput) {
        const design = await Design.create({
            userId,
            problemId: data.problemId,
            nodes: data.nodes,
            edges: data.edges,
        });

        return design;
    }

    async getUserDesigns(userId: string) {
        const designs = await Design.find({ userId })
            .populate('problemId', 'title difficulty')
            .select('-__v')
            .sort({ createdAt: -1 });

        return designs;
    }

    async getDesignById(designId: string, userId: string) {
        const design = await Design.findOne({ _id: designId, userId })
            .populate('problemId', 'title difficulty description')
            .select('-__v');

        if (!design) {
            throw new Error('Design not found or access denied');
        }

        return design;
    }
}

export default new DesignService();
