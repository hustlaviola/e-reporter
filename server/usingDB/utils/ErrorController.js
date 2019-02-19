class ErrorController {
  static validationError(res, code, message) {
    return res.status(code).send({
      status: res.statusCode,
      error: message,
    });
  }

  static routeError(res) {
    return res.status(404).send({
      status: res.statusCode,
      error: 'The requested url was not found on this server',
    });
  }

  static databaseError(res) {
    return res.status(500).send({
      status: res.statusCode,
      error: 'Database Error',
    });
  }
}

export default ErrorController;
