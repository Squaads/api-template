import  mongoose from 'mongoose';
import UserSchema from '../repositories/mongoose/schemas/user.schema';

const models = [
    { name: "users", schema: UserSchema },
];

models.forEach(({ name, schema }) => {
    mongoose.connection.model(name, schema);
})
