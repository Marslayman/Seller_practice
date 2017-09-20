export const formatTime = (time) => {
  if (time) {
    var oDate = new Date(time);
    var y = oDate.getFullYear();
    var m = oDate.getMonth() + 1;
    var d = oDate.getDate();
    var h = oDate.getHours();
    var mm = oDate.getMinutes();
    return y + '-' + m + '-' + d + '   ' + h + ':' + mm;
  }
}
