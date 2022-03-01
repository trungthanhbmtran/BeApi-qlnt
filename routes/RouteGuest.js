import TestController from '../Controller/TestController';
import AllRoute from './index';

module.exports = (function() {
    let routes = {get: {}, post: {},put:{},delete:{}};
    let routerService = require('./RouterService');
    // const arrayString = Object.entries(AllRoute)
    const dynamicCreateRoute = (method,url,endpoint,process) =>{
        routes[method][url] = {
            params: endpoint,
            controller: process 
         };
    }
     
    // const BreaKRoute = (AllRoute) =>{
    //     Object.keys(AllRoute).reduce(
    //        (res,key,i)=>{ 
    //             //    console.log('key',key)
    //         //   console.log('function',AllRoute[key])
    //         //   console.log('res',res,i)
    //           const url = key.replace('Controller','');
    //           const url1 = key.replace('Controller','').toLowerCase();
    //         //   console.log('url',url)
    //           const value = AllRoute[key]
    //         //    console.log('value',value)
    //         //    console.log('route',routes)
    //            Object.keys(routes).map((v)=>{
    //                console.log('v',v)
    //                const nameFunctionImport = `${v.charAt(0).toUpperCase()}${v.slice(1)}${url}`
    //                const GetListImport = `GetList${url}`
    //                const checkFunction = AllRoute[`${key}`][`${nameFunctionImport}`]
    //                console.log('checkFunction',checkFunction)
    //             //  console.log('GetListImport',GetListImport)
    //             // console.log('nameFunctionImport',nameFunctionImport)
    //             // console.log('getFunction',value[nameFunctionImport])
    //             // console.log('AllRoute',AllRoute['TestController']['PutTest'])
    //               // console.log(AllRoute[`${key}`][`${nameFunctionImport}`])
    //               // dynamicCreateRoute(`${v}`,url1,'',AllRoute[`${key}`][`${nameFunctionImport}`])
    //               // dynamicCreateRoute(`get`,url1,'list',AllRoute[`${key}`][`${GetListImport}`])
    //            })
    //         // console.log('assign',assign)
    //     //    console.log('key',key)
    //     },
    //     {}
    // )   
    // }

    const BreaKRoute = () =>{
      Object.entries(AllRoute).reduce((prev,current)=>{
          // console.log('current key',current[0])
          // console.log('current function',current[1])
      },{})
    }

   BreaKRoute(AllRoute)
    // console.log('AllRoute',AllRoute.TestController.PutTest)
  //  dynamicCreateRoute(`get`,'ba','',AllRoute[TestController][PutTest])

   dynamicCreateRoute(`get`,'dynamic1','/list',AllRoute.TestController.GetTest)
  //  dynamicCreateRoute(`get`,'test1','2',AllRoute.TestController.GetListTest)
  //  dynamicCreateRoute(`get`,'test1',1,AllRoute.TestController.GetListTest)



//    console.log(AllRoute[`TestController`][`uploadFile`])
    // console.log('test',AllRoute['TestController'])
    // console.log('test . ',AllRoute.TestController)
    
    // console.log('route',routes['get'])


    

    // BreaKRoute(AllRoute)
 
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