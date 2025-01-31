import mongoose from 'mongoose';
import { ProviderId } from '../config/providers.js';
import { VoteModel } from './vote.js';

export interface VoteTally {
    providerId: ProviderId;
    count: number;
    lastUpdated: Date;
}

const voteTallySchema = new mongoose.Schema<VoteTally>({
    providerId: { 
        type: String, 
        required: true,
        unique: true,
        enum: ['aws', 'gcp', 'azure', 'digitalocean']
    },
    count: { 
        type: Number, 
        required: true,
        default: 0 
    },
    lastUpdated: { 
        type: Date, 
        required: true,
        default: Date.now 
    }
});

export const VoteTallyModel = mongoose.model<VoteTally>('VoteTally', voteTallySchema);

export async function updateVoteTallies(): Promise<void> {
    try {
        // Get counts for all providers
        const tallies = await VoteModel.aggregate([
            {
                $group: {
                    _id: '$providerId',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Update or create tally documents
        await Promise.all(
            tallies.map(tally => 
                VoteTallyModel.findOneAndUpdate(
                    { providerId: tally._id },
                    {
                        $set: {
                            count: tally.count,
                            lastUpdated: new Date()
                        }
                    },
                    { upsert: true, new: true }
                )
            )
        );
    } catch (error) {
        console.error('Error updating vote tallies:', error);
        throw error;
    }
} 