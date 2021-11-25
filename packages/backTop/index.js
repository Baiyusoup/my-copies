class BackTop extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open'});
    shadow.innerHTML = `
      <div class="back-top">
        <slot></slot>
      </div>
    `;
    this.addStyle(shadow);
  }

  addStyle(shadow) {
    const style = document.createElement('style');
    style.textContent = `
    .back-top {
      position: fixed;
      left: 40px;
      bottom: 40px;
      background-color: #eee;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: #409EFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 0 6px rgba(0, 0, 0, .12);
      cursor: pointer;
      z-index: 5;
    }
    .back-top:hover {
      background-color: #F2F6FC;
    }`;
    shadow.appendChild(style);
  }
}


(function() {
  customElements.define('back-top', BackTop)
}())