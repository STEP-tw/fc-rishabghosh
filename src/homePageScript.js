/* global document, window */
/* eslint no-unused-vars: 0 */

const hideForOneSec = function () {
  const jar = document.getElementById("jar");
  jar.onclick = function () {
    jar.className = "invisible";
    setInterval(() => { jar.className = "visible"; }, 1000);
  };
};


window.onload = hideForOneSec;