import { GraphQLResolveInfo } from 'graphql';
import { Context } from 'graphql-yoga/dist/types';
import { getLogger, Logger } from 'log4js';
import { Arg, Args, Ctx, FieldResolver, Info, Query, Resolver, Root } from 'type-graphql';
import { Post } from '../posts/Post';
import { PostSearchParams } from '../posts/PostSearchParams';
import { PostService } from '../posts/PostService';
import { User } from './User';
import { UserSearchParams } from './UserSearchParams';
import { UserService } from './UserService';

@Resolver((of) => User)
export class UserResolver {

  constructor(private userService: UserService = new UserService(),
      private postService: PostService = new PostService(),
      private logger: Logger = getLogger()) {
  }

  @Query((returns) => [User])
  public async users(@Args({ validate: true }) params: UserSearchParams): Promise<User[]> {
    this.logger.info(`Call => params: ${ JSON.stringify(params) }`);
    return this.userService.getUsers(params);
  }

  @Query((returns) => User)
  public async user(@Arg('id') id: number, @Info() info: GraphQLResolveInfo, @Ctx() context: Context): Promise<User> {
    this.logger.info(`Call => id: ${ id }`);
    return this.userService.getUser(id);
  }

  @FieldResolver((returns) => [Post])
  public async posts(@Root() user: User): Promise<Post[]> {
    this.logger.info(`Call => user: ${ JSON.stringify(user) }`);
    return this.postService.getPosts({ author: user.id });
  }
}
