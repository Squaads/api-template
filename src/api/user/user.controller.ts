import BaseController from '../../base/base.controller';
import UserManager from './user.manager';

export default class UserController extends BaseController {
  constructor() {
    super(new UserManager());
  }
}
