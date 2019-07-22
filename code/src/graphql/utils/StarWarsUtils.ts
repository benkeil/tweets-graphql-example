import { URL } from 'apollo-server-env';

export class StarWarsUtils {

  public static getIdsFromUrls(url: string[]): number[] {
    return url.map(entry => this.getIdFromUrl(entry));
  }

  public static getIdFromUrl(url: string): number {
    const parts = new URL(url).pathname.split('/');
    parts.pop();
    return +parts.pop();
  }
}
