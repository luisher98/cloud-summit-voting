import request from 'supertest';
import { app } from '../../server/server.js';
import { createVote } from '../helpers.js';
import { VoteModel } from '../../models/vote.js';
import { VoteTallyModel } from '../../models/voteTally.js';
import { connectDB, disconnectDB, clearDB } from '../../db/mongo.js';
import { updateVoteTallies } from '../../models/voteTally.js';

describe('Voting API', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await disconnectDB();
    });

    beforeEach(async () => {
        await clearDB();
    });

    describe('POST /api/vote', () => {
        it('should create a new vote', async () => {
            const voteData = {
                userId: 'user123',
                providerId: 'aws'
            };

            const response = await request(app)
                .post('/api/vote')
                .send(voteData)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Vote recorded successfully'
            });

            // Verify vote was saved
            const vote = await VoteModel.findOne({ userId: voteData.userId });
            expect(vote).toBeTruthy();
            expect(vote?.providerId).toBe(voteData.providerId);
        });

        it('should prevent duplicate votes from same user', async () => {
            // Create initial vote
            await createVote('user123', 'aws');

            // Try to vote again
            const response = await request(app)
                .post('/api/vote')
                .send({
                    userId: 'user123',
                    providerId: 'gcp'
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should reject invalid provider IDs', async () => {
            const response = await request(app)
                .post('/api/vote')
                .send({
                    userId: 'user123',
                    providerId: 'invalid-provider'
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/tallies', () => {
        beforeEach(async () => {
            // Create test votes instead of tallies
            await Promise.all([
                createVote('user1', 'aws'),
                createVote('user2', 'aws'),
                createVote('user3', 'aws'),
                createVote('user4', 'aws'),
                createVote('user5', 'aws'),
                createVote('user6', 'gcp'),
                createVote('user7', 'gcp'),
                createVote('user8', 'gcp'),
                createVote('user9', 'azure'),
                createVote('user10', 'azure'),
            ]);
            await updateVoteTallies();
        });

        it('should return vote tallies in descending order', async () => {
            const response = await request(app)
                .get('/api/tallies')
                .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
            expect(response.body[0].providerId).toBe('aws');
            expect(response.body[0].count).toBe(5);
            expect(response.body[1].providerId).toBe('gcp');
            expect(response.body[1].count).toBe(3);
            expect(response.body[2].providerId).toBe('azure');
            expect(response.body[2].count).toBe(2);
        });

        it('should update tally when new vote is cast', async () => {
            // Cast a new vote
            await request(app)
                .post('/api/vote')
                .send({
                    userId: 'newuser',
                    providerId: 'aws'
                })
                .set('Content-Type', 'application/json');

            // Check updated tallies
            const tally = await VoteTallyModel.findOne({ providerId: 'aws' });
            expect(tally?.count).toBe(6);
        });
    });
}); 