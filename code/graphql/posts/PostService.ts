import { Builder } from 'builder-pattern';
import { getLogger, Logger } from 'log4js';
import { filter } from '../utils/filter';
import { CreatePost } from './CreatePost';
import { Post } from './Post';
import { PostSearchParams } from './PostSearchParams';

export class PostService {

  private posts: Post[] = [];

  constructor(private logger: Logger = getLogger()) {
    this.posts.push(Builder(Post)
        .id(1)
        .content('bla bla bla 1')
        .author(1)
        .build());
    this.posts.push(Builder(Post)
        .id(2)
        .content('bla bla bla 2')
        .author(1)
        .build());
    this.posts.push(Builder(Post)
        .id(3)
        .content('bla bla bla 3')
        .author(2)
        .build());
    this.posts.push(Builder(Post)
        .id(4)
        .content('bla bla bla 4')
        .author(2)
        .build());
  }

  public getPosts(params: PostSearchParams): Post[] {
    this.logger.info(`Call => params: ${ JSON.stringify(params) }`);
    return filter(this.posts, params);
  }

  public getPost(id: number): Post {
    this.logger.info(`Call => params: ${ id }`);
    return this.posts.find(post => post.id === id);
  }

  public addPost(createPost: CreatePost): Post {
    const post = Builder(Post)
        .id(this.posts.length)
        .author(createPost.author)
        .content(createPost.content)
        .build();
    this.posts.push(post);
    return post;
  }
}
