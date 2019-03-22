declare const tinymce: any;

function fetchImageData(url: string): Promise<Blob> {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    xhr.onload = function(e) {
      const blob = xhr.response
      blob && resolve(blob)
    }
    xhr.open('GET', url, true)
    xhr.send(null)
  })
}

const setup = (editor, url) => {
  editor.ui.registry.addButton('image', {
    icon: "rotate-left",
    tooltip: "Insert Current Date",
    onAction: () => {
      // tslint:disable-next-line:no-console
      editor.setContent('<p><img src="https://static.boredpanda.com/blog/wp-content/uploads/2018/04/handicapped-cat-rexie-the-handicat-dasha-minaeva-58-5acb4f1931e1b__700.jpg" /></p><p>233</p>');
    }
  });

  editor.on('NodeChange', function({ element }, parents) {
    const url: string = element.getAttribute('src') || ''
    if (element.tagName === 'IMG' && url) {
      fetchImageData(url).then((blob: Blob) => {
        element.setAttribute('src', window.URL.createObjectURL(blob))
      })
    }
  })

  editor.ui.registry.addContextToolbar('image_tools', {
    predicate: function (node) {
      return node.nodeName.toLowerCase() === 'img'
    },
    items: 'alignleft aligncenter alignright',
    position: 'node',
    scope: 'node'
  });

  editor.ui.registry.addContextToolbar('textselection', {
    predicate: function (node) {
      return !editor.selection.isCollapsed();
    },
    items: 'bold italic | blockquote',
    position: 'selection',
    scope: 'node'
  });
};

tinymce.PluginManager.add('image', setup);

// tslint:disable-next-line:no-empty
export default () => {};
