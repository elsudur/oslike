

export function setStorage(name, payload){
  localStorage.setItem(name, JSON.stringify(payload))
}

export function getStorage(name){
  const result = localStorage.getItem(name)
    ? JSON.parse(localStorage.getItem(name))
    : null
}