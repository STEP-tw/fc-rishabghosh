const hideForOneSec = function () {
  const jar = document.getElementById("jar");
  jar.className = "invisible";
  setInterval(() => { jar.className = "visible" }, 1000);
};