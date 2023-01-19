figma.showUI(__html__, { width: 250, height: 420 });

figma.ui.onmessage = msg => {
  if(msg.type === 'init') {
    if(figma.currentPage.selection.length === 0) {
      figma.ui.postMessage({ type: 'textSelect', message: false });
    }else {
      const text = figma.currentPage.selection[0] as TextNode;
      if(text.type === 'TEXT') {
        figma.ui.postMessage({ type: 'textSelect', message: {
          fontSize: text.fontSize,
        } });
      }
    }
  }

  if(msg.type === 'submit') {
    let { baselinePixel, lineheightMultiplier } = msg;

    // get current text node
    const text = figma.currentPage.selection[0] as TextNode;
    let a = 0;
    const fontSize = text.fontSize;

    if(typeof fontSize !== 'number') {
      return;
    }

    // value should be the next number divisble by value above fontSize
    if(fontSize % (baselinePixel) !== 0) {
      baselinePixel = Math.ceil(fontSize / (baselinePixel)) * (baselinePixel);
    }

    console.log(baselinePixel);

    a = (baselinePixel * lineheightMultiplier) / (fontSize / 100);

    // load font
    figma.loadFontAsync(text.fontName as FontName).then(() => {
      // set font line height to a%
      text.lineHeight = {
        unit: 'PERCENT',
        value: a
      };
    });
    
  }

  if(msg.type === 'cancel') {
    figma.closePlugin();
  }
}

// if a user deselect the artboard, send a message to the UI
figma.on('selectionchange', () => {
  if(figma.currentPage.selection.length === 0) {
    figma.ui.postMessage({ type: 'textSelect', message: false });
  }else {
    const text = figma.currentPage.selection[0] as TextNode;
    if(text.type === 'TEXT') {
      figma.ui.postMessage({ type: 'textSelect', message: { fontSize: text.fontSize } });
    }
  }
});