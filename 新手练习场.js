child.prototype = Object.create(parent.prototype)

function instanceFake(l,r){
  let right = r.prototype
  let left = l.__proto__
  while(true){
    if(left === null) return false
    if(right === left) return true
    left = left.__proto__
  }
}

function bind(obj,...args){
  let self = this
  function newFn(...rest){
      return fn.call(this instanceof newFn ? this : obj,...args,...rest)
  }
  if(self.prototype){
    newFn.prototype = Object.create(self.prototype)
  }
  return newFn
}

function call(obj,...args){
  if(!this instanceof Function){
    return false
  }
  obj = Object(obj) || window
  let fn = Symbol('fn')
  obj[fn] = this
  const res = obj[fn](...args)
  delete obj[fn]
  return res
}


function apply(obj,args){
  if(!this instanceof Function){
    return false
  }
  obj = Object(obj) || window
  let fn = Symbol('fn')
  obj[fn] = this
  const res = obj[fn](...args)
  delete obj[fn]
  return res
}

function curry(fn){
  return function curried(...rest){
    if(fn.length <= rest.length){
      return fn.apply(null,rest)
    }else {
      return function (...args){
        return curried(...rest,...args)
      }
    }
  }
}
 
function news(fn,...rest){
  let newObj = Object.create(fn.prototype)
  let res = fn.apply(newObj,rest)
  return typeof res === 'object' ? res||newObj :newObj
}

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise {
  constructor(fn){
    this.value = null
    this.reason = null
    this.status = PENDING
    this.resFnArr=  []
    this.rejFnArr=  []
    let resolve = (value)=>{
      if(this.status === PENDING){
        this.value = value
        this.status = FULFILLED
        this.resFnArr.forEach(fn=>fn());
      }
    }
    let reject = (reason)=>{
      if(this.status === PENDING){
        this.reason = reason
        this.status = REJECTED
        this.rejFnArr.forEach(fn=>fn());
      }
    }
    try{
      fn(resolve,reject)
    }catch (e){
      reject(e)
    }
  }
  then(onRes,onRej){
    onRes = typeof onRes === 'function' ? onRes : v=>v
    onRej = typeof onRej === 'function' ? onRej : (err)=>{throw err}
    let nextPromise = new Promise((resolve,reject)=>{
      let resFn = ()=>{
        setTimeout(()=>{
        try{
          let res = onRes(this.value)
          resolvePromise(nextPromise,res,resolve,reject)
        }catch(e){
          reject(e)
        }
      })
      }

      let rejFn = ()=>{setTimeout(()=>{
        try{
          let res = onRej(this.reason)
          resolvePromise(nextPromise,res,resolve,reject)
        }catch(e){
          reject(e)
        }
      })}
      if(this.status === PENDING){
        this.rejFnArr.push(rejFn)
        this.resFnArr.push(resFn)
      }
      if(this.status === REJECTED){
        rejFn()
      }
      if(this.status === FULFILLED){
        resFn()
      }
    })
    return nextPromise
  }
}

function resolvePromise(nextPromise,res,resolve,reject){
  if (nextPromise === res) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if((typeof res === 'object' && res !== null) || typeof  res ==='function'){
    let called = false
    try{
      let then = res.then
      if(typeof then === 'function'){
        then.call(res,(val)=>{
          if(called) return
          called = true
          resolvePromise(nextPromise,val,resolve,reject)
        }, (rea)=>{
          if(called) return
          called = true
          reject(rea)
        })
      }else {
        if(called) return
        called = true
        resolve(res)
      }
    }catch(e){
      if(called) return
      called = true
      reject(e)
    }
  }else {
    resolve(res)
  }
}