import { Builder } from 'builder-pattern';
import { getLogger, Logger } from 'log4js';
import { Service } from 'typedi';
import { filter } from '../utils/filter';
import { Like } from './Like';
import { LikeSearchParams } from './LikeSearchParams';

@Service()
export class LikeService {

  private logger: Logger = getLogger();

  private likes: Like[] = [];

  constructor() {
    this.likes.push(Builder(Like)
        .userId(1)
        .postId(1)
        .howMuch(20)
        .build());
    this.likes.push(Builder(Like)
        .userId(3)
        .postId(1)
        .howMuch(50)
        .build());
    this.likes.push(Builder(Like)
        .userId(3)
        .postId(3)
        .howMuch(15)
        .build());
  }

  public getLikes(params: LikeSearchParams): Like[] {
    this.logger.info(`Call => params: ${ JSON.stringify(params) }`);
    return filter(this.likes, params);
  }

  public addLike(like: Like): Like {
    return new Like();
  }
}
