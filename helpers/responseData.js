const __ = require("multi-lang")();

module.exports = {
  responseData: (message="",result = {}, req, success) => {
    const language = 'en'; //req.headers["accept-language"] ? req.headers["accept-language"] : "en";
    var response = {};
    response.success = success;
    response.message = __(message, language) || "SUCCESS";
    response.results = result;
    return response;
  },
  setMessage: (message, language) => {
    return __(message, language);
  }
};