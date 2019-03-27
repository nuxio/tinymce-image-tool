import Plugin from '../../main/ts/Plugin';

declare let tinymce: any;

Plugin();

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'code image link image-tool',
  toolbar: 'edit-image',
  contextmenu: 'link image edit-image table spellchecker',

  // plugin configs
  image_proxy: 'http://172.16.3.50:3000/image?url=',  // 如果是跨域图片 将通过这个 url 重新获取图片
  cross_origin_image_white_list: '', // 可以配置不同域下的图片不使用 image_proxy
  upload_edit_image(image, file) {   // 图片失焦后的上传回调，如果有更改图片就会调用
    // console.log(image, file)
  }
});
