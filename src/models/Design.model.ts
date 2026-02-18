import mongoose, { Schema, Document } from 'mongoose';
import { IDesign } from '../types';

interface IDesignDocument extends Omit<IDesign, '_id'>, Document { }

const designSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required: [true, 'Problem ID is required'],
    },
    nodes: {
        type: [Schema.Types.Mixed],
        default: [],
    },
    edges: {
        type: [Schema.Types.Mixed],
        default: [],
    },
    feedback: {
        type: Schema.Types.Mixed,
        default: null,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});

// Index for faster queries
designSchema.index({ userId: 1, createdAt: -1 });
designSchema.index({ problemId: 1 });

const Design = mongoose.model<IDesignDocument>('Design', designSchema);

export default Design;
