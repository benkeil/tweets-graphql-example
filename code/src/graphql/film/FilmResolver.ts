import { getLogger, Logger } from 'log4js';
import { Args, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { Post } from '../post/Post';
import { PostSearchParams } from '../post/PostSearchParams';
import { Starship } from '../starship/Starship';
import { StarshipService } from '../starship/StarshipService';
import { Film } from './Film';
import { FilmSearchParams } from './FilmSearchParams';
import { FilmService } from './FilmService';

@Service()
@Resolver(of => Film)
export class FilmResolver {

  private logger: Logger = getLogger();

  constructor(private filmService: FilmService,
      private starshipService: StarshipService) {
    this.logger.debug(`#### Created ${ this.constructor.name } ####`);
  }

  @Query((returns) => [Film])
  public async films(@Args() params: FilmSearchParams, @Ctx() context: any): Promise<Film[]> {
    this.logger.info(`Call => params: ${ JSON.stringify(params) }`);
    return this.filmService.getFilms();
  }

  @FieldResolver(returns => [Starship])
  public async starships(@Root() film: Film): Promise<Starship[]> {
    this.logger.info(`Call => film: ${ JSON.stringify(film) }`);
    return film.starshipIds.map(id => this.starshipService.getShip(id)) as unknown as Promise<Starship[]>;
  }
}
