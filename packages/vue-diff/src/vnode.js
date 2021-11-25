export function vnode(sel, data, children, elm, text) {
  const { key } = data;
  return {
    sel,
    data,
    children,
    elm,
    text,
    key
  }
}