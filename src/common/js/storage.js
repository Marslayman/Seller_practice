export function saveToLocal (id, key, value) {
  let store = window.localStorage._Seller_;
  if (!store) {
    store = {};
    store[id] = {};
    store[id][key] = value;
  } else {
    store = JSON.parse(store);
    if (!store[id]) {
      store[id] = {};
    }
  }
  store[id][key] = value;
  localStorage._Seller_ = JSON.stringify(store);
}

export function loadFromLocal (id, key, def) {
  let store = window.localStorage._Seller_;
  if (!store) {
    return def;
  }
  store = JSON.parse(store)[id];
  if (!store) {
    return def;
  }
  let ret = store[key];
  return ret || def;
}
