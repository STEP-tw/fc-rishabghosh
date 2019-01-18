/* global document, window */
/* eslint no-unused-vars: 0 */

const showInput = function () {
  const comments = document.getElementById("comments");
  const nameBox = document.getElementById("name_box");
  const commentBox = document.getElementById("comment_box");
  const submitButton = document.getElementById("submit_button");
  comments.innerHTML = nameBox.value + "\n" + commentBox.value;
}