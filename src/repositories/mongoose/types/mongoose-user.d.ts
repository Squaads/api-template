import { MongooseDocument } from 'mongoose';
import { User } from '../../../types/user';

export interface MongooseUser extends MongooseDocument, User {}
