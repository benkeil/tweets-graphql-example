import { ArgsType, Field, ID, ObjectType } from 'type-graphql';
import { Like } from '../likes/Like';

@ObjectType()
export class Post {

  @Field((type) => ID)
  public id: number;

  @Field((type) => ID)
  public author: number;

  @Field((type) => String)
  public content: string;

  @Field((type) => [Like])
  public likes: Like[];
}
