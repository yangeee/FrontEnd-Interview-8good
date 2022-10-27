function computed(getter: Function){
  const effectFn = effect(getter,{
    lazy: true
  })
  const obj = {
    get value(){
      return effectFn()
    }
  }
  return obj
}