// createReactive
function createReactive(obj, isShallow = false,isReadonly = false){
  return new Proxy(obj,{
    set(target,key,newVal,receiver){

      const oldVal = target[key]
      const type = Array.isArray(target) ? Number(key) < target.length ? 'SET' : 'ADD' : Object.prototype.hasOwnProperty.call(target,key) ? 'SET' : 'ADD'

      const res = Reflect.set(target,key,newVal, receiver)

      if(target === receiver.raw){
        if(oldVal !== newVal && (oldVal === oldVal || newVal === newVal)){
          trigger(target,key,type,newVal)
        }
      }

      return res
    },
    ownKeys(target) {
      track(target,Array.isArray(target) ? 'length' : ITERATE_KEY )
      return Reflect.ownKeys(target)
    }
  })
}

function trigger(target,key,type,newVal){
  const depsMap=  bucket.get(target)
  if(!depsMap) return
  // 省略其他

  // 当操作类型为 add 且是目标时数组时，取出length属性相关联的副作用函数
  if(type === 'ADD' && Array.isArray(target)){
    const lengthEffects = depsMap.get('length')
    lengthEffects && lengthEffects.forEach(effectFn => {
      if(effectFn !== activeEffect){
        effectsToRun.add(effectFn)
      }
    })
  }

  // 如果是数组且操作 length
  if(Array.isArray(target) && key === 'length'){
    // 索引大于等于新的length的元素
    // 需要把所有相关联的副作用函数取出添加到队列中等待执行
    depsMap.forEach((effects, key)=>{
      if(key >= newVal){
        effects.forEach(effectFn =>{
          if(effectFn !== activeEffect){
            effectsToRun.add(effectFn)
          }
        })
      }
    })
  }

// 执行队列中的副作用函数，有调度器就传进去让用户控制执行
  effectsToRun.forEach(effectFn =>{
    if(effectFn.options.scheduler){
      effectFn.options.scheduler(effectFn)
    }else {
      effectFn()
    }
  })

}