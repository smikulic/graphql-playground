DROP DATABASE IF EXISTS graphql_demo;
CREATE DATABASE graphql_demo;

\c graphql_demo;

CREATE TABLE posts (
  id         INTEGER PRIMARY KEY,
  title      TEXT
);

CREATE TABLE comments (
  id         SERIAL PRIMARY KEY,
  post_id    INTEGER,
  user_id    INTEGER,
  text       TEXT
);

CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  email   TEXT
);

INSERT INTO users (id, email)
  VALUES (1, 'enrico@test.com'),
         (2, 'joan@test.com');

INSERT INTO posts (id, title)
  VALUES (1, 'I wanna learn graphql'),
         (2, 'I wish I had more time');

INSERT INTO comments (post_id, user_id, text)
  VALUES (1, 2, 'I can teach you GraphQl!'),
         (1, 2, 'random meaningless comment'),
         (2, 1, 'you are awesome!'),
         (2, 2, 'spammy spam spam');