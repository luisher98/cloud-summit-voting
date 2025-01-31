import { Request, Response } from 'express';
import { VoteModel } from '../../models/vote.js';
import { VoteTallyModel, updateVoteTallies } from '../../models/voteTally.js';
import { isValidProviderId } from '../../config/providers.js';

export async function castVote(req: Request, res: Response): Promise<void> {
    try {
        const { userId, providerId } = req.body;

        if (!userId || !providerId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        if (!isValidProviderId(providerId)) {
            res.status(400).json({ error: 'Invalid provider ID' });
            return;
        }

        const existingVote = await VoteModel.findOne({ userId });
        if (existingVote) {
            res.status(400).json({ error: 'User has already voted' });
            return;
        }

        await VoteModel.create({
            userId,
            providerId,
            timestamp: new Date()
        });

        await updateVoteTallies();

        res.json({ message: 'Vote recorded successfully' });
    } catch (error) {
        console.error('Error casting vote:', error);
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
}

export async function getVoteTallies(_req: Request, res: Response): Promise<void> {
    try {
        const tallies = await VoteTallyModel.find().sort({ count: -1 });
        res.json(tallies);
    } catch (error) {
        console.error('Error getting vote tallies:', error);
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
} 