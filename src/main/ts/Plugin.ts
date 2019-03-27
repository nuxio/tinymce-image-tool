declare const tinymce: any;
import {
  getImageBlob,
  processImage,
  setImageProxy,
  setWhiteList,
  fetchImageData
} from './util';

let current: HTMLImageElement = null;
const toolModalConfig = function () {
  return {
    title: 'Edit Image',
    size: 'large',
    body: {
      type: 'panel',
      items: [
        {
          type: 'imagetools',
          name: 'imagetools',
          label: 'Edit Image',
          currentState: null
        }
      ]
    },
    buttons: [
      {
        type: 'cancel',
        name: 'cancel',
        text: 'Cancel'
      },
      {
        type: 'submit',
        name: 'save',
        text: 'Save',
        primary: true,
        disabled: true
      }
    ],
    onSubmit: (dialog) => {
      const blob = dialog.getData().imagetools.blob;
      current.setAttribute('src', window.URL.createObjectURL(blob));
      dialog.close();
    },
    onAction: (dialog, action) => {
      switch (action.name) {
        case 'save-state':
          action.value ? dialog.enable('save') : dialog.disable('save');
          break;
        case 'disable':
          dialog.disable('save'), dialog.disable('cancel');
          break;
        case 'enable':
          dialog.enable('cancel');
      }
    }
  };
};
const buttons = [
  {
    name: 'imageRotateLeft',
    tooltip: 'Rotate left',
    icon: 'rotate-left',
    command: 'mceImageRotateLeft'
  },
  {
    name: 'imageRotateRight',
    tooltip: 'Rotate right',
    icon: 'rotate-right',
    command: 'mceImageRotateRight'
  },
  {
    name: 'flipv',
    tooltip: 'Flip vertically',
    icon: 'flip-vertically',
    command: 'mceImageFlipVertical'
  },
  {
    name: 'fliph',
    tooltip: 'Flip horizontally',
    icon: 'flip-horizontally',
    command: 'mceImageFlipHorizontal'
  },
  {
    name: 'edit-image',
    tooltip: 'Edit image',
    icon: 'edit-image',
    command: 'mceEditImage'
  }
];

const setup = (editor, url) => {
  const {
    image_proxy,
    cross_origin_image_white_list,
    upload_edit_image
  } = editor.editorManager.settings;
  setImageProxy(image_proxy);
  setWhiteList(cross_origin_image_white_list);

  editor.addCommand('mceImageRotateLeft', function () {
    processImage(current, 'rotate', { degree: -90 });
  });

  editor.addCommand('mceImageRotateRight', function () {
    processImage(current, 'rotate', { degree: 90 });
  });

  editor.addCommand('mceImageFlipVertical', function () {
    processImage(current, 'flipVertical');
  });

  editor.addCommand('mceImageFlipHorizontal', function () {
    processImage(current, 'flipHorizontal');
  });

  editor.addCommand('mceEditImage', function () {
    if (!current) {
      return false;
    }
    getImageBlob(current).then((state) => {
      const config = toolModalConfig();
      config.body.items[0].currentState = state;
      editor.windowManager.open(config);
    });
  });

  buttons.forEach((button) => {
    const { tooltip, icon, command, name } = button;
    editor.ui.registry.addButton(name, {
      tooltip,
      icon,
      onAction: () => {
        editor.execCommand(command);
      }
    });
  });

  // 为图片增加操作栏
  editor.ui.registry.addContextToolbar('image_tools', {
    predicate: (node) => {
      return node.nodeName.toLowerCase() === 'img';
    },
    items: 'imageRotateLeft imageRotateRight fliph flipv edit-image',
    position: 'node',
    scope: 'node'
  });

  // 增加一个菜单项
  editor.ui.registry.addMenuItem('edit-image', {
    icon: 'edit-image',
    text: 'Edit image',
    onAction: () => {
      editor.execCommand('mceEditImage');
    }
  });

  // 将 image-tool 添加到右键菜单
  editor.ui.registry.addContextMenu('edit-image', {
    update: (element) => {
      return !element.src ? '' : 'edit-image';
    }
  });

  editor.on('NodeChange', function ({ element }) {
    const src: string = element.getAttribute('src');
    if (element.tagName === 'IMG' && src) {
      current = element;
    } else if (current) {
      if (
        current.src.startsWith('blob') &&
        typeof upload_edit_image === 'function'
      ) {
        const image = current;
        fetchImageData(image.src).then((blob) => {
          const file = new File([blob], `image_${new Date().getTime()}`, {
            type: 'image/png'
          });
          upload_edit_image(image, file);
        });
      }
      current = null;
    }
  });
};

tinymce.PluginManager.add('image-tool', setup);

// tslint:disable-next-line:no-empty
export default () => {};
