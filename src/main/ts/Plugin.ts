declare const tinymce: any;
import { rotate, flipHorizontal, flipVertical, getImageBlob } from "./util";

let current: HTMLImageElement = null;

const setup = (editor, url) => {
  editor.ui.registry.addButton("image", {
    icon: "rotate-left",
    tooltip: "Insert Current Date",
    onAction: () => {
      console.log("123");
    }
  });

  editor.addCommand("mceImageRotateLeft", function() {
    rotate(current, -90);
  });

  editor.addCommand("mceImageRotateRight", function() {
    rotate(current, 90);
  });

  editor.addCommand("mceImageFlipVertical", function() {
    flipVertical(current);
  });

  editor.addCommand("mceImageFlipHorizontal", function() {
    flipHorizontal(current);
  });

  editor.addCommand("mceEditImage", function() {
    const blob = getImageBlob(current)

    editor.windowManager.open({
        title: "Edit Image",
        size: "large",
        body: {
            type: "panel",
            items: [{
                type: "imagetools",
                name: "imagetools",
                label: "Edit Image",
                currentState: blob,
            }]
        },
        buttons: [{
            type: "cancel",
            name: "cancel",
            text: "Cancel"
        }, {
            type: "submit",
            name: "save",
            text: "Save",
            primary: true,
            disabled: true
        }],
        onSubmit: function() {
          console.log('fuck')
        },
        onCancel: function() {},
        onAction: function(t, e) {
          console.log(arguments)
        }
    })
  });

  editor.ui.registry.addButton("imageRotateLeft", {
    tooltip: "Rotate left",
    icon: "rotate-left",
    onAction: () => {
      editor.execCommand("mceImageRotateLeft");
    }
  });

  editor.ui.registry.addButton("imageRotateRight", {
    tooltip: "Rotate right",
    icon: "rotate-right",
    onAction: () => {
      editor.execCommand("mceImageRotateRight");
    }
  });

  editor.ui.registry.addButton("flipv", {
    tooltip: "Flip vertically",
    icon: "flip-vertically",
    onAction: () => {
      editor.execCommand("mceImageFlipVertical");
    }
  });

  editor.ui.registry.addButton("fliph", {
    tooltip: "Flip horizontally",
    icon: "flip-horizontally",
    onAction: () => {
      editor.execCommand("mceImageFlipHorizontal");
    }
  });

  editor.ui.registry.addButton("editimage", {
      tooltip: "Edit image",
      icon: "edit-image",
      onAction: () => {
        editor.execCommand("mceEditImage");
      },
      onSetup: function(n) {
        console.log(n)
      }
  })

  editor.on("NodeChange", function({ element }, parents) {
    const url: string = element.getAttribute("src") || "";
    if (element.tagName === "IMG" && url) {
      current = element;
    } else if (current) {
      current = null;
    }
  });

  editor.ui.registry.addContextToolbar("image_tools", {
    predicate: function(node) {
      return node.nodeName.toLowerCase() === "img";
    },
    items: "imageRotateLeft imageRotateRight fliph flipv editimage",
    position: "node",
    scope: "node"
  });
};

tinymce.PluginManager.add("image", setup);

// tslint:disable-next-line:no-empty
export default () => {};
