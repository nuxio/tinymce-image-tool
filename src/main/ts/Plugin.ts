declare const tinymce: any;

const setup = (editor, url) => {
  editor.addButton('image', {
    text: 'image button',
    icon: false,
    onclick: () => {
      // tslint:disable-next-line:no-console
      editor.setContent('<p>content added from image</p>');
    }
  });
};

tinymce.PluginManager.add('image', setup);

// tslint:disable-next-line:no-empty
export default () => {};
