/* global document, window, fetch, DOMParser */
/* eslint no-unused-vars: 0 */

const getDate = () => new Date().toLocaleString();
const fetchText = (request) => request.text();
const getCommentsDivOf = (doc) => doc.getElementById("comments");
const getRefreshButton = (doc) => doc.getElementById("refresh");

const convertTextToHtml = function (source) {
  const parser = new DOMParser();
  return parser.parseFromString(source, "text/html");
};

const createDateDiv = function () {
  const date = getDate();
  const div = "<div>" +
    "Last refreshed on: " + date +
    "</div>";
  return div;
};

const replaceComments = function (fetchedHtml) {
  const currentComments = getCommentsDivOf(fetchedHtml);
  const oldComments = getCommentsDivOf(document);
  const dateDiv = createDateDiv();
  oldComments.innerHTML = currentComments.innerHTML + dateDiv;
};


const refreshComments = function () {
  fetch("/guest_book.html")
    .then(fetchText)
    .then(convertTextToHtml)
    .then(replaceComments);
};

const setEventListner = function () {
  setInterval(() => getRefreshButton(document).onclick = refreshComments, 10);
};


window.onload = setEventListner;