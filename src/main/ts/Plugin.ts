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

let current: HTMLImageElement = null

const setup = (editor, url) => {
  editor.ui.registry.addButton('image', {
    icon: "rotate-left",
    tooltip: "Insert Current Date",
    onAction: () => {
      // tslint:disable-next-line:no-console
      editor.setContent('<p><img width="200" height="200" src="/src/demo/cat.jpg" /></p><p>233</p>');
    }
  });

  editor.addCommand('mceImageRotateLeft', function () {
    // const canvas = document.createElement('canvas')
    // const ctx = canvas.getContext('2d')
    // canvas.height = current.naturalHeight || current.height
    // canvas.width = current.naturalWidth || current.width

    // ctx.drawImage(current, 0, 0)
    // ctx.translate(canvas.width/2, canvas.height/2)
    // ctx.rotate(90)
  })

  editor.ui.registry.addButton("imageRotateleft", {
    tooltip: "Rotate counterclockwise",
    icon: "rotate-right",
    onAction: () => {
      editor.execCommand("mceImageRotateLeft")
    },
  })

  editor.on('NodeChange', function({ element }, parents) {
    const url: string = element.getAttribute('src') || ''
    if (element.tagName === 'IMG' && url) {
      current = element
      fetchImageData(url).then(blob => {
        element.setAttribute('src', window.URL.createObjectURL(blob))
      })
    } else if (current) {
      current = null
    }
  })

  editor.ui.registry.addContextToolbar('image_tools', {
    predicate: function (node) {
      return node.nodeName.toLowerCase() === 'img'
    },
    items: 'imageRotateleft',
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
