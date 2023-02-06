import express from 'express';
import { addVacation, deleteVacation, editVacation, getAllVacations } from '../2-logic/vacationLogic';
import { verifyUser } from '../3-middlewares/verifyUser';

export const VacationRoute = express.Router();

VacationRoute.get('/vacation', verifyUser, async (req, res) => {
    const offset = req.query.offset || 0
    try {
        const response = await getAllVacations(+offset);
        res.status(200).json(response)
    } catch (e) {
        res.status(400).json(e)
    }
})

VacationRoute.post('/vacation/add', verifyUser, async (req: any, res) => {
    const vacation = req.body
    const file = req.files.imageName
    try {
        const response = await addVacation(vacation, file);
        res.status(200).json(response)
    } catch (e) {
        res.status(400).json(e)
    }
})

VacationRoute.delete('/vacation/delete/:id', verifyUser, async (req, res) => {
    const id = req.params.id;
    try {
        const response = await deleteVacation(+id);
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json(e)
    }
})

VacationRoute.put('/vacation/edit', async (req: any, res) => {
    const vacation = req.body
    const file = req.files
    console.log(vacation, file);


    try {
        const response = await editVacation(vacation,file);
        res.status(200).json(response)
    } catch (e) {
        res.status(400).json(e)
    }
})