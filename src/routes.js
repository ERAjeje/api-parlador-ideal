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

const auth = function (req, res, next) {
    const token = req.headers.authorization
    if(token) {
        if(process.env.SECRET === token.split(" ")[1])
            next();
        else
            res.status(401).send({ status: false, message: 'Unauthorized' });
    } else {
        res.status(401).send({ status: false, message: 'Unauthorized' });
    }
};

routes.get('/messages', auth, async (req, res) => {
    const response = (await messagesDB.get()).docs;
    const data = response.map(item => {
        const r = {
            id: item._ref._path.segments[1],
            ...item.data()
        }
        return r;
    });
    res.send(data);
});

routes.post('/message', auth, async (req, res) => {
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

routes.put('/message/:id', auth, async (req, res) => {
    const { id } = req.params;
    let response = await messagesDB.doc(id).get();
    if(response.exists) {
        const { user_id, message } = req.body;
        if(user_id === response.data().user_id) {
            const date = + new Date();
            const data = await messagesDB.doc(id).set({
                message,
                updated_at: date
            }, { merge: true });
            res.send({ status: true, message: 'updated' })
        } else {
            res.status(401).send({ status: false, error: 'Unauthorized' })
        }
    } else {
        res.status(404).send({ error: `document id ${id} not found`, status: false });
    }
});

routes.get('/message/:id', auth, async (req, res) => {
    const { id } = req.params;
    const response = await messagesDB.doc(id).get();
    if(response.exists) {
        res.send(response.data())
    } else {
        res.status(404).send({ error: `document id ${id} not found`, status: false });
    }
})

routes.delete('/message/:id', auth, async (req, res) => {
    const id = req.params.id;
    const { user_id } = req.body;
    const response = await messagesDB.doc(id).get();
    if(response.exists && user_id === response.data().user_id) {
        await messagesDB.doc(id).delete();
        res.send({ status: true, message: 'deleted' });
    } else {
        res.status(401).send({ status: false, error: 'Unauthorized' });
    }
});

export default routes;