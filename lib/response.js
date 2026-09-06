'use strict';

function success(res, data = null, message = 'Success', code = 200) {
  return res.status(code).json({ status: true, code, creator: 'YuiAPI', message, data });
}

function failure(res, code = 500, message = 'Error', data = null) {
  return res.status(code).json({ status: false, code, creator: 'YuiAPI', message, data });
}

function asyncRoute(handler) {
  return async (req, res, next) => {
    try { await handler(req, res, next); } catch (error) { next(error); }
  };
}

module.exports = { success, failure, asyncRoute };
