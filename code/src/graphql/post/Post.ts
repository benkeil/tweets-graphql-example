import { ArgsType, Field, ID, ObjectType } from 'type-graphql';
import { Like } from '../like/Like';

@ObjectType()
export class Post {

  @Field((type) => ID)
  public id: number;

  public authorId: number;

  @Field((type) => String)
  public content: string;

  public likes: Like[];
}
