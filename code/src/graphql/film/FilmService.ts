import { RESTDataSource } from 'apollo-datasource-rest';
import { Builder } from 'builder-pattern';
import { getLogger } from 'log4js';
import { Inject, Service } from 'typedi';
import { Context } from '../../server/Context';
import { StarWarsUtils } from '../utils/StarWarsUtils';
import { Film } from './Film';

@Service()
export class FilmService extends RESTDataSource {

  private logger = getLogger();

  constructor(@Inject('context') private readonly ctxt: Context) {
    super();
    this.baseURL = 'https://swapi.co/api/films/';
    // if we want to use dependency injection instead of apollo logic
    this.initialize({
      context: ctxt,
      cache: undefined,
    });
  }

  private mapFilm = (data: any) => {
    return Builder(Film)
        .title(data.title)
        .id(StarWarsUtils.getIdFromUrl(data.url))
        .starshipIds(StarWarsUtils.getIdsFromUrls(data.starships))
        .build();
  };

  public async getFilms(): Promise<Film[]> {
    this.logger.info(`Call`);
    const { results } = await this.get('');
    return results.map((data: any) => this.mapFilm(data));
  }

  public async getFilm(id: number): Promise<Film> {
    this.logger.info(`Call => id: ${ id }`);
    const data = await this.get(`${ id }/`);
    return this.mapFilm(data);
  }
}
