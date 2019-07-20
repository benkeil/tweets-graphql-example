import { Builder } from 'builder-pattern';
import { getLogger, Logger } from 'log4js';
import { Service } from 'typedi';
import { filter } from '../utils/filter';
import { User } from './User';
import { UserSearchParams } from './UserSearchParams';

@Service()
export class UserService {

  private logger: Logger = getLogger();

  private users: User[] = [];

  constructor() {
    this.users.push(Builder(User)
        .id(1)
        .email('ben@google.de')
        .firstName('Ben')
        .lastName('Foo')
        .twitter('benben')
        .build());
    this.users.push(Builder(User)
        .id(2)
        .email('niko@google.de')
        .firstName('Niko')
        .lastName('Bar')
        .twitter('niknik')
        .build());
    this.users.push(Builder(User)
        .id(3)
        .email('sarah@google.de')
        .firstName('Sarah')
        .lastName('Baz')
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
