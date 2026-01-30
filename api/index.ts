import { handle } from '@hono/node-server/vercel'
import app from '../hono-api/src/index'

export const config = {
  runtime: 'nodejs',
}

export default handle(app)
