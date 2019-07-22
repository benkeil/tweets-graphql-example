import { GraphQLResolveInfo } from 'graphql';
import { getLogger, Logger } from 'log4js';
import { Arg, Args, Ctx, FieldResolver, Info, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { Post } from '../post/Post';
import { PostSearchParams } from '../post/PostSearchParams';
import { PostService } from '../post/PostService';
import { User } from './User';
import { UserSearchParams } from './UserSearchParams';
import { UserService } from './UserService';

@Service()
@Resolver((of) => User)
export class UserResolver {

  private logger: Logger = getLogger();

  constructor(private userService: UserService,
      private postService: PostService) {
    this.logger.debug(`#### Created ${ this.constructor.name } ####`);
  }

  @Query((returns) => [User])
  public async users(@Args({ validate: true }) params: UserSearchParams): Promise<User[]> {
    this.logger.info(`Call => params: ${ JSON.stringify(params) }`);
    return this.userService.getUsers(params);
  }

  @Query((returns) => User)
  public async user(@Arg('id') id: number, @Info() info: GraphQLResolveInfo, @Ctx() context: any): Promise<User> {
    this.logger.info(`Call => id: ${ id }`);
    return this.userService.getUser(id);
  }

  @FieldResolver((returns) => [Post])
  public async posts(@Root() user: User): Promise<Post[]> {
    this.logger.info(`Call => user: ${ JSON.stringify(user) }`);
    return this.postService.getPosts({ authorId: user.id });
  }
}
