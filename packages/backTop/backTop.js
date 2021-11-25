(function (window, document) {
  const backTop = document.getElementById('BackTop');
  const el = document.documentElement;
  const cubic = x => Math.pow(x, 3);
  const easeInOutCubic = x => x < 0.5
    ? cubic(x * 2) / 2
    : 1 - cubic((1 - x) * 2) / 2;

  initStyle();
  backTop.addEventListener('click', handleClick);


  function initStyle() {
    const style = document.createElement('style');
    style.textContent = `
    .back-top {
      position: fixed;
      right: 40px;
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
    document.head.appendChild(style);
  }

  function handleClick(e) {
    scrollToTop();
  }


  function scrollToTop() {
    // 开始时间
    const beginTime = Date.now();
    // 开始位置
    const beginValue = el.scrollTop;
    // 帧动画
    const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16));

    const frameFunc = () => {
      // 点击backTop后，浏览器在下一次重绘时，会调用frameFunc函数，那么在点击后与开始执行动画的这段时间里
      const progress = (Date.now() - beginTime) / 500;

      if (progress < 1) {
        el.scrollTop = beginValue * (1 - easeInOutCubic(progress));
        rAF(frameFunc)
      } else {
        el.scrollTop = 0;
      }
    };
    rAF(frameFunc);
  }
}(window, document))