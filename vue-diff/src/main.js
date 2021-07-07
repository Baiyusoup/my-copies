import {
  init,
  h
} from 'snabbdom';

const patch = init([]);

// const vNode = {
//   sel: "",
//   key: "",
//   text: "",
//   elm: "",
//   children: []
// }

const app = document.querySelector('#app');

const vnode = h('div#app', {}, [
  h('span', '文本'),
  h('span', '文本'),
])
console.log(vnode);
patch(app, vnode);