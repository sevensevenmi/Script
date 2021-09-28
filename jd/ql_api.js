$.ql_url = $.read('ip');

$.application = {
  client_id: $.read('password'),
  client_secret: $.read('client_secret'),
};

$.ql_account = {
  password: $.read('password'),
  username: $.read('username'),
};

$.log(`地址：${$.ql_url}`);

$.ql = {
  headers: {
    'Content-Type': `application/json;charset=UTF-8`,
    Authorization: '',
  },
  disabled(ids) {
    const opt = {
      url: `http://${$.ql_url}/api/envs/disable`,
      headers: this.headers,
      body: JSON.stringify(ids),
    };
    return $.http.put(opt).then((response) => JSON.parse(response.body));
  },
  delete(ids) {
    const opt = {
      url: `http://${$.ql_url}/api/envs`,
      headers: this.headers,
      body: JSON.stringify(ids),
    };
    return $.http.delete(opt).then((response) => JSON.parse(response.body));
  },
  add(records) {
    const opt = {
      url: `http://${$.ql_url}/api/envs`,
      headers: this.headers,
      body: JSON.stringify(records),
    };
    return $.http.post(opt).then((response) => JSON.parse(response.body));
  },
  edit() {
    const opt = {
      url: `http://${$.ql_url}/api/envs`,
      headers: this.headers,
      body: JSON.stringify(records),
    };
    return $.http.put(opt).then((response) => JSON.parse(response.body));
  },
  select(searchValue = 'JD_COOKIE') {
    const opt = {
      url: `http://${$.ql_url}/api/envs?searchValue=${searchValue}`,
      headers: this.headers,
    };
    return $.http.get(opt).then((response) => JSON.parse(response.body));
  },
};

if ($.ql_account.username && $.ql_account.password) {
  $.ql.login = async () => {
    const options = {
      url: `http://${$.ql_url}/api/login`,
      body: JSON.stringify($.ql_account),
    };
    const response = await $.http.post(options);
    console.log(response);
  };
} else if ($.application.client_id && $.client_secret) {
  $.ql.login = async () => {
    const options = {
      url: `http://${$.ql_url}/open/auth/token?client_id=${$.application.client_id}&client_secret=${$.application.client_secret}`,
    };
    const response = await $.http.post(options);
    console.log(response);
  };
} else {
  $.ql = false;
  $.log('请配置好相关信息');
}
