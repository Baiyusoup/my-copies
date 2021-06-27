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
      const current = this.current;
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
    return getLocation();
  }
}

function getLocation(base) {
  let path = window.location.pathname;
  const pathLowerCase = path.toLowerCase();
  const baseLowerCase = base.toLowerCase();

  return (path || '/') + window.location.search + window.location.hash;
}