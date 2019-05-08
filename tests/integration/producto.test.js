const { Producto } = require('../../models/producto');
const { Usuario } = require('../../models/usuario');
const request = require('supertest');
const mongoose = require('mongoose');
let server;

describe('/api/producto', () => {

    beforeAll(() => { server = require('../../index'); });
    afterEach(async () => { 
        await Producto.deleteMany({});
        await Usuario.deleteMany({});
    });
    afterAll(async () => {
        server.close(); 
        await mongoose.connection.close();
    });
    
    describe('GET /', () => {
        it('should return all the Productos de un usuario', async () => {
            const usuario = new Usuario({
                name: 'Pepe',
                email: 'pepe@gmail.com',
                password: '1',
                gender: 'Male'
            });
            await usuario.save();
            const token = usuario.generarAuthToken();

            await Producto.collection.insertMany([
                { name: 'Queso', unidad: '5', cantidad: 1,categoria: 'Despensa',  fecha: '05/05/19', usuario: usuario.id},
                { name: 'Sal', unidad: '5', cantidad: 1, categoria: 'Despensa', fecha: '05/05/19', usuario: usuario.id},
                { name: 'Azucar', unidad: '5', cantidad: 1, categoria: 'Despensa', fecha: '05/05/19', usuario: usuario.id}
            ]);
            const res = await request(server)
                    .get('/api/producto')
                    .set('x-auth-token', token);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(producto => producto.name === 'Queso')).toBeTruthy();
        });
    });

    describe('GET /:name', async () => {
        it('should return a Producto given its name', async () => {
            const producto = new Producto({
                name: 'Queso',
                unidad: 'kg',
                cantidad: '3',
                categoria: 'Despensa',
                fecha: '05/05/19',
                usuario: '5cb6b99b7734766a84b8431d'
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
        it('should save the Producto if valid', async () => {
            const usuario = new Usuario({
                name: 'Pepe',
                email: 'pepe@gmail.com',
                password: '1',
                gender: 'Male'
            });
            await usuario.save();
            const token = usuario.generarAuthToken();

            let producto = {
                name: 'Queso',
                unidad: 'kg',
                cantidad: '3',
                categoria: 'Despensa',
                usuario: usuario.id
            };
            const res = await request(server)
                .post('/api/producto/add')
                .set('x-auth-token', token)
                .send(producto);
            producto = await Producto.findOne({ name: producto.name });
            expect(producto).not.toBeNull();
        });

        it('should return the Producto if valid', async () => {
            const usuario = new Usuario({
                name: 'Pepe',
                email: 'pepe@gmail.com',
                password: '1',
                gender: 'Male'
            });
            await usuario.save();
            const token = usuario.generarAuthToken();

            let producto = {
                name: 'Queso',
                unidad: 'kg',
                cantidad: '3',
                categoria: 'Despensa',
                usuario: usuario.id
            };
            const res = await request(server)
                .post('/api/producto/add')
                .set('x-auth-token', token)
                .send(producto);
            producto = await Producto.findOne({ name: producto.name });         

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('name', producto.name);
        });
    });

    describe('Delete /:name', () => {
        it('should delete a Product given its name por usuario ', async () => {
            const usuario = new Usuario({
                name: 'Pepe',
                email: 'pepe@gmail.com',
                password: '1',
                gender: 'Male'
            });
            await usuario.save();
            const token = usuario.generarAuthToken();

            let producto = new Producto({
                name: 'Queso',
                unidad: 'kg',
                cantidad: '3',
                categoria: 'Despensa',
                fecha: '05/05/19',
                usuario: usuario.id
            });
            await producto.save();

            const res = await request(server)
                .delete(`/api/producto/${producto.name}`)
                .set('x-auth-token', token)
                .send(producto);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', producto.name);
        });

        
        it('should return 404 if invalid name is passed (delete)', async () => {
            const res = await request(server).get(`/api/producto/miel`);
            expect(res.status).toBe(404);
        });

    });


    describe('PUT /:name', () => {
        it('should return a Product given its name (put)', async () => {
            const usuario = new Usuario({
                name: 'Pepe',
                email: 'pepe@gmail.com',
                password: '1',
                gender: 'Male'
            });
            await usuario.save();
            const token = usuario.generarAuthToken();

            let producto = new Producto({
                name: 'Queso',
                unidad: 'kg',
                cantidad: '3',
                categoria: 'Despensa',
                fecha: '05/05/19',
                usuario: usuario.id
            });
            await producto.save();

            let producto2 = {
                name: 'Pan',
                unidad: 'kg',
                cantidad: '3',
                categoria: 'Despensa',
                usuario: usuario.id
            };
            
            const res = await request(server)
                .put(`/api/producto/${ producto.name }`)
                .set('x-auth-token', token)
                .send(producto2);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', producto2.name);

        });

        it('should return 404 if invalid name is passed (put)', async () => {
            const res = await request(server).get(`/api/producto/miel`);
            expect(res.status).toBe(404);
        });

    });

    

});