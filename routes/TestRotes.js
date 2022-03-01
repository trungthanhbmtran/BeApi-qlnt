// import router, { route } from '../Controller/Staff';
// import TestController from '../Controller/TestController';
import AllRoute from "./index";
import { checkRoles } from "../CheckRoles/checkroles";

module.exports = (function () {
  let routes = { get: {}, post: {}, put: {}, delete: {} };
  let routerService = require("./RouterService");

  // const BlackList2 = [
  //   {name : 'roles' , method : 'post'},
  //   {name : 'roles' , method : 'delete'},
  //   {name : 'user' , method : 'delete'},
  // ];

  // const printBlackList = (value,method) => {
  //   const BlackList = ['test','getlist']
  //   if(!BlackList.includes(value)) return
  //   return BlackList.includes(value)
  // }

  const printBlackList = (value) => {
    const BlackList = {
      test: ["delete", "post"],
      user: ["delete"],
      staffs: ["post", "get"],
    };
    return BlackList[value] || [];
  };

  // const PrintBlackList = (value,method) =>{
  //   const fruits = [
  //     { name: 'test', method: 'post' },
  //     { name: 'branches', method: 'post' },
  //     { name: 'user', method: 'delete' },
  // ];
  // return fruits.filter(fruit => fruit.name === value && fruit.method === method);
  // }

  const dynamicCreateRoute = (method, url, process, pra = []) => {
    return (routes[method][url] = {
      params: pra,
      controller: process,
    });
  };

  const RenderURl = (key, value) => {
    return Object.keys(value).reduce((prev, cur) => {
      const method = cur.toLowerCase();
      // console.log('prev',prev)
      // console.log('cur',key,value[cur])
      if (key === `getlist`) {
        return dynamicCreateRoute(`get`, `${method}`, value[cur]);
      } else {
        // console.log('test truong hop khac',key,method)
        const Value = printBlackList(key);
        // console.log('Value',key,Value)
        dynamicCreateRoute(`${method}`, `${key}`, [value[cur]]);
        printBlackList(key).forEach((element) => {
          // console.log('element',key,element,method)
          if (element === method) {
            // console.log('bi phan quyen')
            return dynamicCreateRoute(`${method}`, `${key}`, [
              checkRoles,
              value[cur],
            ]);
          }
          if (element !== method) {
            // console.log('k bi phan quyen')
            return "";
          }
        });
      }
    }, []);
  };

  function GetValueOfKey(obj = {}, keys = []) {
    return Object.keys(obj).reduce(
      (t, v) => (keys.includes(v) && (t[v] = obj[v]), t),
      {}
    );
  }

  Object.entries(AllRoute).reduce((prev, current, index) => {
    const key = current[0].toLowerCase();
    const value = current[1];
    // console.log('current',current)
    const test = RenderURl(key, value);
    // console.log('test',key)
  }, []);

  //  routes.post.dynamic4 = {
  //    params: ['param1', 'param2'],
  //    controller: function(req, res, next) {
  //       res.send('route 4');
  //    }
  // };

  /*
   *  Export a router with paths
   *  GET:  /dynamic1
   *  GET:  /dynamic2/:param1
   *  POST: /dynamic3/:param1/:param1
   **/
  return routerService(routes);
})();
