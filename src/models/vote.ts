import mongoose from 'mongoose';
import { ProviderId } from '../config/providers.js';

export interface Vote {
    userId: string;
    providerId: ProviderId;
    timestamp: Date;
}

const voteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    providerId: {
        type: String,
        required: true,
        enum: ['aws', 'gcp', 'azure', 'digitalocean']
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export const VoteModel = mongoose.model('Vote', voteSchema); 