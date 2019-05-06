const { Producto } = require('../../models/producto');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/producto', () => {

    beforeAll(() => { server = require('../../index'); });
    afterEach(async () => { 
        await Producto.deleteMany({});
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

    describe('GET /:name', () => {
        it('should return a Producto given its name', async () => {
            const producto = new Producto({
                name: 'Queso',
                unidad: 'kg',
                cantidad: '3',
                categoria: 'Despensa',
                /*fecha: '05/05/2019',
                usuario: '5cb6b99b7734766a84b8431d'*/
            });
            await producto.save();
            const res = await request(server).get(`/api/producto/${ producto.name }`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', producto.name);
        });

        it('should return 404 if invalid name is passed', async () => {
            const res = await request(server).get(`/api/producto/miel`);
            expect(res.status).toBe(404);
        });
    });

    
    describe('POST /', () => {
        it('should return 409 if Producto already exists', async () => {
            let producto = new Producto({
                name: 'Queso',
                unidad: 'kg',
                cantidad: '3',
                categoria: 'Despensa',
                /*fecha: '05/05/2019',
                usuario: '5cb6b99b7734766a84b8431d'*/
            });
            await producto.save();
            producto = {
                name: 'Queso',
                unidad: 'kg',
                cantidad: '3',
                categoria: 'Despensa',
                /*fecha: '05/05/2019',
                usuario: '5cb6b99b7734766a84b8431d'*/
            }
            const res = await request(server)
                .post('/api/producto/add')
                .send(producto);            
            expect(res.status).toBe(409);
        });
        /*
        it('should save the Usuario if valid', async () => {
            let usuario = new Usuario({
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
            let usuario = new Usuario({
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

    
    describe('Delete /:name', () => {

        it('should delete a Product given its name', async () => {

            const producto = new Producto({
                name: 'Queso',
                unidad: 'kg',
                cantidad: '3',
                categoria: 'Despensa',
                fecha: '05/05/2019',
                usuario: '5cb6b99b7734766a84b8431d'
            });
            await producto.save()
            const res = await request(server).get(`/api/producto/${ producto.name }`);

            expect(res.status).toBe(200);
            //expect(res.body).toHaveProperty('name', pokemon.name);

        });

        it('should return 404 if invalid name is passed (delete)', async () => {
            const res = await request(server).get(`/api/producto/miel`);
            expect(res.status).toBe(404);
        });

    });

    

    describe('PUT /:name', () => {

        it('should return a Product given its email', async () => {

            const producto = new Producto({
                name: 'Queso',
                unidad: 'kg',
                cantidad: '3',
                categoria: 'Despensa',
                fecha: '05/05/2019',
                usuario: '5cb6b99b7734766a84b8431d'
            });
            await producto.save();

            const res = await request(server).get(`/api/producto/${ producto.name }`);

            expect(res.status).toBe(200);
            //expect(res.body).toHaveProperty('name', pokemon.name);

        });

        it('should return 404 if invalid name is passed (put)', async () => {
            const res = await request(server).get(`/api/producto/miel`);
            expect(res.status).toBe(404);
        });

    });

    

});