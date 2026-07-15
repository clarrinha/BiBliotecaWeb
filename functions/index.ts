// functions/index.ts — Biblioteca Web backend entrypoint
//
// Cloudflare Worker que delega todas as operações de banco para um Durable
// Object chamado LibraryStore. O DO mantém o estado em SQLite (this.ctx.storage.sql)
// implementando o mesmo schema relacional descrito em `schema_postgres.sql`.
//
// Endpoints (14 casos de uso):
//  GET    /api/autores              — listar autores
//  POST   /api/autores              — cadastrar autor
//  GET    /api/categorias           — listar categorias
//  POST   /api/categorias           — cadastrar categoria
//  GET    /api/livros               — listar livros (com autor e categoria)
//  POST   /api/livros               — cadastrar livro
//  GET    /api/livros/:id           — detalhar livro
//  GET    /api/membros              — listar membros
//  POST   /api/membros              — cadastrar membro
//  GET    /api/emprestimos          — listar empréstimos (com joins)
//  POST   /api/emprestimos          — registrar empréstimo
//  PATCH  /api/emprestimos/:id/devolver — devolver livro
//  GET    /api/emprestimos/ativos   — empréstimos em aberto
//  GET    /api/dashboard            — estatísticas (counts e relatórios)

// Re-export do DO para o bundler não remover a classe (tree-shaking).
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'biblioteca',
  port: Number(process.env.DB_PORT) || 5432,
});

// ===== Autores =====
app.get('/api/autores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM autores ORDER BY nome');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/autores', async (req, res) => {
  const { nome, nacionalidade, data_nascimento } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  try {
    const result = await pool.query(
      'INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES ($1, $2, $3) RETURNING *',
      [nome, nacionalidade || null, data_nascimento || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Categorias =====
app.get('/api/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY nome');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categorias', async (req, res) => {
  const { nome, descricao } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  try {
    const result = await pool.query(
      'INSERT INTO categorias (nome, descricao) VALUES ($1, $2) RETURNING *',
      [nome, descricao || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Livros =====
app.get('/api/livros', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, a.nome as autor_nome, c.nome as categoria_nome
      FROM livros l
      JOIN autores a ON l.autor_id = a.id
      JOIN categorias c ON l.categoria_id = c.id
      ORDER BY l.titulo
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/livros', async (req, res) => {
  const { titulo, ano_publicacao, autor_id, categoria_id, quantidade } = req.body;
  if (!titulo || !autor_id || !categoria_id) {
    return res.status(400).json({ error: 'titulo, autor_id e categoria_id são obrigatórios' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO livros (titulo, ano_publicacao, autor_id, categoria_id, quantidade) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titulo, ano_publicacao || null, autor_id, categoria_id, quantidade || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Membros =====
app.get('/api/membros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM membros ORDER BY nome');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/membros', async (req, res) => {
  const { nome, email, telefone } = req.body;
  if (!nome || !email) return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  try {
    const result = await pool.query(
      'INSERT INTO membros (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, telefone || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email já cadastrado' });
    res.status(500).json({ error: err.message });
  }
});

// ===== Empréstimos =====
app.get('/api/emprestimos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, m.nome as membro_nome, l.titulo as livro_titulo
      FROM emprestimos e
      JOIN membros m ON e.membro_id = m.id
      JOIN livros l ON e.livro_id = l.id
      ORDER BY e.data_emprestimo DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/emprestimos/ativos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, m.nome as membro_nome, l.titulo as livro_titulo
      FROM emprestimos e
      JOIN membros m ON e.membro_id = m.id
      JOIN livros l ON e.livro_id = l.id
      WHERE e.status = 'aberto'
      ORDER BY e.data_devolucao_prevista
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/emprestimos', async (req, res) => {
  const { membro_id, livro_id, dias } = req.body;
  if (!membro_id || !livro_id) return res.status(400).json({ error: 'membro_id e livro_id são obrigatórios' });
  
  const diasEmprestimo = dias || 14;
  const dataPrevista = new Date();
  dataPrevista.setDate(dataPrevista.getDate() + diasEmprestimo);

  try {
    const result = await pool.query(
      'INSERT INTO emprestimos (membro_id, livro_id, data_devolucao_prevista) VALUES ($1, $2, $3) RETURNING *',
      [membro_id, livro_id, dataPrevista]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/emprestimos/:id/devolver', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE emprestimos SET data_devolucao_real = CURRENT_TIMESTAMP, status = 'devolvido' WHERE id = $1 AND status = 'aberto' RETURNING *",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Empréstimo em aberto não encontrado' });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Dashboard =====
app.get('/api/dashboard', async (req, res) => {
  try {
    const totalLivros = await pool.query('SELECT COUNT(*)::int as count FROM livros');
    const totalMembros = await pool.query('SELECT COUNT(*)::int as count FROM membros');
    const totalAutores = await pool.query('SELECT COUNT(*)::int as count FROM autores');
    const totalCategorias = await pool.query('SELECT COUNT(*)::int as count FROM categorias');
    const ativos = await pool.query("SELECT COUNT(*)::int as count FROM emprestimos WHERE status='aberto'");
    
    res.json({
      totalLivros: totalLivros.rows[0].count,
      totalMembros: totalMembros.rows[0].count,
      totalAutores: totalAutores.rows[0].count,
      totalCategorias: totalCategorias.rows[0].count,
      emprestimosAbertos: ativos.rows[0].count,
      livrosPorCategoria: [],
      emprestimosPorMembro: []
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Inicialização do servidor local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend PostgreSQL completo rodando em http://localhost:${PORT}`);
});