import { ArgsType, Field, ID, InputType } from 'type-graphql';

@ArgsType()
export class CreatePost {

  @Field((type) => ID)
  public authorId: number;

  @Field((type) => String)
  public content: string;
}
