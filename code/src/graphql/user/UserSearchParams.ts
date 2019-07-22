import { Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class UserSearchParams {

  @Field((type) => Int, { nullable: true })
  @Min(1)
  public id?: number;

  @Field((type) => String, { nullable: true })
  public twitter?: string;
}
