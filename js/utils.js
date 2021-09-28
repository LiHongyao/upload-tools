/*
 * @Author: Lee
 * @Date: 2021-09-27 15:43:13
 * @LastEditors: Lee
 * @LastEditTime: 2021-09-28 10:50:08
 */

/**
 * 剪贴板
 * @param {*} value
 * @returns
 */
function clipboard(value) {
  return new Promise(function (resolve, reject) {
    var input = document.createElement("input");
    input.setAttribute("value", value);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand("copy");
    document.body.removeChild(input);
    if (result) {
      resolve(null);
    } else {
      reject();
    }
  });
}

/**
 * 登录授权
 */
function login() {
  fetch("http://backapi.ddou.cn/api/login/in", {
    method: "POST",
    body: JSON.stringify({
      userName: "同名",
      password: "!@#sajdn123",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (response) {
    response
      .clone()
      .json()
      .then(function (r) {
        if (r && r.code === 0) {
          localStorage.setItem("UPLOAD_TOKEN", r.data.token);
        }
      });
  });
}

/**
 * 随机字符
 * @param {*} len
 * @returns
 */
function randomCharacters(len) {
  var s = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var r = "";
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
  return n < 10 ? "0" + n : n;
}

/**
 * 生成文件路径
 * @param {*} file
 * @param {*} dir
 * @returns
 */
function getFilePath(file, dir) {
  var curDate = new Date();
  var year = curDate.getFullYear() + "";
  var month = curDate.getMonth() + 1;
  var date = curDate.getDate();
  var dateDir = year + formatter(month) + formatter(date);
  var suffix = file.name.split(".").slice(-1).toString();
  var filePath = "";
  filePath += dir + "/images/";
  filePath += dateDir + "/";
  filePath += randomCharacters(3) + curDate.getTime() + "." + suffix;
  return filePath;
}

/**
 * 执行上传
 * @param {*} file
 * @param {*} dir
 * @returns
 */
function upload(file, dir) {
  return new Promise(function (resolve, reject) {
    var filePath = getFilePath(file, dir);
    fetch("http://backapi.ddou.cn/api/config/acquireUploadToken/v2", {
      method: "POST",
      body: JSON.stringify({ filename: filePath }),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("UPLOAD_TOKEN") || "",
      },
    })
      .then(function (response) {
        response
          .clone()
          .json()
          .then((res) => {
            if (res && res.code === 0) {
              var _ = new FormData();
              _.append("file", file);
              _.append("key", res.data.key);
              _.append("token", res.data.uploadToken);
              fetch("https://upload.qiniup.com", {
                method: "POST",
                body: _,
              })
                .then(function (response) {
                  response
                    .clone()
                    .json()
                    .then(function (r) {
                      resolve("https://qn.d-dou.com/" + r.key);
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
