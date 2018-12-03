let routes = (packages,db) => {

    let registerRouter = require('./register')(packages,db);
    let routerConfig = require('../configuration/routes-config');
	packages.app.use(routerConfig.BASE_USER_URL, registerRouter);
}

module.exports = routes;