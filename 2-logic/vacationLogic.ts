import { OkPacket } from "mysql2";
import { execute } from "../1-dal/dalSql";
import { VacationInterface } from "../4-models/VacationModel";
import { deleteImageFromS3, saveImagesToS3 } from "./awsLogic";
const uniqid = require('uniqid');

export async function getAllVacations(offset: number) {
    const query = `SELECT id ,destination, description, DATE_FORMAT(startingDate, "%Y-%m-%d") AS startingDate, DATE_FORMAT(endingDate, "%Y-%m-%d") AS endingDate, price, imageName FROM vacations ORDER BY startingDate LIMIT 10 OFFSET ${offset}`;
    const [results] = await execute<OkPacket>(query);
    return results;
}

export async function addVacation(vacation: VacationInterface, file: any) {
    const imageKey = uniqid();
    let key = await saveImagesToS3(file, imageKey)
    const { destination, description, startingDate, endingDate, price } = vacation;
    const query = 'INSERT INTO vacations(destination,description,startingDate,endingDate,price,imageName) VALUES(?,?,?,?,?,?)';
    const [results] = await execute<OkPacket>(query, [destination, description, startingDate, endingDate, price, key]);
    return results;
}

export async function deleteVacation(id: number) {
    const getImageNameQuery = 'SELECT imageName FROM vacations WHERE id = ?'
    const [imageNameResults] = await execute<OkPacket>(getImageNameQuery, [id]);
    await deleteImageFromS3(imageNameResults[0].imageName);

    const query = 'DELETE FROM vacations WHERE id = ?'
    const [results] = await execute<OkPacket>(query, [id])
    return results;
}

export async function editVacation(vacation: VacationInterface, file: any) {
    if (file) {
        const { destination, description, startingDate, endingDate, price, id } = vacation;
        const getPrevFileFromDb = 'SELECT imageName FROM vacations WHERE id = ?'
        const [prevFileResults] = await execute<OkPacket>(getPrevFileFromDb, [id]);
        await deleteImageFromS3(prevFileResults[0].imageName)

        const imageKey = uniqid();
        let key = await saveImagesToS3(file.imageName, imageKey)
        const query = 'UPDATE vacations SET destination = ?, description = ?, startingDate = ?, endingDate = ?, price = ?,imageName = ? WHERE id = ?';
        const [results] = await execute<OkPacket>(query, [destination, description, startingDate, endingDate, price, key, id]);
        return results;
    } else {
        const { destination, description, startingDate, endingDate, price, id } = vacation;
        const query = 'UPDATE vacations SET destination = ?, description = ?, startingDate = ?, endingDate = ?, price = ? WHERE id = ?';
        const [results] = await execute<OkPacket>(query, [destination, description, startingDate, endingDate, price, id]);
        console.log(results);
        return results;
    }

}

export async function getSumOfVacations() {
    const query = 'SELECT count(*) as vacationsSum FROM vacations';
    const [results] = await execute(query);
    return results;
}

export async function getLikedVacations(id: number) {
    // const 
}

export async function getActiveVacations(offset:number) {
    const query = `SELECT id ,destination, description, DATE_FORMAT(startingDate, "%Y-%m-%d") AS startingDate, DATE_FORMAT(endingDate, "%Y-%m-%d") AS endingDate, price, imageName FROM vacations where startingDate < now() AND endingDate > now() LIMIT 10 OFFSET ${offset}`
    const [results] = await execute(query);
    return results;
}

export async function getComingVacations() {
    const query = 'select * from vacations where startingDate > now()'
    const [results] = await execute(query);
    return results;
}

