import { Field, ID, ObjectType } from 'type-graphql';
import { Post } from '../posts/Post';

@ObjectType()
export class User {

  @Field((type) => ID)
  public id: number;

  @Field((type) => String)
  public firstName: string;

  @Field((type) => String)
  public lastName: string;

  @Field((type) => String)
  public twitter?: string;

  @Field((type) => String)
  public email?: string;

  @Field((type) => [Post])
  public posts?: Post[];
}
