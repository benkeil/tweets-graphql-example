import { Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class LikeSearchParams {

  @Field((type) => Int, { nullable: true })
  @Min(1)
  public userId?: number;

  @Field((type) => Int, { nullable: true })
  @Min(1)
  public postId?: number;
}
