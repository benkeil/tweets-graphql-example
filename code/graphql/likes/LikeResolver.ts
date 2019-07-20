import { GraphQLResolveInfo } from 'graphql';
import { Context } from 'graphql-yoga/dist/types';
import { getLogger, Logger } from 'log4js';
import { Arg, Args, Ctx, FieldResolver, Info, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { Like } from '../likes/Like';
import { LikeSearchParams } from '../likes/LikeSearchParams';
import { LikeService } from '../likes/LikeService';
import { Post } from '../posts/Post';
import { PostService } from '../posts/PostService';
import { User } from '../user/User';
import { UserService } from '../user/UserService';

@Service()
@Resolver((of) => Like)
export class LikeResolver {

  private logger: Logger = getLogger();

  constructor(private postService: PostService,
      private likeService: LikeService,
      private userService: UserService) {
  }

  @Query((returns) => [Like])
  public async likes(@Args() params: LikeSearchParams): Promise<Like[]> {
    this.logger.info(`Call => params: ${ JSON.stringify(params) }`);
    return this.likeService.getLikes(params);
  }

  @FieldResolver(returns => User)
  public async user(@Root() like: Like): Promise<User> {
    this.logger.info(`Call => post: ${ JSON.stringify(like) }`);
    return this.userService.getUser(like.userId);
  }

  @FieldResolver(returns => Post)
  public async post(@Root() like: Like): Promise<Post> {
    this.logger.info(`Call => post: ${ JSON.stringify(like) }`);
    return this.postService.getPost(like.postId);
  }
}
