import { getLogger, Logger } from 'log4js';
import { Args, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { Film } from '../film/Film';
import { FilmService } from '../film/FilmService';
import { Post } from '../post/Post';
import { PostSearchParams } from '../post/PostSearchParams';
import { Starship } from './Starship';
import { StarshipService } from './StarshipService';

@Service()
@Resolver(of => Starship)
export class StarshipResolver {

  private logger: Logger = getLogger();

  constructor(private starshipService: StarshipService,
      private filmService: FilmService) {
    this.logger.debug(`#### Created ${ this.constructor.name } ####`);
  }

  @Query((returns) => [Starship])
  public async starships(@Ctx() context: any): Promise<Starship[]> {
    this.logger.info(`Call`);
    return this.starshipService.getShips();
  }

  @FieldResolver(returns => [Film])
  public async films(@Root() starship: Starship): Promise<Film[]> {
    this.logger.info(`Call => starship: ${ JSON.stringify(starship) }`);
    return starship.filmIds.map(id => this.filmService.getFilm(id)) as unknown as Promise<Film[]>;
  }
}
