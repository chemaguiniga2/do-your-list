const { Usuario } = require('../../models/usuario');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api', () => {

    beforeAll(() => { server = require('../../index'); });
    afterEach(async () => { 
        await Usuario.deleteMany({});
    });
    afterAll(async () => {
        server.close(); 
        await mongoose.connection.close();
    });
    
    /*describe('GET /', () => {
        it('should return all the Usuarios', async () => {
            await Usuario.collection.insertMany([
                { name: 'user1', email: 'user1@gmail.com', password: 1, gender: 'Male'}
            ]);
            const res = await request(server).get('/api');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body.some(usuario => usuario.email === 'user1@gmail.com')).toBeTruthy();
        });
    });*/

    describe('GET /:email', () => {
        it('should return a Usuario given its email', async () => {
            const usuario = new Usuario({
                name: 'Pepe',
                email: 'pepe@gmail.com',
                password: '1',
                gender: 'Male'
            });
            await usuario.save();
            const res = await request(server).get(`/api/${ usuario.email }`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email', usuario.email);
        });
        it('should return 404 if invalid email is passed', async () => {
            const res = await request(server).get(`/api/p@gmail.com`);
            expect(res.status).toBe(404);
        });
    });

    
    describe('POST /', () => {
        it('should return 409 if Usuario already exists', async () => {
            let usuario = new Usuario({
                name: 'Pepe',
                email: 'pepe@gmail.com',
                password: '1',
                gender: 'Male'
            });
            await usuario.save();
            usuario = {
                name: 'Pepe',
                email: 'pepe@gmail.com',
                password: '1',
                gender: 'Male'
            }
            const res = await request(server)
                .post('/api/register')
                .send(usuario);            
            expect(res.status).toBe(409);
        });
        
        /*it('should save the Usuario if valid', async () => {
            const usuario = new Usuario({
                name: 'Pepe',
                email: 'pepee@gmail.com',
                password: '1',
                gender: 'Male'
            });
            const res = await request(server)
                .post('/api/register')
                .send(usuario);
            usuario = await Usuario.findOne({ email: usuario.email });
            console.log("usuario: " + usuario);
            expect(usuario).not.toBeNull();
        });*/

        /*it('should return the Usuario if valid', async () => {
            const usuario = new Usuario({
                name: 'Pepe',
                email: 'pepe@gmail.com',
                password: '1',
                gender: 'Male'
            });
            const res = await request(server)
                .post('/api/register')
                .send(usuario);             
            expect(res.status).toBe(201);


            //expect(res.body).toHaveProperty('email', usuario.email);
        });*/
    });

    
    describe('Delete /:email', () => {

        it('should delete a Usuario given its email', async () => {

            const usuario = new Usuario({

                name: 'Luis',
                email: 'luis@gmail.com',
                password: '1',
                gender: 'Male'
            });
            await usuario.save()
            const res = await request(server).get(`/api/${ usuario.email }`);

            expect(res.status).toBe(200);
            //expect(res.body).toHaveProperty('name', pokemon.name);

        });

        it('should return 404 if invalid email is passed (delete)', async () => {
            const res = await request(server).get(`/api/uno@gmail.com`);
            expect(res.status).toBe(404);
        });

    });

    

    describe('PUT /:email', () => {

        it('should return a Usuario given its email', async () => {

            const usuario = new Usuario({
                name: 'Paco',
                email: 'paco@gmail.com',
                password: '1',
                gender: 'Male'
            });
            await usuario.save();

            const res = await request(server).get(`/api/${ usuario.email }`);

            expect(res.status).toBe(200);
            //expect(res.body).toHaveProperty('name', pokemon.name);

        });

        it('should return 404 if invalid email is passed (put)', async () => {
            const res = await request(server).get(`/api/jj@gmail.com`);
            expect(res.status).toBe(404);
        });

    });

    

});