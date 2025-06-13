const books = require('./books');
const NanoId = require('nanoid');
const result = require('./responseResult');

function isNameValid(name) {
  if (!name || name.length === 0) {
    return false;
  }

  return true;
}

function isPageValid(pageCount, readPage) {
  return readPage <= pageCount;
}

const createBookHandler = (request, h) => {
  const { name, year, author, summary, publisher,
    pageCount, readPage, reading
  } = request.payload;

  if (!isNameValid(name)) {
    return h
      .response(result.fail('Gagal menambahkan buku. Mohon isi nama buku'))
      .code(400);
  }

  if (!isPageValid(pageCount, readPage)) {
    return h
      .response(result.fail('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'))
      .code(400);
  }

  const id = NanoId.nanoid(16);
  const dtNow = (new Date()).toISOString();
  const insertedAt = dtNow;
  const updatedAt = dtNow;

  const book = {
    id, name, year, author, summary,
    publisher, pageCount, readPage, reading,
    finished: pageCount === readPage,
    insertedAt, updatedAt
  };

  books.push(book);
  const succeed = books.filter((b) => b.id === id).length > 0;
  if (!succeed) {
    return h
      .response(result.fail('Gagal menambahkan buku. Ada error di sisi kami'))
      .code(500);
  }

  return h
    .response(result.succeed('Buku berhasil ditambahkan', { bookId: id }))
    .code(201);
};

const getBooksHandler = (request, h) => {

  const { name, reading, finished } = request.query;

  const filtereds = books.filter((b) => {
    let containName = true;
    let hasReading = true;
    let hasFinished = true;

    if (name !== undefined) {
      containName = b.name.toLowerCase().includes(name.toLowerCase());
    }

    if (reading !== undefined) {
      hasReading = b.reading === Boolean(+reading);
    }

    if (finished !== undefined) {
      hasFinished = b.finished === Boolean(+finished);
    }

    return containName && hasReading && hasFinished;
  });

  const simplifieds = filtereds.map((b) => { return { id: b.id, name: b.name, publisher: b.publisher }; });
  return h
    .response(result.succeed(null, { books: simplifieds }))
    .code(200);
};

const getBookByIdHandler = (request, h) => {

  const { id } = request.params;

  const book = books.find((b) => b.id === id);
  if (!book) {
    return h
      .response(result.fail('Buku tidak ditemukan'))
      .code(404);
  }

  return h
    .response(result.succeed(null, { book }))
    .code(200);
};

const updateBookByIdHandler = (request, h) => {

  const { id } = request.params;

  const { name, year, author, summary, publisher,
    pageCount, readPage, reading
  } = request.payload;

  if (!isNameValid(name)) {
    return h
      .response(result.fail('Gagal memperbarui buku. Mohon isi nama buku'))
      .code(400);
  }

  if (!isPageValid(pageCount, readPage)) {
    return h
      .response(result.fail('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'))
      .code(400);
  }

  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex === -1) {
    return h
      .response(result.fail('Gagal memperbarui buku. Id tidak ditemukan'))
      .code(404);
  }

  books[bookIndex] = { ...books[bookIndex], name, year, author, summary, publisher, pageCount, readPage, reading };

  return h
    .response(result.succeed('Buku berhasil diperbarui'))
    .code(200);
};

const deleteBookByIdHandler = (request, h) => {

  const { id } = request.params;

  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex === -1) {
    return h
      .response(result.fail('Buku gagal dihapus. Id tidak ditemukan'))
      .code(404);
  }

  const deleteds = books.splice(bookIndex, 1);

  if (deleteds.length === 0) {
    return h
      .response(result.fail('Buku gagal dihapus. Ada error di sisi kami'))
      .code(500);
  }

  return h
    .response(result.succeed('Buku berhasil dihapus'))
    .code(200);
};

module.exports = {
  createBookHandler, getBooksHandler, getBookByIdHandler,
  updateBookByIdHandler, deleteBookByIdHandler
};