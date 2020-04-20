import express, { Request, Response } from 'express';
import MongoDB from './db/moongoose';
import UserRoutes from './routes/userRoute/userRoute';

class Server {
    public app: express.Application;
    private PORT: number = 5000;

    constructor() {
        this.app = express();
        this.config();
        this.mongo();
        this.routes();
    }

    public config(): void {
        this.app.use(express.json());
    }

    public start(): void {
        this.app.listen(this.PORT, () => {
            console.log(`server running on ${this.PORT}`)
        })
    }

    private mongo(): void {
        const mongo = new MongoDB();
        mongo.run().catch((er) => { console.log(er) });
    }

    private routes() {
        this.app.use('/api/user', new UserRoutes().router)
    }
}

const server = new Server();
server.start();