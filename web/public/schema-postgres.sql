-- ============================================================
--  SCHEMA POSTGRESQL — Sistema de Gerenciamento de Biblioteca
-- ============================================================
--
--  Projeto acadêmico: 6 tabelas, 3+ com relacionamentos entre si.
--
--  Tabelas:
--    1. autores         (referenciada por livros)
--    2. categorias      (referenciada por livros)
--    3. livros          (referencia autores + categorias; referenciada por emprestimos e reservas)
--    4. membros         (referenciada por emprestimos e reservas)
--    5. emprestimos     (referencia membros + livros)
--    6. reservas        (referencia membros + livros)
--
--  Relacionamentos (FK):
--    livros.autor_id        -> autores.id        (N:1)
--    livros.categoria_id    -> categorias.id     (N:1)
--    emprestimos.membro_id  -> membros.id        (N:1)
--    emprestimos.livro_id   -> livros.id         (N:1)
--    reservas.membro_id     -> membros.id        (N:1)
--    reservas.livro_id      -> livros.id         (N:1)
--
-- ============================================================

-- 1) Autores ---------------------------------------------------
CREATE TABLE IF NOT EXISTS autores (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL,
    nacionalidade   VARCHAR(80),
    data_nascimento DATE
);

-- 2) Categorias ------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(80) NOT NULL UNIQUE,
    descricao   TEXT
);

-- 3) Livros ----------------------------------------------------
-- Relaciona-se com autores (N:1) e categorias (N:1).
CREATE TABLE IF NOT EXISTS livros (
    id              SERIAL PRIMARY KEY,
    titulo          VARCHAR(200) NOT NULL,
    ano_publicacao  INTEGER,
    autor_id        INTEGER NOT NULL REFERENCES autores(id) ON DELETE RESTRICT,
    categoria_id    INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    quantidade      INTEGER NOT NULL DEFAULT 1 CHECK (quantidade >= 0)
);

-- 4) Membros ---------------------------------------------------
CREATE TABLE IF NOT EXISTS membros (
    id            SERIAL PRIMARY KEY,
    nome          VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    telefone      VARCHAR(20),
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5) Empréstimos -----------------------------------------------
-- Relaciona-se com membros (N:1) e livros (N:1).
CREATE TABLE IF NOT EXISTS emprestimos (
    id                       SERIAL PRIMARY KEY,
    membro_id                INTEGER NOT NULL REFERENCES membros(id) ON DELETE RESTRICT,
    livro_id                 INTEGER NOT NULL REFERENCES livros(id) ON DELETE RESTRICT,
    data_emprestimo          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_devolucao_prevista  TIMESTAMP NOT NULL,
    data_devolucao_real      TIMESTAMP,
    status                   VARCHAR(20) NOT NULL DEFAULT 'aberto'
                             CHECK (status IN ('aberto','devolvido','atrasado'))
);

-- 6) Reservas --------------------------------------------------
-- Relaciona-se com membros (N:1) e livros (N:1).
CREATE TABLE IF NOT EXISTS reservas (
    id           SERIAL PRIMARY KEY,
    membro_id    INTEGER NOT NULL REFERENCES membros(id) ON DELETE CASCADE,
    livro_id     INTEGER NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
    data_reserva TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status       VARCHAR(20) NOT NULL DEFAULT 'pendente'
                 CHECK (status IN ('pendente','atendida','cancelada'))
);

-- ============================================================
--  ÍNDICES para performance de consultas frequentes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_livros_autor       ON livros(autor_id);
CREATE INDEX IF NOT EXISTS idx_livros_categoria   ON livros(categoria_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_membro ON emprestimos(membro_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_livro  ON emprestimos(livro_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_status ON emprestimos(status);
CREATE INDEX IF NOT EXISTS idx_reservas_membro    ON reservas(membro_id);
CREATE INDEX IF NOT EXISTS idx_reservas_livro     ON reservas(livro_id);

-- ============================================================
--  DADOS INICIAIS (seed)
-- ============================================================
INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES
  ('Machado de Assis',    'Brasil',      '1839-06-21'),
  ('Clarice Lispector',   'Brasil',      '1920-12-10'),
  ('Jorge Amado',         'Brasil',      '1912-08-10'),
  ('George Orwell',       'Reino Unido', '1903-06-25'),
  ('J.R.R. Tolkien',      'Reino Unido', '1892-01-03')
ON CONFLICT DO NOTHING;

INSERT INTO categorias (nome, descricao) VALUES
  ('Romance',             'Obras de ficção romântica e drama'),
  ('Ficção Científica',   'Narrativas futuristas e especulativas'),
  ('Fantasia',            'Mundos mágicos e elementais'),
  ('Distopia',            'Sociedades opressivas e autoritárias'),
  ('Literatura Nacional', 'Clássicos da literatura brasileira')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO livros (titulo, ano_publicacao, autor_id, categoria_id, quantidade) VALUES
  ('Dom Casmurro',                      1899, 1, 5, 3),
  ('Memórias Póstumas de Brás Cubas',   1881, 1, 5, 2),
  ('A Hora da Estrela',                 1977, 2, 5, 1),
  ('Capitães da Areia',                 1937, 3, 5, 4),
  ('1984',                              1949, 4, 4, 5),
  ('A Revolução dos Bichos',            1945, 4, 4, 3),
  ('O Senhor dos Anéis',                1954, 5, 3, 2),
  ('O Hobbit',                          1937, 5, 3, 4)
ON CONFLICT DO NOTHING;

INSERT INTO membros (nome, email, telefone) VALUES
  ('Ana Silva',    'ana.silva@email.com',    '(11) 9999-1111'),
  ('Bruno Costa',  'bruno.costa@email.com',  '(11) 9999-2222'),
  ('Carla Dias',   'carla.dias@email.com',   '(11) 9999-3333'),
  ('Diego Souza',  'diego.souza@email.com',  '(11) 9999-4444')
ON CONFLICT (email) DO NOTHING;

INSERT INTO emprestimos (membro_id, livro_id, data_emprestimo, data_devolucao_prevista) VALUES
  (1, 5, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '9 days'),
  (2, 7, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '9 days')
ON CONFLICT DO NOTHING;

INSERT INTO reservas (membro_id, livro_id) VALUES
  (3, 7)
ON CONFLICT DO NOTHING;

-- ============================================================
--  CONSULTAS DE EXEMPLO (provam os relacionamentos)
-- ============================================================
-- Livros com autor e categoria (JOIN N:1):
--   SELECT l.titulo, a.nome AS autor, c.nome AS categoria
--   FROM livros l
--   JOIN autores a    ON l.autor_id = a.id
--   JOIN categorias c ON l.categoria_id = c.id;
--
-- Empréstimos com membro e livro (JOIN N:1 duplo):
--   SELECT e.id, m.nome AS membro, l.titulo AS livro, e.status
--   FROM emprestimos e
--   JOIN membros m ON e.membro_id = m.id
--   JOIN livros  l ON e.livro_id  = l.id;
--
-- Quantidade de livros por categoria (agregação com JOIN):
--   SELECT c.nome AS categoria, COUNT(l.id) AS total
--   FROM categorias c LEFT JOIN livros l ON l.categoria_id = c.id
--   GROUP BY c.id ORDER BY total DESC;
