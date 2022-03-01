const { checkRoles } = require('../CheckRoles/checkroles');
import AllRoute from './index'
module.exports = (function() {
   let routes = {get: {}, post: {},put:{},delete :{}};
   let routerService = require('./RouterService');

   // GET:  /dynamic1
   
   // console.log('req',req._Roles)

   //  Khi co function 
   // routes.get.a = {
   //    params: ['aa'],
   //    controller: [checkRoles,AllRoute.TestController.Get]
   // };

   // routes.get.dynamic1 = {
   //    params: ['1'],
   //    controller: function(req, res, next) {
   //        res.send('route dynamic1/1');
   //    }
   // };

   

   // GET:  /dynamic2/:param1
   routes.get.dynamic2 = {
      params: [':param1'],
      controller: function(req, res, next) {
          res.send('route 2');
      }
   };
   routes.post.dynamic2 = {
      params: [':param1'],
      controller: function(req, res, next) {
          res.send('route 2');
      }
   };

   routes.put.dynamic2 = {
      params: [':param1'],
      controller: function(req, res, next) {
          res.send('route 2');
      }
   };

   routes.delete.dynamic2 = {
      params: [':param1'],
      controller: function(req, res, next) {
          res.send('route 2');
      }
   };
   // POST: /dynamic3/:param1/:param1
   routes.post.dynamic3 = {
      params: ['param1', 'param2'],
      controller: function(req, res, next) {
         res.send('route 3');
      }
   };

   /*
   *  Export a router with paths
   *  GET:  /dynamic1
   *  GET:  /dynamic2/:param1
   *  POST: /dynamic3/:param1/:param1
   **/
   return routerService(routes);
})();