const { createBookHandler, getBooksHandler, getBookByIdHandler,
  updateBookByIdHandler, deleteBookByIdHandler
} = require('./handlers');

const routes = [
  {
    path: '/books',
    method: 'POST',
    handler: createBookHandler
  },
  {
    path: '/books',
    method: 'GET',
    handler: getBooksHandler
  },
  {
    path: '/books/{id}',
    method: 'GET',
    handler: getBookByIdHandler
  },
  {
    path: '/books/{id}',
    method: 'PUT',
    handler: updateBookByIdHandler
  },
  {
    path: '/books/{id}',
    method: 'DELETE',
    handler: deleteBookByIdHandler
  },
];

module.exports = routes;