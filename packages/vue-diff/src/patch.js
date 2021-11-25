import {
  vnode
} from './vnode';

function emptyNodeAt(elm) {
  return vnode(elm.tagName.toLocaleLowerCase(), {}, undefined, elm, undefined);
}


function sameNode(oldNode, newNode) {
  return oldNode.sel === newNode.sel && oldNode.key === newNode.key;
}

function createElm(vnode) {
  const realDom = document.createElement(vnode.sel);
  if (vnode.text) {
    realDom.innerText = vnode.text;
  } else if (vnode.children && vnode.children.length > 0) {
    const children = vnode.children;
    children.forEach(child => {
      realDom.appendChild(createElm(child));
    })
  }
  vnode.elm = realDom;
  return realDom;
}

function isDef(v) {
  return v !== undefined && v !== null;
}

function isUnDef(v) {
  return v === undefined || v === null;
}

export function patch(oldVNode, vNode) {
  const isRealElement = isDef(oldVNode.nodeType);
  if (isRealElement) {
    oldVNode = emptyNodeAt(oldVNode);
  }

  // 如果两个是同一个节点，调用patchNode
  if (sameNode(oldVNode, vNode)) {
    patchVNode(oldVNode, vNode);
  } else {
    // 销毁旧节点，将vNode变成真实dom插入旧节点所在的位置
    const realDom = createElm(vNode);
    const el = oldVNode.elm;
    debugger
    el.parentNode.insertBefore(realDom, el);
    el.parentNode.removeChild(el);
  }

}


function patchVNode(oldVNode, vNode) {
  // 判断两者是否为同一个对象
  if (oldVNode === vNode) {
    return;
  }

  const elm = vNode.elm = oldVNode.elm;
  const oldCh = oldVNode.children;
  const ch = vNode.children;

  // 判断vNode是否是文本节点

  // vNode不是文本节点
  if (isUnDef(vNode.text)) {

    // 两者都有子节点
    if (isDef(oldCh) && isDef(ch)) {
      updateChildren(elm, oldCh, ch);
    } else if (isDef(ch)) {
      // 只有vNode有子节点
      const frag = document.createDocumentFragment();
      ch.forEach(child => {
        frag.appendChild(createElm(child));
      })
      elm.appendChild(frag);
    }
    
  }
}


function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let newEndIdx = newCh.length - 1;

  let oldStartVNode = oldCh[oldStartIdx];
  let oldEndVNode = oldCh[oldEndIdx];
  let newStartVNode = newCh[newStartIdx];
  let newEndVNode = newCh[newEndIdx];

  let keyMap = null;

  while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 旧节点的第一个子节点不存在
    if (isUnDef(oldStartVNode)) {
      // oldStart右移
      oldStartVNode = oldCh[++oldStartIdx];
    } else if (isUnDef(oldEndVNode)) {
      // 旧节点的最后一个子节点不存在，左移
      oldEndVNode = oldCh[--oldEndIdx];
    } else if (sameNode(oldStartVNode, newStartVNode)) {
      // 新前与旧前
      patchVNode(oldStartVNode, newStartVNode);
      oldStartVNode = oldCh[++oldStartIdx];
      newStartVNode = newCh[++newStartIdx];
    } else if (sameNode(newEndVNode, oldEndVNode)) {
      // 新后与旧后
      patchVNode(oldEndVNode, newEndVNode);
      oldEndVNode = oldCh[--oldEndIdx];
      newEndVNode = oldCh[--newEndIdx];
    } else if (sameNode(newEndVNode, oldStartVNode)) {
      // 新后与旧前
      patchVNode(oldStartVNode, newEndVNode);
      parentElm.insertBefore(oldStartVNode.elm, oldEndVNode.elm.nextSibling);
      oldEndVNode = oldCh[++oldStartIdx];
      newEndVNode = oldCh[--newEndIdx];
    } else if (sameNode(newStartVNode, oldEndVNode)) {
      // 新前与旧后
      patchVNode(oldEndVNode, newStartVNode);
      parentElm.insertBefore(oldEndVNode.elm, oldStartVNode.elm);
      oldEndVNode = oldCh[--oldEndIdx];
      newStartVNode = newCh[++newStartIdx];
    } else {
      // 都没命中
      if (!keyMap) {
        keyMap = {};
        for(let i = oldStartIdx; i <= oldEndIdx; i++) {
          const key = oldCh[i].key;
          if (key !== undefined) {
            keyMap[key] = i;
          }
        }
      }

      const idxInOld = keyMap[newStartVNode.key];
      if (idxInOld === undefined) {
        // 新节点
        parentElm.insertBefore(createElm(newStartVNode), oldStartVNode.elm);
      } else {
        const elmToMove = oldCh[idxInOld];
        patchVNode(elmToMove, newStartVNode);
        oldCh[idxInOld] = undefined;
        parentElm.insertBefore(elmToMove.elm, oldStartVNode.elm);
      }

      newStartVNode = newCh[++newStartIdx];
    }
  }
}