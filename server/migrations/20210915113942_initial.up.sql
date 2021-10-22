CREATE TABLE roles
(
  id UUID NOT NULL
    CONSTRAINT role_pkey
      PRIMARY KEY,
  name VARCHAR NOT NULL,
  permissions VARCHAR[] NOT NULL,
  deleted_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE users
(
  id UUID NOT NULL
    CONSTRAINT user_pkey
      PRIMARY KEY,
  username VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  role_id UUID NOT NULL,
  deleted_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE genres
(
  id UUID NOT NULL
    CONSTRAINT genre_pkey
      PRIMARY KEY,
  name VARCHAR NOT NULL,
  deleted_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE authors
(
  id UUID NOT NULL
    CONSTRAINT author_pkey
      PRIMARY KEY,
  name VARCHAR NOT NULL,
  deleted_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE authors_genres
(
  author_id UUID NOT NULL,
  genre_id UUID NOT NULL,
  deleted_at TIMESTAMP DEFAULT NULL,
  FOREIGN KEY (author_id) REFERENCES authors (id),
  FOREIGN KEY (genre_id) REFERENCES genres (id),
  CONSTRAINT authors_genres_pkey PRIMARY KEY (author_id, genre_id)
);

CREATE TABLE books
(
  id UUID NOT NULL
    CONSTRAINT book_pkey
      PRIMARY KEY,
  title VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  author_id UUID NOT NULL,
  year SMALLINT NOT NULL,
  genre_id UUID NOT NULL,
  file_id UUID NOT NULL,
  deleted_at TIMESTAMP DEFAULT NULL,
  FOREIGN KEY (author_id) REFERENCES authors (id),
  FOREIGN KEY (genre_id) REFERENCES genres (id)
);

CREATE UNIQUE INDEX role_id_index
  ON roles (id);

CREATE UNIQUE INDEX user_id_index
  ON users (id);

CREATE UNIQUE INDEX genre_id_index
  ON genres (id);

CREATE UNIQUE INDEX author_id_index
  ON authors (id);

CREATE UNIQUE INDEX books_id_index
  ON books (id);
