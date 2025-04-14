import mongoose, { Types } from 'mongoose';

export interface VerificationRequest {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    links: string[];
    about: string;
    category: string;
    governmentId: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const VerificationRequestSchema = new mongoose.Schema<VerificationRequest>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    links: [{ type: String, required: true }],
    about: { type: String, required: true },
    category: { type: String, required: true },
    governmentId: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const VerificationRequestModel = mongoose.models.VerificationRequest || 
    mongoose.model<VerificationRequest>('VerificationRequest', VerificationRequestSchema);

export { Types };
