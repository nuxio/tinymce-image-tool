declare const tinymce: any;
import { rotate, flipHorizontal, flipVertical, getImageBlob } from "./util";

let current: HTMLImageElement = null;

const setup = (editor, url) => {
  editor.ui.registry.addButton("image-tool", {
    icon: "edit-image",
    tooltip: "Edit image",
    onAction: () => {
      editor.execCommand("mceEditImage")
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
    if (!current) {
      return false
    }

    const blob = getImageBlob(current);

    editor.windowManager.open({
      title: "Edit Image",
      size: "large",
      body: {
        type: "panel",
        items: [
          {
            type: "imagetools",
            name: "imagetools",
            label: "Edit Image",
            currentState: blob
          }
        ]
      },
      buttons: [
        {
          type: "cancel",
          name: "cancel",
          text: "Cancel"
        },
        {
          type: "submit",
          name: "save",
          text: "Save",
          primary: true,
          disabled: true
        }
      ],
      onSubmit: function(dialog) {
        const blob = dialog.getData().imagetools.blob;
        current.setAttribute("src", window.URL.createObjectURL(blob));
        dialog.close();
      },
      onCancel: function() {},
      onAction: function(dialog, action) {
        switch (action.name) {
          case "save-state":
            action.value ? dialog.enable("save") : dialog.disable("save");
            break;
          case "disable":
            dialog.disable("save"), dialog.disable("cancel");
            break;
          case "enable":
            dialog.enable("cancel");
        }
      }
    });
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
    }
  });

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

  editor.ui.registry.addMenuItem('image-tool', {
    icon: 'edit-image',
    text: 'Edit image',
    onAction: () => {
      editor.execCommand("mceEditImage");
    }
  });

  editor.ui.registry.addContextMenu("image-tool", {
    update: function (element) {
      return !element.src ? '' : 'image-tool';
    }
  });
};

tinymce.PluginManager.add("image-tool", setup);

// tslint:disable-next-line:no-empty
export default () => {};
