import express from "express";
import routes from "./src/routes.js";
import dotenv from "dotenv";


dotenv.config();

const api = express();
api.use(express.json());
api.get('/', (_, res) => res.send({ 'message': 'API Up' }));
api.get("/terms", (req, res) => {
    return res.json({
        message: "Termos de Uso"
    });
});

api.use('/v1', routes);

api.listen(3000, () => {
    console.log("Server up");
})