import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Post } from '../post/Post';
import { User } from '../user/User';

@ObjectType()
export class Like {

  public postId: number;

  public userId: number;

  @Field((type) => Int)
  public howMuch: number;
}
