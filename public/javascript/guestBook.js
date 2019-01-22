/* global document, window, fetch, DOMParser */
/* eslint no-unused-vars: 0 */

const refreshComments = function () {
  fetch("/guest_book.html").then(function (request) {

    const htmlAsText = request.text();
    return htmlAsText;

  }).then(function (response) {

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(response, "text/html");
    const commentDiv = htmlDoc.getElementById("comments");
    return commentDiv;

  }).then(function (commentDiv) {
    document.getElementById("comments").innerHTML = commentDiv.innerHTML +
      `<div>
         Last reloaded on :  ${getDate()}
       </div>`;
  });
};

const getDate = () => new Date().toLocaleString();

const setEventListner = function () {
  setInterval(() => {
    document.getElementById("refresh").onclick = refreshComments;
  }, 10);
};


window.onload = setEventListner;