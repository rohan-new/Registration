let router = (packages,db) => {
    let userRouter = packages.express.Router();
    let getRegister = require('../controllers/userController')(packages,db).getRegister;  
    let postRegister = require('../controllers/userController')(packages,db).postRegister;
    let verifyCaptcha = require('../controllers/userController')(packages,db).verifyCaptcha;  

    let middleware  = require('../middleware/middleware')(packages,db).validateIp ;

    userRouter.use(middleware);

    userRouter.route('/register')
    .get(getRegister);

    userRouter.route('/post/register')
    .post(postRegister);

    userRouter.route('/verify/captcha')
    .post(verifyCaptcha);

    return userRouter;
}

module.exports = router;