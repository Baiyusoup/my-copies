import { START } from "../utils/route";
import { History } from "./base";

export class HTML5History extends History {
  constructor(router, base) {
    super(router, base)
    this._startLocation = getLocation(base);
  }

  setupListeners() {
    if (this.listeners.length > 0) {
      return
    }

    const handleRoutingEvent = () => {
      const location = getLocation(this.base);
      if (this.current === START && location === this._startLocation) {
        return;
      }

      this.transitionTo(location, () => {})
    }

    window.addEventListener('popstate', handleRoutingEvent)

    this.listeners.push(() => {
      window.removeEventListener('popstate', handleRoutingEvent);
    })
  }

  getCurrentLocation() {
    return getLocation(this.base);
  }

  ensureURL(push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      const current = cleanPath(this.base + this.current.fullPath)
      push ? pushState(current) : replaceState(current);
    }
  }
}

function getLocation(base) {
  let path = window.location.pathname;
  const pathLowerCase = path.toLowerCase();
  const baseLowerCase = base.toLowerCase();

  if (base && ((pathLowerCase === baseLowerCase) ||
    (pathLowerCase.indexOf(cleanPath(baseLowerCase + '/')) === 0))) {
    path = path.slice(base.length);
  }

  return (path || '/') + window.location.search + window.location.hash;
}


function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}


function pushState(url, replace) {
  const history = window.history;
  if (replace) {
    history.replaceState({}, '', url);
  } else {
    history.pushState({ key: ''}, '', url);
  }
}
function replaceState(url) {
  pushState(url, true)
}