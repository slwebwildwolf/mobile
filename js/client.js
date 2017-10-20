var BASE_URL = "http://192.168.0.101:5000/v1/";
//"https://api.parse.com/1/";
var _headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

module.exports.getRequest = (_url) => {
  var options = {
    method: "GET",
    headers: _headers
  };
  var request = new Request(BASE_URL + _url,options);
  return fetch(request)
    .then((response) => {
      if(response.status == 201 || response.status == 200){
        return response.json();
      }
    });
    /*.then((body) => {
      return body;
    });*/
}
module.exports.postRequest = (_url,_body) => {
  var options = {
    method: "POST",
    headers: _headers,
    body: JSON.stringify(_body)
  };
  var request = new Request(BASE_URL + _url,options);
  return fetch(request)
    .catch((error) => console.warn('fetch error:',error))
    .then((response) => {
      if(response.status == 201 || response.status == 200){
        return response.json();
      }
    })
    .then((body) => {
      return body;
    });
}
module.exports.putRequest = (_url,_body) => {
  var options = {
    method: "PUT",
    headers: _headers,
    body: JSON.stringify(_body)
  };
  var request = new Request(BASE_URL + _url,options);
  return fetch(request)
    .catch((error) => console.warn('fetch error:',error))
    .then((response) => {
      if(response.status == 201 || response.status == 200){
        return response.json();
      }
    })
    .then((body) => {
      return body;
    });
}
module.exports.deleteRequest = (_url,_body) => {
  var options = {
    method: "DELETE",
    headers: _headers,
    body: JSON.stringify(_body)
  };
  var request = new Request(BASE_URL + _url,options);
  return fetch(request)
    .catch((error) => console.warn('fetch error:',error))
    .then((response) => {
      if(response.status == 201 || response.status == 200){
        return response.json();
      }
    })
    .then((body) => {
      return body;
    });
}
