import request from 'supertest'
import { getConnection } from 'typeorm';
import { app } from '../app'
import createConnection from '../database';

describe("Usesr", () =>{
    beforeAll(async() => {
        const connection = await createConnection()
        await connection.runMigrations()
    })

    afterAll(async()=>{
        const connection = getConnection()
        await connection.dropDatabase()
        await connection.close()
    })
    
    it("Should be able to create a new user", async() =>{
        const response = await request(app).post("/users").
        send({
            name:"testapi2",
            email: "testapi2@email.com"
        
        })

        expect(response.status).toBe(201)
    })

    it("Shoudn't able to create a user with exists email",async() =>{
        const response = await request(app).post("/users").
        send({
            name:"testapi2",
            email: "testapi2@email.com"
        
        })

        expect(response.status).toBe(400)
    })
})