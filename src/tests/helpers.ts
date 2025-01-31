import { VoteModel } from '../models/vote.js';
import type { ProviderId } from '../config/providers.js';

export async function createVote(userId: string, providerId: ProviderId) {
    return await VoteModel.create({
        userId,
        providerId,
        timestamp: new Date()
    });
} 