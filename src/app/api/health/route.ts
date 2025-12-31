import { getDataSource } from '@/libs/DB';

export async function GET() {
  try {
    const ds = await getDataSource();
    return Response.json({
      status: 'ok',
      entities: ds.entityMetadatas.map(e => e.name),
    });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
