import { GraphQLResolveInfo } from 'graphql';
import { Context } from 'graphql-yoga/dist/types';
import { getLogger, Logger } from 'log4js';
import { Arg, Args, Ctx, FieldResolver, Info, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { Like } from '../likes/Like';
import { LikeSearchParams } from '../likes/LikeSearchParams';
import { LikeService } from '../likes/LikeService';
import { User } from '../user/User';
import { UserService } from '../user/UserService';
import { CreatePost } from './CreatePost';
import { Post } from './Post';
import { PostSearchParams } from './PostSearchParams';
import { PostService } from './PostService';

@Service()
@Resolver((of) => Post)
export class PostResolver {

  private logger: Logger = getLogger();

  constructor(private postService: PostService,
      private likeService: LikeService,
      private userService: UserService) {
    this.logger.debug('#### Created PostResolver ####');
  }

  @Query((returns) => [Post])
  public async posts(@Args() params: PostSearchParams): Promise<Post[]> {
    this.logger.info(`Call => params: ${ JSON.stringify(params) }`);
    return this.postService.getPosts(params);
  }

  @Query((returns) => Post)
  public async post(@Arg('id') id: number, @Info() info: GraphQLResolveInfo, @Ctx() context: Context): Promise<Post> {
    this.logger.info(`Call => id: ${ id }`);
    return this.postService.getPost(id);
  }

  @FieldResolver(returns => [Like])
  public async likes(@Root() post: Post): Promise<Like[]> {
    this.logger.info(`Call => post: ${ JSON.stringify(post) }`);
    return this.likeService.getLikes({ postId: post.id });
  }

  @FieldResolver(returns => User)
  public async author(@Root() post: Post): Promise<User> {
    this.logger.info(`Call => post: ${ JSON.stringify(post) }`);
    return this.userService.getUser(post.authorId);
  }

  @Mutation(returns => Post)
  public async createPost(@Args() post: CreatePost): Promise<Post> {
    this.logger.info(`Call => post: ${ JSON.stringify(post) }`);
    return this.postService.addPost(post);
  }
}
