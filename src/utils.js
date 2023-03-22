export const COUNT = 10;

export function getStarRating(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += "★";
    } else {
      stars += "☆";
    }
  }
  return `${stars}`;
}

export function getURL({ searchTerm, page }) {
  let url = "https://dummyjson.com/products";
  if (searchTerm) {
    url = url + `/search?q=${searchTerm}`;
  }
  url = url + `${searchTerm ? "&" : "?"}limit=${COUNT}`;
  if (page) {
    url = url + `&skip=${page * COUNT}`;
  }
  return url;
}
