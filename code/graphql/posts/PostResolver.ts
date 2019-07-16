import { GraphQLResolveInfo } from 'graphql';
import { Context } from 'graphql-yoga/dist/types';
import { getLogger, Logger } from 'log4js';
import { Arg, Args, Ctx, FieldResolver, Info, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Like } from '../likes/Like';
import { LikeSearchParams } from '../likes/LikeSearchParams';
import { LikeService } from '../likes/LikeService';
import { CreatePost } from './CreatePost';
import { Post } from './Post';
import { PostSearchParams } from './PostSearchParams';
import { PostService } from './PostService';

@Resolver((of) => Post)
export class PostResolver {

  constructor(private postService: PostService = new PostService(),
      private likeService: LikeService = new LikeService(),
      private logger: Logger = getLogger()) {
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

  @Mutation(returns => Post)
  public async createPost(@Args() post: CreatePost): Promise<Post> {
    this.logger.info(`Call => post: ${ JSON.stringify(post) }`);
    return this.postService.addPost(post);
  }
}
