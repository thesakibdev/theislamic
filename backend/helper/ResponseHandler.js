class ResponseHandler {
  static success(res, message, payload = {}, status = 200) {
    return res.status(status).json({
      success: true,
      message,
      ...payload,
    });
  }

  static error(res, message, status = 500) {
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

module.exports = ResponseHandler;
