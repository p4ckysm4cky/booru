const { DB } = require("./migrate");

DB.exec(`
    CREATE TABLE posts_all
    (
        id            INTEGER PRIMARY KEY,
        thumbnail_url TEXT      NOT NULL,
        image_md5     TEXT      NOT NULL,
        created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at    TIMESTAMP
    );
`);

// Tag string must not contain spaces.
DB.exec(`
    CREATE TABLE tags_all
    (
        id         INTEGER PRIMARY KEY,
        string     TEXT      NOT NULL CHECK (instr(string, ' ') = 0),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
    );
`);

// Views.
DB.exec(`
    CREATE VIEW posts AS 
    SELECT * FROM posts_all WHERE deleted_at IS NULL;
`);

DB.exec(`
    CREATE VIEW tags AS 
    SELECT * FROM tags_all WHERE deleted_at IS NULL;
`);

// Ensure two active posts never have the same hash.
DB.exec(`
    CREATE UNIQUE INDEX idx_posts_all_image_md5
        ON posts_all (image_md5) WHERE deleted_at IS NULL;
`);

// Ensure two active tags never have the same string.
DB.exec(`
    CREATE UNIQUE INDEX idx_tags_string
        ON tags_all (string) WHERE deleted_at IS NULL;
`);

DB.exec(`
    CREATE TABLE post_tags_all
    (
        post_id INTEGER NOT NULL REFERENCES posts_all (id),
        tag_id  INTEGER NOT NULL REFERENCES tags_all (id)
    );
`);

DB.exec(`
    CREATE VIEW post_tags AS
    SELECT post_id, tag_id FROM post_tags_all
    JOIN posts on posts.id = post_id;
`);

DB.exec(`
    CREATE UNIQUE INDEX idx_post_tags_all_post_id_tag_id
        ON post_tags_all (post_id, tag_id);
`);
