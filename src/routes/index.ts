import express from 'express';
import { requestQueueMiddleware } from '../middleware/requestQueue.js';
import { castVote, getVoteTallies } from './handlers/votes.js';

const router = express.Router();

export const apiRoutes = {
    vote: '/api/vote',
    tallies: '/api/tallies'
} as const;

router.post(apiRoutes.vote, requestQueueMiddleware, castVote);
router.get(apiRoutes.tallies, getVoteTallies);

export default router; 