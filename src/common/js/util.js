export function urlParse () {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
    arr.forEach((arr) => {
      let temp = arr.substring(1).split('=');
      let key = decodeURIComponent(temp[0]);
      let value = decodeURIComponent(temp[1]);
      obj[key] = value;
    })
    return obj;
  }
}
