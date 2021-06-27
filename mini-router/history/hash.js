import { History } from "./base";
  
export class HashHistory extends History {
  constructor(router, base) {
    super(router, base);
  }

  setupListeners() {
    if (this.listeners.length > 0) {
      return;
    }

    const handleRoutingEvent = () => {
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
}


function getHash() {
  let href = window.location.href;
  const index = href.indexOf('#');

  if (index < 0) return '';

  href = href.slice(index + 1);
  return href;
}