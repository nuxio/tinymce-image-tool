import Plugin from '../../main/ts/Plugin';

declare let tinymce: any;

Plugin();

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'code image link image-tool',
  toolbar: 'image-tool',
  contextmenu: "link image image-tool table spellchecker"
});
