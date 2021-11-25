import mitt from "mitt";
import CustomEmitter from "./Emitter";

const emitter = mitt();
emitter.on('foo', evt => console.log("1 =>" +evt))
emitter.on('foo', evt => console.log("2 =>" +evt))
emitter.on('foo', evt => console.log("3 =>" +evt))


emitter.on('*', (type, e) => console.log(type, e) )
emitter.on('*', (type, e) => console.log(type, e) )

document.querySelector("#emitFoo")?.addEventListener('click', () => {
  console.log("foo");
  
  emitter.emit('foo', { name: "foo" })
})
document.querySelector("#emitWildcard")?.addEventListener('click', () => {
  console.log("*");
  
  emitter.emit('*', { name: 'wildcard' })
})



// 测试自定义的
const customEmitter = new CustomEmitter();

customEmitter.on('foo', (evt: any) => console.log("1 =>" + evt))
customEmitter.on('foo', (evt: any) => console.log("2 =>" + evt))
customEmitter.on('foo', (evt: any) => console.log("3 =>" + evt))


customEmitter.on('*', (type, e) => console.log(type, e) )
customEmitter.on('*', (type, e) => console.log(type, e) )

customEmitter.once('once', (evt: any) => console.log("第一次 =>" + evt));


document.querySelector("#customFoo")?.addEventListener('click', () => {
  console.log("foo");
  
  customEmitter.emit('foo', { name: "foo" })
})
document.querySelector("#customWildcard")?.addEventListener('click', () => {
  console.log("*");
  
  customEmitter.emit('*', { name: 'wildcard' })
})

document.querySelector("#customOnce")?.addEventListener('click', () => {
  console.log("once");
  customEmitter.emit('once', "this is once");
})

