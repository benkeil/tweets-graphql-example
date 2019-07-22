import { HTTPCache, RESTDataSource } from 'apollo-datasource-rest';
import { Builder } from 'builder-pattern';
import { getLogger } from 'log4js';
import { Inject, Service } from 'typedi';
import { Context } from '../../server/Context';
import { Post } from '../post/Post';
import { StarWarsUtils } from '../utils/StarWarsUtils';
import { Starship } from './Starship';

@Service()
export class StarshipService extends RESTDataSource {

  private logger = getLogger();

  constructor(@Inject('context') private readonly ctxt: Context) {
    super();
    this.baseURL = 'https://swapi.co/api/starships/';
    // if we want to use dependency injection instead of apollo logic
    this.initialize({
      context: ctxt,
      cache: undefined,
    });
  }

  private mapShip = (data: any) => {
    return Builder(Starship)
        .name(data.name)
        .model(data.model)
        .id(StarWarsUtils.getIdFromUrl(data.url))
        .filmIds(StarWarsUtils.getIdsFromUrls(data.films))
        .build();
  };

  public async getShips() {
    this.logger.info(`Call`);
    const { results } = await this.get('');
    return results.map((data: any) => this.mapShip(data));
  }

  public async getShip(id: number) {
    this.logger.info(`Call => params: ${ id }`);
    const data = await this.get(`${ id }/`);
    return this.mapShip(data);
  }
}
