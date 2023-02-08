import express from 'express';
import { execute } from '../1-dal/dalSql';
import { addVacation, deleteVacation, editVacation, getActiveVacations, getAllVacations, getComingVacations, getSumOfActiveVacation, getSumOfComingVacation, getSumOfVacations } from '../2-logic/vacationLogic';
import { verifyUser } from '../3-middlewares/verifyUser';

export const VacationRoute = express.Router();

VacationRoute.get('/vacation', verifyUser, async (req: any, res: any) => {
    const offset = req.query.offset || 0
    try {
        const response = await getAllVacations(+offset);
        res.status(200).json(response)
    } catch (e) {
        res.status(400).json(e)
    }
})

VacationRoute.post('/vacation/add', verifyUser, async (req: any, res: any) => {
    const vacation = req.body
    const file = req.files.imageName
    console.log(file);

    try {
        const response = await addVacation(vacation, file);
        res.status(200).json(response)
    } catch (e) {
        res.status(400).json(e)
    }
})

VacationRoute.delete('/vacation/delete/:id', verifyUser, async (req: any, res: any) => {
    const id = req.params.id;
    try {
        const response = await deleteVacation(+id);
        res.status(200).json(response);
    } catch (e) {
        res.status(400).json(e)
    }
})

VacationRoute.put('/vacation/edit', async (req: any, res: any) => {
    const vacation = req.body
    const file = req.files
    try {
        const response = await editVacation(vacation, file);
        res.status(200).json(response)
    } catch (e) {
        res.status(400).json(e)
    }
})

VacationRoute.get('/vacation/sum', async (req, res) => {
    try {
        const response = await getSumOfVacations();
        res.status(200).json(response)
    } catch (e) {
        res.status(400).json(e)
    }
})

VacationRoute.get('/vacation/active',async (req,res)=>{
    const offset = req.query.offset || 0
    try{
        const response = await getActiveVacations(+offset);
        res.status(200).json(response);
    }catch(e){
        res.status(400).json(e)
    }
})

VacationRoute.get('/vacation/active/sum',async (req,res)=>{
    try {
        const response = await getSumOfActiveVacation();
        res.status(200).json(response)
    } catch (e) {
        res.status(400).json(e)
    }
})

VacationRoute.get('/vacation/coming',async (req,res)=>{
    try{
        const response = await getComingVacations();
        res.status(200).json(response);
    }catch(e){
        res.status(400).json(e)
    }
})

VacationRoute.get('/vacation/coming/sum',async (req,res)=>{
    try {
        const response = await getSumOfComingVacation();
        res.status(200).json(response)
    } catch (e) {
        res.status(400).json(e)
    }
})