import { newDatabaseConnection } from "./database";

interface Query {
  positive: string[];
  negative: string[];
}

function parseQuery(query: string): Query {
  const positive = [];
  const negative = [];

  const tokens = query.split(" ");
  for (const rawToken of tokens) {
    const token = rawToken.trim();
    if (!token) continue;

    if (token.startsWith("-")) {
      negative.push(token.slice(1));
    } else {
      positive.push(token);
    }
  }

  return { positive, negative };
}

interface SelectBuilder {
  binds: { [index: number]: any };
  nextIndex: number;
}

function createBuilder(): SelectBuilder {
  return { binds: {}, nextIndex: 1 };
}

function addBind(builder: SelectBuilder, bind: any): string {
  const index = builder.nextIndex;
  ++builder.nextIndex;
  builder.binds[index] = bind;
  return `?${index}`;
}

function selectPostsByTag(builder: SelectBuilder, tag: string): string {
  return `
      SELECT post_id
      FROM post_tags
               JOIN tags on tag_id = id
      WHERE string = ${addBind(builder, tag)}
  `;
}

function filterPosts(builder: SelectBuilder, query: Query): string {
  let statement = `
      SELECT id as post_id
      FROM posts
  `;

  // Filter positive tags.
  for (const tag of query.positive) {
    statement += `
      INTERSECT 
      ${selectPostsByTag(builder, tag)}
    `;
  }

  // Filter negative tags.
  for (const tag of query.negative) {
    statement += `
      EXCEPT 
      ${selectPostsByTag(builder, tag)}
    `;
  }

  return statement;
}

type Results = { posts: { id: number; thumbnailURL: string }[] };
type RawResults = Results & { totalRows: number };
export type QueryResults = Results & { pages: number };

// TODO: add parameter limit to avoid denial of service
function retrieveResults(
  query: Query,
  offset: number,
  limit: number,
): RawResults {
  const builder = createBuilder();
  const db = newDatabaseConnection();

  // TODO: index with created_at
  const table = `
      CREATE TEMP TABLE results AS
      SELECT id, thumbnail_url
      FROM (${filterPosts(builder, query)})
               JOIN posts ON post_id = posts.id
      ORDER BY created_at DESC
  `;

  // Temporary tables are unique to each connection.
  db.prepare(table).run(builder.binds);

  const results = db
    .prepare(
      `SELECT *
           FROM results
           LIMIT ? OFFSET ?`,
    )
    .all(limit, offset);

  const totalRows = db
    .prepare(
      `SELECT COUNT(*) as count
           FROM results`,
    )
    .get().count;

  return {
    totalRows,
    posts: results.map((row) => ({
      id: row.id,
      thumbnailURL: row.thumbnail_url,
    })),
  };
}

// Page is 1-indexed.
export function retrievePosts(
  query: string,
  page: number,
  limit: number,
): QueryResults {
  const offset = (page - 1) * limit;
  const results = retrieveResults(parseQuery(query), offset, limit);
  const pages = Math.ceil(results.totalRows / limit);
  return { posts: results.posts, pages };
}
