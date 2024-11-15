const jwt = require('jsonwebtoken');
const { responseData } = require("../helpers/responseData");
const User = require('../models/user.model')
const {triggerMethod}=require('../helpers/socketWork');
exports.verifyToken = async (req, res, next) => {
  let token;
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    token = req.headers["authorization"].split(" ")[1];
  }

  // console.log('token--------',token)

  if (!token) {
    // console.log('1 ')
    return res.json(responseData("NOT_AUTHORIZED", {}, req, false));
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        // console.log(err.message)
        // return res.json(responseData("TOKEN_EXPIRED", {}, 401, req,false));
        return res.status(401).json({ success: false, message: "Token is expired", data: {} })
      }

      user = user.user
      let userCheck = await User.findById(user?._id)
      // .select('status uniqueId')
      if(userCheck?.username =="javademo")
      {
        if (userCheck.status === 'suspend') {
          return res.status(401).json(responseData("USER_IS_SUSPENEDED", {}, req, false));
        }
      }else{
        if (!userCheck?.uniqueId) {
          return res.status(401).json(responseData("NOT_AUTHORIZED", {}, req, false));
        }
        else if (userCheck?.uniqueId != user?.uniqueId) {
          return res.status(401).json(responseData("NOT_AUTHORIZED", {}, req, false));
        }
        else if (userCheck.status === 'suspend') {
          return res.status(401).json(responseData("USER_IS_SUSPENEDED", {}, req, false));
        }else if (userCheck.status === 'locked') {
          return res.status(401).json(responseData("USER_IS_LOCKED", {}, req, false));
        }
      }
      req.user = userCheck;
      next();
    });
  } catch (error) {
    return res.json(responseData("NOT_AUTHORIZED", {}, req, false));
  }
};

exports.verifyAdminToken = async (req, res, next) => {
  let token;
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    token = req.headers["authorization"].split(" ")[1];
  }

  if (!token) {
    return res.status(401).json(responseData("NOT_AUTHORIZED", {}, req, false));
  }
  try {
    jwt.verify(token, process.env.JWT_ADMIN_SECRET, async (err, user) => {
      if (err) {
        // console.log(err.message)
        // return res.json(responseData("TOKEN_EXPIRED", {}, 401, req,false));
        return res.status(401).json({ success: false, message: "Token is expired", data: {} })
      }

      let userCheck = await User.findById(user?._id)
      // .select('status uniqueId')
      if(!userCheck) {
        return res.status(401).json(responseData("USER_IS_LOCKED", {}, req, false));
      }
      else if(userCheck?.uniqueId != user?.uniqueId){
          const resp = triggerMethod.forceLogout({user_id: user._id, uniqueId:user.uniqueId});
          // console.log('LOGIN_FROM_DIFFERENT_DEVICE forceLogout resp',resp);
          return res.status(403).json(responseData("LOGIN_FROM_DIFFERENT_DEVICE", {}, req, false));
      }
      else if(userCheck.status === 'suspend') {
        return res.status(401).json(responseData("USER_IS_SUSPENEDED", {}, req, false));
      }
      else if (userCheck.status === 'locked') {
        return res.status(401).json(responseData("USER_IS_LOCKED", {}, req, false));
      }

      if(userCheck.userType != 'owner'){
          let ObjectIdData =[];
          if(userCheck.ownerId){
              ObjectIdData.push(userCheck.ownerId)
          }
          if(userCheck.subOwnerId){
              ObjectIdData.push(userCheck.subOwnerId)
          }
          if(userCheck.adminId){
              ObjectIdData.push(userCheck.adminId)
          }
          if(userCheck.superAdminId){
              ObjectIdData.push(userCheck.superAdminId)
          }
          if(userCheck.subAdminId){
              ObjectIdData.push(userCheck.subAdminId)
          }
          if(userCheck.superSeniorId){
              ObjectIdData.push(userCheck.superSeniorId)
          }
          if(userCheck.superAgentId){
              ObjectIdData.push(userCheck.superAgentId)
          }
          let userStatus = await User.distinct('status',{
              _id:{$in:ObjectIdData}
          });

          if(userStatus.findIndex((item)=>item ==="locked") >=0)
          {
            return res.status(401).json(responseData("USER_IS_LOCKED", {}, req, false));
          }
          if(userStatus.findIndex((item)=>item ==="suspend") >=0)
          {
            return res.status(401).json(responseData("USER_IS_SUSPENEDED", {}, req, false));
          }

          if(userCheck?.uniqueId != user?.uniqueId){
              const resp = triggerMethod.forceLogout({user_id: user._id, uniqueId:user.uniqueId});
              // console.log('LOGIN_FROM_DIFFERENT_DEVICE forceLogout resp',resp);
              return res.status(403).json(responseData("LOGIN_FROM_DIFFERENT_DEVICE", {}, req, false));
          }
      }

      req.user = userCheck;
      next();
    });
  } catch (error) {
    return res.status(401).json(responseData("NOT_AUTHORIZED", {}, req, false));
  }
};