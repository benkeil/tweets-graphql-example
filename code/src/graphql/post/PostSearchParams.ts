import { Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class PostSearchParams {

  @Field((type) => Int, { nullable: true })
  @Min(1)
  public id?: number;

  @Field((type) => Int, { nullable: true })
  public authorId?: number;
}
