// function callBack(a,b, next){
//     let c = a+b;
//     next(c, callC); 
// }

// function callB(c, nextcall){
//     console.log('callBackB',c);
//     nextcall(c + 10);
// }

// function callC(x){
//     console.log("callBackC-",x)
//     return
// }

// callBack(5,10, callB)


// function promiseTest(a, b) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             const c = a+b
//             resolve(c);
//         }, 10000);
//     })
// }

// promiseTest(5,10)
// .then(data => {
    
//     console.log('promise',data);console.log('came')})
//     .catch(err => {
//     console.log(err)
// })