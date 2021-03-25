import * as express from 'express';
import {User} from '../model/user';
import {AngularFirestore} from "../providers/angular.firestore";

export default class UserController extends AngularFirestore{
  public routerPath = '/api/users/';
  private dbPath = 'users';
  public router = express.Router();

  constructor() {
    super();
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.routerPath, this.getAllUsers);
    this.router.post(this.routerPath, this.createAUser);
  }

  getAllUsers = (request: express.Request, response: express.Response) => {
    console.log(request.headers)
    this.collection<User>(this.dbPath).then(allUsers => {
      console.log(allUsers);
      response.send(allUsers);
    }).catch(console.error);
  }

  createAUser = (request: express.Request, response: express.Response) => {
    const user: User = request.body;
    response.send(user);
  }
}

