let express = require("express");
let router = express.Router();

module.exports = function (myCustomRoutes) {
  // console.log('myCustomRoutes',myCustomRoutes)
  //  let methods = Object.keys(myCustomRoutes); // getting methods ('get', 'post'... etc)
  //  console.log('methods',methods)
  //  let routesMethod = null;
  let url = null;

  //  for(let i in methods) {
  //     routesMethod = Object.keys(myCustomRoutes[methods[i]]);
  //     console.log('routesMethod',routesMethod)
  //     for(let j in routesMethod) {
  //        url = '/' + routesMethod[j];
  //        url += '/' + myCustomRoutes[methods[i]][routesMethod[j]].params.join('/');
  //        console.log('url',url);
  //        router[methods[i]](url, myCustomRoutes[methods[i]][routesMethod[j]].controller);
  //     }
  //  }

  //export url .../brenches/

  Object.keys(myCustomRoutes).reduce((res, key) => {
    // console.log('res',res)
    // console.log('key',key)
    //   const test = myCustomRoutes[key]
    //   console.log('test',test)
    //   Object.keys(myCustomRoutes[key]).reduce((p,c)=>{
    //     url =`/${c}/`
    //     console.log('url',url)
    //     console.log('myCustomRoutes[key]',Object.values(myCustomRoutes[key].test))
    //    //  router[key](url,myCustomRoutes[key])
    //  })
    Object.entries(myCustomRoutes[key]).reduce((p, c) => {
      url = `/${c[0]}/${c[1].params}`;
      console.log("url+ method", key, url);
      router[key](url, c[1].controller);
      //  console.log('c',c[0])
    }, []);
  }, []);
  //  console.log('router',router)

  return router;
};
