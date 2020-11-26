import mongoose from 'mongoose';
import MaterialSchema from '../../api/materials/material.schema';
import UserSchema from '../../api/users/user.schema';

const models = [
    { name: "materials", schema: MaterialSchema },
    { name: "users", schema: UserSchema },
];

models.forEach(({ name, schema }) => {
    mongoose.connection.model(name, schema);
})
