import dotenv from 'dotenv';
import mongoose, { Connection } from 'mongoose';
import UserSchema from './schemas/user.schema';

dotenv.config();

const { MONGO_BASE_URL, MONGO_URL, DB_PASSWORD, DB_USER } = process.env;

const POOL_SIZE = 20;
const models = [{ name: 'users', schema: UserSchema }];

const dbOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

class MongooseConnector {
  connectionPool: { db: string; connection: Connection }[];
  superConnection?: Connection;

  constructor() {
    this.connectionPool = [];
  }

  async init() {
    this.superConnection = await mongoose.createConnection(`${MONGO_BASE_URL}${DB_USER}:${DB_PASSWORD}${MONGO_URL}/super`, dbOptions);
  }

  async connect(db: string = 'Gesbanquete'): Promise<Connection> {
    if (db === 'super') {
      if (!this.superConnection) {
        this.superConnection = await mongoose.createConnection(`${MONGO_BASE_URL}${DB_USER}:${DB_PASSWORD}${MONGO_URL}/super`, dbOptions);
      }
      return this.superConnection as Connection;
    } else {
      const connectionOpenedIndex = this.connectionPool.findIndex((connection) => connection.db === db);
      if (connectionOpenedIndex >= 0) {
        const connection = this.connectionPool[connectionOpenedIndex].connection;
        this.connectionPool.push(this.connectionPool.splice(connectionOpenedIndex, 1)[0]);
        return connection;
      } else {
        const connection = await this.createConnection(db);
        connection.on('connected', () => `Mongoose correctly connected to ${db}`);
        connection.on('disconnected', () => `Mongoose correctly disconnected to ${db}`);
        if (this.connectionPool.length < POOL_SIZE) {
          this.connectionPool.push({ db, connection });
        } else {
          const deletedConnection = this.connectionPool.shift();
          await deletedConnection?.connection.close();
        }
        return connection;
      }
    }
  }

  async createConnection(db: string = 'Gesbanquete'): Promise<Connection> {
    const connection = await mongoose.createConnection(`${MONGO_BASE_URL}${DB_USER}:${DB_PASSWORD}${MONGO_URL}/${db}`, dbOptions);
    models.forEach(({ name, schema }) => {
      connection.model(name, schema);
    });
    return connection;
  }

  disconnectAllDBs(): Promise<void[]> {
    return Promise.all([...this.connectionPool.map(({ connection }) => connection.close()), this.superConnection?.close()]);
  }
}

const mongooseConnector = new MongooseConnector();
export default mongooseConnector;
