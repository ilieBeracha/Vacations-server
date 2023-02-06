import express from 'express';
import { getLikesCountPerVacation, likeOrUnlikeVacation } from '../2-logic/likesLogic';
import { verifyUser } from '../3-middlewares/verifyUser';

export const LikesRoute = express.Router();

LikesRoute.post('/likes', verifyUser, async (req, res) => {
    const userId = req.body.userId;
    const vacationId = req.body.vacationId;
    try {
        const response = await likeOrUnlikeVacation(userId, vacationId);
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json(e)
    }
})

LikesRoute.post('/likes/vacation/:vacationId/:userId', async (req, res) => {
    const vacationId = req.params.vacationId;
    const userId = req.params.userId;
    try {
        const response = await getLikesCountPerVacation(+vacationId, +userId)
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json(e)
    }

})