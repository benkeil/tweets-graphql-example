import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Film } from '../film/Film';

@ObjectType()
export class Starship {

  @Field((type) => ID)
  public id: number;

  @Field((type) => String)
  public name: string;

  @Field((type) => String)
  public model: string;

  public filmIds: number[];

  public films?: Film[];
}
