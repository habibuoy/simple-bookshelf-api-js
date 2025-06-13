const fail = (message) => {
  return baseResponse('fail', message);
};

const succeed = (message = null, data = null) => {
  return baseResponse('success', message, data);
};

const baseResponse = (status, message = null, data = null) => {
  const resp = { status };

  if (message) {
    resp.message = message;
  }

  if (data) {
    resp.data = data;
  }

  return resp;
};

module.exports = { fail, succeed };