import { Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class FilmSearchParams {

  @Field((type) => Int, { nullable: true })
  public id?: number;
}
