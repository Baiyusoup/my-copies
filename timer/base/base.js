let timerId;
function timer() {
  let speed = 50,
    counter = 1,
    start   = new Date().getTime();

  function instance() {
    let ideal = counter * speed,
        real  = new Date().getTime() - start;
    
    counter++;
    window.timerForm.real.value = real;
    window.timerForm.ideal.value = ideal;
    let diff = real - ideal;
    window.timerForm.diff.value = diff;
    timerId = window.setTimeout(function() { instance(); }, speed - diff);
  }

  window.setTimeout(function() { instance(); }, speed);
}
timer();

document.getElementById('stop').addEventListener('click', function() {
  clearTimeout(timerId);
})