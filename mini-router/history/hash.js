import { History } from "./base";
  
export class HashHistory extends History {
  constructor(router, base) {
    super(router, base);
    ensureSlash();
  }

  setupListeners() {
    if (this.listeners.length > 0) {
      return;
    }

    const handleRoutingEvent = () => {
      if (!ensureSlash()) {
        return;
      }
      this.transitionTo(getHash(), () => {})
    }

    window.addEventListener('hashchange', handleRoutingEvent);

    this.listeners.push(() => {
      window.removeEventListener('hashchange', handleRoutingEvent)
    })
  }

  getCurrentLocation() {
    return getHash();
  }

  ensureURL(push) {
    const current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  }
}


function getHash() {
  let href = window.location.href;
  const index = href.indexOf('#');

  if (index < 0) return '';

  href = href.slice(index + 1);
  return href;
}

/**
 * 确保hash路由是以 / 开头
 * 感觉如果说不搞嵌套路由的话，这个倒是可以忽略
 * @returns 
 */
function ensureSlash() {
  // 得到#号后面的hash值
  const path = getHash();

  // vueRouter的hash路由长这样 http://xxx/#/foo
  if (path.charAt(0) === '/') {
    return true;
  }
  replaceHash('/' + path);
  return false;
}

function getUrl(path) {
  const href = window.location.href;
  const i = href.indexOf('#');
  const base = i >= 0 ? href.slice(0, i) : href;

  return `${base}#${path}`;
}

function pushHash(path) {
  window.location.hash = path
}
function replaceHash(path) {
  window.location.replace(getUrl(path))
}