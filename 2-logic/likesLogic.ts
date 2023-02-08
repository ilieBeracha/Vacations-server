import { OkPacket } from "mysql2"
import { execute } from "../1-dal/dalSql"

export async function likeOrUnlikeVacation(userId: number, vacationId: number) {
    const checkIfLikedQuery = 'SELECT * FROM likes WHERE userId = ? AND vacationId = ?'
    const [checkIfLikedResults] = await execute<OkPacket>(checkIfLikedQuery, [userId, vacationId]);

    if (checkIfLikedResults.length === 0) {
        const query = 'INSERT INTO likes (userId,vacationId) VALUES(?,?)'
        const [results] = await execute<OkPacket>(query, [userId, vacationId]);
        return results;
    } else {
        const removeLikeQuery = 'DELETE FROM likes WHERE userId = ? AND vacationId = ?'
        const [removeLikesResults] = await execute<OkPacket>(removeLikeQuery, [userId, vacationId]);
        return removeLikesResults;
    }
}

export async function getLikesCountPerVacation(vacationId:number,userId: number) {
    const query = `SELECT vacations.id, COUNT(likes.vacationId) AS likes,
    CASE WHEN EXISTS (SELECT * FROM likes 
                     WHERE likes.vacationId = vacations.id 
                     AND likes.userId = ${userId} 
                     AND vacations.id = ${vacationId}) THEN 'true' ELSE 'false' END AS liked 
    FROM vacations 
    JOIN likes ON vacations.id = likes.vacationId 
    WHERE vacations.id = ${vacationId}
    GROUP BY vacations.id`;

    const [results] = await execute(query);
    return results;
}

export async function getAllLikesForGraph(){
    const query = 'SELECT vacations.destination, COUNT(likes.vacationId) as likes FROM vacations LEFT JOIN likes ON vacations.id = likes.vacationId GROUP BY vacations.destination'
    const [results] = await execute(query);
    return results;
}