const jwt = require('jsonwebtoken');
const { responseData } = require("../helpers/responseData");
// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log(roles);
      if (!roles.includes(req?.user?.userType)) {
        return res.json(responseData("NOT_AUTHORIZED_TO_ACCESS", {}, req, false));
      }
      next();
    };
  };