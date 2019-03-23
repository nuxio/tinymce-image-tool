declare const tinymce: any;
import { rotate, flipHorizontal, flipVertical } from "./util";

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

  editor.ui.registry.addButton("imageRotateleft", {
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
    items: "imageRotateleft imageRotateRight fliph flipv",
    position: "node",
    scope: "node"
  });
};

tinymce.PluginManager.add("image", setup);

// tslint:disable-next-line:no-empty
export default () => {};
