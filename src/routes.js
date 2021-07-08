import express from 'express';
import { usersDB, messagesDB } from './db.js';
import { encrypt, decrypt } from './services/cypto.js';


const routes = express();
routes.use(express.json());

routes.get('/', (_, res) => res.send({ message: 'navegando nas rotas' }));

routes.post('/signup', async (req, res) => {
    const data = await usersDB.doc(req.body.email).get();
    if(!data._fieldsProto) {
        const user = await usersDB.doc(req.body.email).set({
            email: req.body.email,
            password: encrypt(req.body.password)
        });
        if(user._writeTime) {
            const response = await usersDB.doc(req.body.email).get();
            res.send(response._fieldsProto.email);
        } else {
            res.send({ error: 'Error' });
        }
    }else {
        res.status(401).send({ error: 'User e-mail alread exist.' });
    }
});

routes.get('/signin', async (req, res) => {
    const data = await usersDB.doc(req.body.email).get();
    if(data._fieldsProto) {
        if(decrypt(req.body.password, data._fieldsProto.password.stringValue))
            res.send({ status: true });
        else
            res.status(401).send({ status: false, error: 'Error with user e-mail or password.' });
    }else {
        res.status(401).send({ error: 'Error with user e-mail or password.' });
    }
});

routes.get('/messages', async (req, res) => {
    const data = await messagesDB.get();
    res.send(data);
});

routes.post('/message', async (req, res) => {
    const date = + new Date();
    const data = {
        user_id: req.body.user_id,
        message: req.body.message,
        created_at: date,
        updated_at: date
    };
    messagesDB.doc().set(data);
    res.send(data);
});

routes.put('/message/:id', async (req, res) => {});

routes.get('/message/:id', async (req, res) => {})

export default routes;