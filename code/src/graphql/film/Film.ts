import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Film {

  @Field((type) => ID)
  public id: number;

  @Field((type) => String)
  public title: string;

  public starshipIds: number[];
}
