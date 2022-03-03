/*
 * @Author: Lee
 * @Date: 2021-09-27 15:43:13
 * @LastEditors: Lee
 * @LastEditTime: 2022-03-03 10:09:25
 */

/**
 * 登录授权
 * 如果需要考虑安全问题，自行替换自己的登录接口
 */
function login() {
  fetch('http://backapi.ddou.cn/api/login/in', {
    method: 'POST',
    body: JSON.stringify({
      userName: '',
      password: '!@#sajdn123',
    }),
    headers: { 'Content-Type': 'application/json' },
  }).then(function (response) {
    response
      .clone()
      .json()
      .then(function (r) {
        if (r && r.code === 0) {
          localStorage.setItem('UPLOAD_TOKEN', r.data.token);
        }
      });
  });
}

/**
 * 剪贴板
 * @param {*} value
 * @returns
 */
function clipboard(value) {
  return new Promise(function (resolve, reject) {
    var input = document.createElement('input');
    input.setAttribute('value', value);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    if (result) {
      resolve(null);
    } else {
      reject();
    }
  });
}

/**
 * 随机字符
 * @param {*} len
 * @returns
 */
function randomCharacters(len) {
  var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var r = '';
  for (var i = 0; i < len; i++) {
    var index = Math.floor(Math.random() * s.length);
    r += s.slice(index, index + 1);
  }
  return r;
}
/**
 * 格式处理
 * @param {*} n
 * @returns
 */
function formatter(n) {
  return n < 10 ? '0' + n : n;
}

/**
 * 生成文件路径
 * @param {*} file
 * @param {*} dir
 * @returns
 */
function getFilePath(file, dir) {
  var curDate = new Date();
  var year = curDate.getFullYear() + '';
  var month = curDate.getMonth() + 1;
  var date = curDate.getDate();
  var dateDir = year + formatter(month) + formatter(date);
  var suffix = file.name.split('.').slice(-1).toString();
  var filePath = '';
  filePath += dir + '/images/';
  filePath += dateDir + '/';
  filePath += randomCharacters(3) + curDate.getTime() + '.' + suffix;
  return filePath;
}

/**
 * 执行上传
 * @param {*} file
 * @param {*} dir
 * @returns
 */
function upload(file, dir) {
  return uploadForQiniu(file, dir);
}

/**
 * 上传至七牛云
 * @param {*} file
 * @param {*} dir
 * @returns
 */
function uploadForQiniu(file, dir) {
  return new Promise(function (resolve, reject) {
    var filePath = getFilePath(file, dir);
    // -- 获取后端生成的上传七牛云需要的 key & token
    fetch('http://backapi.ddou.cn/api/config/acquireUploadToken/v2', {
      method: 'POST',
      body: JSON.stringify({ filename: filePath }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('UPLOAD_TOKEN') || '',
      },
    })
      .then(function (response) {
        response
          .clone()
          .json()
          .then((res) => {
            if (res && res.code === 0) {
              var formData = new FormData();
              formData.append('file', file);
              formData.append('key', res.data.key);
              formData.append('token', res.data.uploadToken);
              // -- 上传七牛云
              fetch('https://upload.qiniup.com', {
                method: 'POST',
                body: formData,
              })
                .then(function (response) {
                  response
                    .clone()
                    .json()
                    .then(function (r) {
                      // -- 拼接链接
                      resolve('https://qn.d-dou.com/' + r.key);
                    });
                })
                .catch(function () {
                  reject();
                });
            } else {
              reject();
            }
          });
      })
      .catch(function () {
        reject();
      });
  });
}
/**
 * 上传至OSS
 * @param {*} file
 * @param {*} dir
 * @returns
 */
function uploadForOSS() {

}
