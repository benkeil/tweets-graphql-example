import { Field, ID, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Like {

  @Field((type) => ID)
  public postId: number;

  @Field((type) => ID)
  public userId: number;

  @Field((type) => Int)
  public howMuch: number;
}
