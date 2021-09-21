--CREATE TABLE permissions
--(
--  id UUID NOT NULL
--    CONSTRAINT role_pkey
--      PRIMARY KEY,
--  permission_name VARCHAR NOT NULL
--);
--
--CREATE TABLE roles
--(
--  id UUID NOT NULL
--    CONSTRAINT role_pkey
--      PRIMARY KEY,
--  role_name VARCHAR NOT NULL,
--  permissions UUID[] NOT NULL
--);
--
--CREATE TABLE users
--(
--  id UUID NOT NULL
--    CONSTRAINT user_pkey
--      PRIMARY KEY,
--  username VARCHAR NOT NULL,
--  password VARCHAR NOT NULL,
--  role UUID NOT NULL
--);
--
CREATE TABLE genres
(
  id UUID NOT NULL
    CONSTRAINT genre_pkey
      PRIMARY KEY,
  genre_name VARCHAR NOT NULL
);

CREATE TABLE authors
(
  id UUID NOT NULL
    CONSTRAINT author_pkey
      PRIMARY KEY,
  author_name VARCHAR NOT NULL,
  genre UUID NOT NULL, -- Заменить потом на массив из UUID
  FOREIGN KEY (genre) REFERENCES genres (id) ON DELETE CASCADE
);

CREATE TABLE books
(
  id UUID NOT NULL
    CONSTRAINT book_pkey
      PRIMARY KEY,
  title VARCHAR NOT NULL,
  author UUID NOT NULL,
  year SMALLINT NOT NULL,
  genre UUID NOT NULL, -- VARCHAR NOT NULL
  FOREIGN KEY (author) REFERENCES authors (id) ON DELETE CASCADE,
  FOREIGN KEY (genre) REFERENCES genres (id) ON DELETE CASCADE
);

--CREATE UNIQUE INDEX permission_id_index
--  ON permissions (id);
--
--CREATE UNIQUE INDEX role_id_index
--  ON roles (id);
--
--CREATE UNIQUE INDEX user_id_index
--  ON users (id);
--
--CREATE UNIQUE INDEX genre_id_index
--  ON genre (id);

CREATE UNIQUE INDEX author_id_index
  ON authors (id);

CREATE UNIQUE INDEX books_id_index
  ON books (id);
