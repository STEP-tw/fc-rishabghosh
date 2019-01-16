/* eslint no-unused-vars: 0 */

const hideForOneSec = function (document) {
  const jar = document.getElementById("jar");
  jar.className = "invisible";
  setInterval(() => { jar.className = "visible"; }, 1000);
};
