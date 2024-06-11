import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { Hono } from 'hono'
import { products } from './db/schema';
import { gt } from 'drizzle-orm';

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}


const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const sql = neon(c.env.NEON_DB);
  const db = drizzle(sql);
  const result = await db.select().from(products).where(gt(products.price, 10));
  return c.json({ result });
});

app.onError((error, c) => {
  console.log(error)
  return c.json({ error }, 400)
})

export default app