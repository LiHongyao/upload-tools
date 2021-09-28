/*
 * @Author: Lee
 * @Date: 2021-09-27 15:43:03
 * @LastEditors: Lee
 * @LastEditTime: 2021-09-28 10:43:04
 */
$(function () {
  // 1. 登录
  // login();
  // 2. 变量
  var dirName = "";
  var link = "";
  // 3. 处理单选
  if ($(".radio-item").length === 0) {
    dirName = "/upload";
    $(".file-mask").remove();
  }
  $(".radio-item").click(function () {
    dirName = $(this).data("dir");
    $(".upload-status").empty();
    $(".file-mask").remove();
    $(this).addClass("checked").siblings().removeClass("checked");
  });
  // 4. 处理文件选择
  $("[type = file]").change(function () {
    $(".upload-status").html('<span class="loading">上传中，请稍后...</span>');
    // 获取选择的文件
    var file = this.files[0];
    $(".file-tips").text(file.name);
    upload(file, dirName)
      .then(function (imgLink) {
        link = imgLink;
        $(".upload-link").text(imgLink);
        $(".upload-img").attr("src", imgLink);
        $(".upload-res").addClass("show");
        $(".upload-status").html('<span class="success">上传成功</span>');
        $(".prevview .prevview-img").attr("src", imgLink);
      })
      .catch(function () {
        $(".upload-status").html(
          '<span class="fail">上传失败，请重新上传~</span>'
        );
      });
  });
  // 5. 判断
  $(".file-mask").click(function () {
    $(".upload-status").html('<span class="fail">温馨提示：请选择项目~</span>');
  });
  // 6. 处理复制
  $(".upload-link").click(function () {
    clipboard(link);
    $(".upload-status").html(
      '<span class="success">温馨提示：链接已复制！</span>'
    );
  });
  // 7. 预览图片
  $(".upload-img").click(function () {
    $(".prevview").addClass("show");
  });
  // 8. 关闭预览
  $(".icon-close").click(function () {
    $(".prevview").removeClass("show");
  });
});
