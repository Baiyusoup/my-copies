import { h } from './h';

import { patch } from './patch';


const app = document.querySelector('#app');

let vnode = h('div', { key: 'div'}, [
  h('div', { key: 'span'}, '文本'),
  h('div', { key: 'span'}, '文本'),
])

patch(app, vnode);

let clickedCount = 0;
let newV = null;
document.getElementById('btn').addEventListener('click', function() {
  if (clickedCount === 0) {
    newV = h('ul', { key: 'ul' }, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
      h('li', { key: 'C' }, 'C'),
      h('li', { key: 'D' }, 'D'),
      h('li', { key: 'M' }, 'M')
    ])
    patch(vnode, newV);
  } else if (clickedCount === 1) {
    newV = h('ul', { key: 'ul' }, [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
      // h('li', { key: 'C' }, 'C'),
      h('li', { key: 'D' }, 'D'),
      h('li', { key: 'M' }, 'M')
    ])
    debugger
    patch(vnode, newV);
  }
  clickedCount++;
  vnode = newV;
})