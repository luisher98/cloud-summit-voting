import { VoteModel } from '../../models/vote.js';

describe('Vote Model', () => {
    it('should create a vote with valid data', async () => {
        const validVote = {
            userId: 'testuser',
            providerId: 'aws',
            timestamp: new Date()
        };

        const vote = await VoteModel.create(validVote);
        expect(vote.userId).toBe(validVote.userId);
        expect(vote.providerId).toBe(validVote.providerId);
    });

    it('should require userId', async () => {
        const invalidVote = {
            providerId: 'aws',
            timestamp: new Date()
        };

        await expect(VoteModel.create(invalidVote)).rejects.toThrow();
    });

    it('should enforce unique userId constraint', async () => {
        const vote1 = {
            userId: 'testuser',
            providerId: 'aws',
            timestamp: new Date()
        };

        const vote2 = {
            userId: 'testuser',
            providerId: 'gcp',
            timestamp: new Date()
        };

        await VoteModel.create(vote1);
        await expect(VoteModel.create(vote2)).rejects.toThrow();
    });
}); 