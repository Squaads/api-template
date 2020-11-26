import BaseModel from '../../base/base.model';
import BaseRepository from '../../base/base.repository';
import { User } from '../../types/user';

export default class UserModel extends BaseModel<User, User> {
  constructor(repostiory: BaseRepository) {
    super(repostiory);
  }
}
