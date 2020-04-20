import mongoose, { Connection } from 'mongoose';

class MongoDB {
    private connection: Connection;
    constructor() {
        this.connection = mongoose.connection;

        this.connection.on("connected", () => {
            console.log(`Mongo connected!`);
        });

        this.connection.on("reconnected", () => {
            console.log(`Mongo reconnected!`);
        });

        this.connection.on("disconnected", () => {
            console.log(`Mongo disconnected!`);
            console.log(`Trying to reconnect to Mongo...!`);

            setTimeout(() => {
                this.run().catch((er) => console.log(er));
            }, 3000)
        });
    }

    async run() {
        await mongoose.connect('<MongoURL>', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            autoReconnect: true,
            keepAlive: true
        })
    }
}

export default MongoDB;