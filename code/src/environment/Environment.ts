import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Service } from 'typedi';
import yaml from 'yaml';
import { Configuration } from './Configuration';

@Service()
export class Environment {

  private configuration: Configuration;

  constructor() {
    this.load();
  }

  private load(): void {
    const configPath = path.join(path.dirname(__filename), 'dev.yaml');
    const file = fs.readFileSync(configPath, 'utf8');
    this.configuration = yaml.parse(file) as Configuration;
  }

  private get(key: string): any {
    return ;
  }
}
