import { registerAs } from '@nestjs/config';
import configuration from 'src/config';

const config = configuration();

export default registerAs('database', () => ({
  connectionString: config.db.url,
}));
