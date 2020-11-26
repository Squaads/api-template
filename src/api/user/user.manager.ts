import MongooseRepository from '../../repositories/mongoose/mongoose.repository'
import UserSchema from '../../repositories/mongoose/schemas/user.schema'
import BaseManager from '../../base/base.manager';
import { User } from '../../types/user';
import UserModel from './user.model';

export default class UserManager extends BaseManager<User> {
  constructor() {
    super(new UserModel(new MongooseRepository('users', UserSchema)));
  }
}
