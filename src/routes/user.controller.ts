import * as express from 'express';
import {User} from '../app/user';
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
    this.router.get(this.routerPath, this.getAllPosts);
    this.router.post(this.routerPath, this.createAPost);
  }

  getAllPosts = (request: express.Request, response: express.Response) => {
    console.log(request.headers)
    this.collection<User>(this.dbPath).then(allUsers => {
      console.log(allUsers);
      response.send(allUsers);
    });
  }

  createAPost = (request: express.Request, response: express.Response) => {
    const post: User = request.body;
    response.send(post);
  }
}

