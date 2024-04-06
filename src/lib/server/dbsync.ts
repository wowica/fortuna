import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

import { NODE_ENV, DATABASE_URL } from '$env/static/private';

let dbsync: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __dbsync: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (NODE_ENV === 'production') {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);

  dbsync = new PrismaClient({ adapter });
} else {
  if (!global.__dbsync) {
    const pool = new pg.Pool({ connectionString: DATABASE_URL });
    const adapter = new PrismaPg(pool);

    global.__dbsync = new PrismaClient({ adapter, log: ['query'] });
  }

  dbsync = global.__dbsync;
}

export { dbsync };
