try {
  $.ql_config = JSON.parse($.read('#ql'));
} catch (e) {
  $.ql_config = {};
}

$.ql_url = $.ql_config.ip;

$.application = {
  client_id: $.ql_config.client_id,
  client_secret: $.ql_config.client_secret,
};

$.ql_account = {
  username: $.ql_config.username,
  password: $.ql_config.password,
};

$.log(`地址：${$.ql_url}`);

$.ql = {
  headers: {
    'Content-Type': `application/json;charset=UTF-8`,
    Authorization: '',
  },
  disabled(ids) {
    if (!this.headers.Authorization) return;
    const opt = {
      url: `http://${$.ql_url}/api/envs/disable`,
      headers: this.headers,
      body: JSON.stringify(ids),
    };
    return $.http.put(opt).then((response) => JSON.parse(response.body));
  },
  enabled(ids) {
    if (!this.headers.Authorization) return;
    const opt = {
      url: `http://${$.ql_url}/api/envs/enable`,
      headers: this.headers,
      body: JSON.stringify(ids),
    };
    return $.http.put(opt).then((response) => JSON.parse(response.body));
  },
  delete(ids) {
    if (!this.headers.Authorization) return;
    const opt = {
      url: `http://${$.ql_url}/api/envs`,
      headers: this.headers,
      body: JSON.stringify(ids),
    };
    return $.http.delete(opt).then((response) => JSON.parse(response.body));
  },
  add(records) {
    if (!this.headers.Authorization) return;
    const opt = {
      url: `http://${$.ql_url}/api/envs`,
      headers: this.headers,
      body: JSON.stringify(records),
    };
    return $.http.post(opt).then((response) => JSON.parse(response.body));
  },
  edit(records) {
    if (!this.headers.Authorization) return;
    const opt = {
      url: `http://${$.ql_url}/api/envs`,
      headers: this.headers,
      body: JSON.stringify(records),
    };
    return $.http.put(opt).then((response) => JSON.parse(response.body));
  },
  select(searchValue = 'JD_COOKIE') {
    if (!this.headers.Authorization) return;
    const opt = {
      url: `http://${$.ql_url}/api/envs?searchValue=${searchValue}`,
      headers: this.headers,
    };
    return $.http.get(opt).then((response) => JSON.parse(response.body));
  },
};

if ($.application.client_id && $.application.client_secret) {
  $.ql.login = async () => {
    const options = {
      url: `http://${$.ql_url}/open/auth/token?client_id=${$.application.client_id}&client_secret=${$.application.client_secret}`,
      headers: {
        'Content-Type': `application/json;charset=UTF-8`,
      },
    };
    let response = await $.http.post(options);
    response = JSON.parse(response.body);
    console.log(response);
  };
} else if ($.ql_account.username && $.ql_account.password) {
  $.ql.login = async () => {
    const options = {
      url: `http://${$.ql_url}/api/login`,
      body: JSON.stringify($.ql_account),
      headers: {
        'Content-Type': `application/json;charset=UTF-8`,
      },
    };
    let response = await $.http.post(options);
    response = JSON.parse(response.body);
    if (response.code === 200) {
      $.ql.headers.Authorization = `Bearer ${response.data.token}`;
      $.log(`登陆成功：${response.data.lastaddr}`);
      $.log(`ip:${response.data.lastip}`);
    } else {
      $.log(response);
      $.log(`登陆失败：${response.message}`);
      throw new Error(`登陆失败：${response.message}`);
    }
  };
} else {
  $.ql = false;
  $.log('请配置好相关信息');
  throw new Error('请配置好相关信息');
}
