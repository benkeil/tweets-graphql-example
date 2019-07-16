import { Builder } from 'builder-pattern';
import { getLogger, Logger } from 'log4js';
import { filter } from '../utils/filter';
import { User } from './User';
import { UserSearchParams } from './UserSearchParams';

export class UserService {

  private users: User[] = [];

  constructor(private logger: Logger = getLogger()) {
    this.users.push(Builder(User)
        .id(1)
        .email('ben@google.de')
        .firstName('Ben')
        .lastName('Keil')
        .twitter('benben')
        .build());
    this.users.push(Builder(User)
        .id(2)
        .email('niko@google.de')
        .firstName('Niko')
        .lastName('Arras')
        .twitter('niknik')
        .build());
    this.users.push(Builder(User)
        .id(3)
        .email('sarah@google.de')
        .firstName('Sarah')
        .lastName('Tzzz')
        .twitter('sarsar')
        .build());
  }

  public getUsers(params: UserSearchParams): User[] {
    this.logger.info(`Call => params: ${ JSON.stringify(params) }`);
    return filter(this.users, params);
  }

  public getUser(id: number): User {
    this.logger.info(`Call => id: ${ id }`);
    return this.users.find(user => user.id === id);
  }

  public addUser(user: User): User {
    return new User();
  }
}
