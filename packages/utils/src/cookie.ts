export function getCookie(name: string): string {
  const result = new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`).exec(document.cookie);
  if (result) {
    return decodeURIComponent(result[1]);
  }
  return '';
}

// 返回所有cookie的name组成的对象{name:value}
interface IMapObj {
    [key: string]: any;
}

export function getAllCookie(): object {
  const arr = document.cookie.split('; ');
  const res: IMapObj = {};
  arr.forEach((item) => {
    const group = item.split('=');
    let name = group[0];
    let value = group[1];
    try {
      name = decodeURIComponent(name);
      value = value ? decodeURIComponent(value) : value;
      // cookie中有多个同名cookie时，前面不会被覆盖，后面同名cookie被舍弃，跟getCookie返回的结果一致
      if (!res[name]) {
        res[name] = value;
      }
    } catch (e) {
      console.warn(e);
      console.info(`parse ${name}/${value} 出错`);
    }
  });

  return res;
}

// 不设置exhours过期时间时，系统默认不设置过期时间，关闭浏览器之后，cookie就失效(但是有的浏览器在设置无过期时间的cookie时因为浏览器甚至问题，导致cookie长期存在：https://stackoverflow.com/questions/10617954/chrome-doesnt-delete-session-cookies);当设置的过期时间是过去的一个时间时，就是删除该cookie
// 不设置path时，path为空，此时系统设置的path是当前页面所在的path
// 不设置domain时，系统默认设置的是domain是当前页面的域名而不一定是根域名，例如x.y.daojia.com
// 例如：在页面https://jzt.daojia.com/home/indexPage?channel=wxwallet&hmsr=wxwallet设置cookie不传path和domain时，设置的path是/home,设置的域名是jzt.daoja.com
export function setCookie(name: string, value: string, exhours: number, path: string, domain: string) {
  let d;
  let expires;
  if (!exhours) {
    expires = '';
  } else {
    d = new Date();
    d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
    expires = `; expires=${d.toUTCString()}`;
  }

  const cookiePath = path ? `; path=${path}` : '';
  const cookieDomain = domain ? `; domain=${domain}` : '';
  document.cookie = `${name}=${value
  }${expires
  }${cookiePath
  }${cookieDomain}`;
}

// 删除cookie,name,path,domain必传
export function delCookie(name: string, path: string, domain: string) {
  setCookie(name, '', -1, path, domain);
}

export default {
  getCookie,
  setCookie,
  delCookie,
  getAllCookie
};
