import { OkPacket } from "mysql2";
import { execute } from "../1-dal/dalSql";
import { hashedPassword } from "../1-dal/hashedPssword";
import { UserInterface } from "../4-models/UserModel";

export async function getAllUsers() {
    const query = 'SELECT * FROM users'
    const [results] = await execute(query)
    return results
}

export async function register(user: UserInterface) {
    const { firstName, lastName, email, password } = user;
    const checkIfEmailExistQuery = `SELECT * FROM users WHERE email = ?`
    const [emailResults] = await execute<OkPacket>(checkIfEmailExistQuery, [email]);
    if (emailResults.length > 0) {
        return 'Email already exist'
    } else {
        const query = 'INSERT INTO users(firstName,lastName,email,password) VALUES(?,?,?,?)'
        const [results] = await execute<OkPacket>(query, [firstName, lastName, email, password])
        console.log(results)
        user.id = results.insertId;
        user.role = "USER"
        return results
    }
}

// export async function login(email: string, password: string) {
//     const query = 'SELECT * FROM users WHERE email = ? AND password = ?'
//     const [results] = await execute<OkPacket>(query, [email, hashedPassword(password)])
//     return results;
// }