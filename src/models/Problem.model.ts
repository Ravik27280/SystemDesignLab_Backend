import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProblem } from '../types';
import { DIFFICULTY_LEVELS } from '../config/constants';

interface IProblemDocument extends IProblem, Document { }

const problemSchema = new Schema<IProblemDocument>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        difficulty: {
            type: String,
            enum: Object.values(DIFFICULTY_LEVELS),
            required: [true, 'Difficulty is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        functionalRequirements: {
            type: [String],
            default: [],
        },
        nonFunctionalRequirements: {
            type: [String],
            default: [],
        },
        scale: {
            users: { type: String },
            requests: { type: String },
            data: { type: String },
        },
        isPro: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

const Problem: Model<IProblemDocument> = mongoose.model<IProblemDocument>(
    'Problem',
    problemSchema
);

export default Problem;
