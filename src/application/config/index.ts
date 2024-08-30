import YAML from 'yamljs';
import path from 'path';

const configPath = path.resolve(__dirname, '../../resources/application.yaml');
const config = YAML.load(configPath);

export default config;