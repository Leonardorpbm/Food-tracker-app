export default class FetchWrapper {
  //O fetchWrapper é uma class que nos permite definir um API apenas uma vez
  //Se utilizassemos o fetch web API teríamos que fazer fetch(API) várias vezes (talvez mais de 20)
  //O fetchWrapper veio simplificar tudo porque só precisamos de declarar a class, que será sempre, ou quase sempre, igual.
  //Definimos os métodos get, put, post, patch, delete e send e passamos a poder utilizar de uma forma mais simples o API.
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  get(endpoint) {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }

  put(endpoint, body) {
    return this._send("put", endpoint, body);
  }

  post(endpoint, body) {
    return this._send("post", endpoint, body);
  }

  patch(endpoint, body) {
    return this._send("patch", endpoint, body);
  }

  delete(endpoint, body) {
    return this._send("delete", endpoint, body);
  }

  _send(method, endpoint, body) {
    return fetch(this.baseURL + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
}
