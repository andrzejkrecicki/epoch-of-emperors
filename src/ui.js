class TextButton extends Konva.Group {
    constructor(x, y, textOptions, rectOptions) {
        super({ x, y });
        this.rectOptions = Object.assign({}, TextButton.DEFAULT_RECT_OPTIONS, rectOptions);
        this.textOptions = Object.assign({}, TextButton.DEFAULT_TEXT_OPTIONS, textOptions);

        this.rect = new Konva.Rect(this.rectOptions);
        this.text = new Konva.Text(this.textOptions);
        this.text.setX(this.rect.getWidth() / 2 - this.text.getWidth() / 2);
        this.text.setY(this.rect.getHeight() / 2 - this.text.getFontSize() / 2);
        this.add(this.rect);
        this.add(this.text);

        this.on("mouseover", this.mouseover);
        this.on("mouseout", this.mouseout);
        this.on("mousedown", this.mousedown);
        this.on("mouseup", this.mouseup);
        this.on("click", this.click);
    }
    mouseover() {
        if (this.rectOptions.moverFill) this.rect.setFill(this.rectOptions.moverFill);
        this.parent.refresh();
    }
    mouseout() {
        if (this.rectOptions.fill) this.rect.setFill(this.rectOptions.fill);
        this.mouseup()
        this.parent.refresh();
    }
    mousedown() {
        if (this.textOptions.mdownFill) this.text.setFill(this.textOptions.mdownFill);
        this.parent.refresh();
    }
    mouseup() {
        if (this.textOptions.fill) this.text.setFill(this.textOptions.fill);
        this.parent.refresh();
    }
    click() {
        this.mouseout();
    }
}
TextButton.DEFAULT_TEXT_OPTIONS = {
    fontSize: 18,
    fontFamily: 'helvetica',
    fill: '#e0d09f',
    align: 'center',
    strokeWidth: 2,
    mdownFill: 'yellow',
}
TextButton.DEFAULT_RECT_OPTIONS = {
    stroke: '#817041',
    fill: '#2c2117',
    strokeWidth: 3,
    width: 370,
    height: 45,
    moverFill: '#4c4137'
}

class DropDown extends Konva.Group {
    constructor(x, y, width, values, chosenIndex) {
        super({ x, y });
        this.width = width;
        this.value = values[chosenIndex];

        this.chosen = new Konva.Group();

        this.rect = new Konva.Rect(Object.assign({}, DropDown.DEFAULT_RECT_OPTIONS, {
            width: this.width
        }));
        this.chosen.add(this.rect);
        this.valueText = new Label({
            text: "" + this.value,
            width: this.width
        });
        this.valueText.setY(this.rect.height() / 2 - this.valueText.fontSize() / 2);
        this.chosen.add(this.valueText);
        this.add(this.chosen);

        this.options = new Konva.Group({
            x: 0, y: this.rect.height(),
            visible: false
        });
        this.add(this.options);

        for (let i= 0 ; i < values.length; ++i) {
            let option = new Option(
                0, i * DropDown.DEFAULT_RECT_OPTIONS.height,
                "" + values[i], i,
                this.width
            );
            this.options.add(option);
            let that = this;
            option.on("click", function(e) {
                e.cancelBubble = true;
                that.value = this.value;
                that.valueText.setText("" + values[this.value]);
                that.options.hide();
                that.refresh();
            });
        }
        this.chosen.on("mouseover", this.mouseover.bind(this));
        this.chosen.on("mouseout", this.mouseout.bind(this));
        this.chosen.on("mousedown", this.mousedown.bind(this));
        this.chosen.on("mouseup", this.mouseup.bind(this));
        this.chosen.on("click", this.click.bind(this));
    }
    mouseover() {
        if (DropDown.DEFAULT_RECT_OPTIONS.moverFill) this.rect.setFill(DropDown.DEFAULT_RECT_OPTIONS.moverFill);
        this.refresh();
    }
    mouseout() {
        if (DropDown.DEFAULT_RECT_OPTIONS.fill) this.rect.setFill(DropDown.DEFAULT_RECT_OPTIONS.fill);
        this.mouseup()
        this.refresh();
    }
    mousedown() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.mdownFill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.mdownFill);
        this.refresh();
    }
    mouseup() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.fill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.fill);
        this.refresh();
    }
    click() {
        this.options.show();
        this.refresh();
    }
    refresh() {
        this.parent.refresh();
    }
}
DropDown.DEFAULT_RECT_OPTIONS = {
    stroke: '#817041',
    fill: '#2c2117',
    strokeWidth: 3,
    height: 30,
    width: 80,
    moverFill: '#4c4137'
}
DropDown.DEFAULT_TEXT_OPTIONS = {
    fill: '#e0d09f',
    mdownFill: 'yellow'
}


class Option extends Konva.Group {
    constructor(x, y, text, value, width) {
        super({ x, y });
        this.value = value;
        this.text = text;
        this.rect = new Konva.Rect(Object.assign({}, DropDown.DEFAULT_RECT_OPTIONS, {
            width: width
        }));
        this.add(this.rect);
        this.valueText = new Label({
            text: this.text,
            width: width
        });
        this.valueText.setY(this.rect.height() / 2 - this.valueText.fontSize() / 2);
        this.add(this.valueText);

        this.on("mouseover", this.mouseover);
        this.on("mouseout", this.mouseout);
        this.on("mousedown", this.mousedown);
        this.on("mouseup", this.mouseup);
        this.on("click", function() {
            this.parent.parent.fire("update");
        });
    }
    mouseover() {
        if (DropDown.DEFAULT_RECT_OPTIONS.moverFill) this.rect.setFill(DropDown.DEFAULT_RECT_OPTIONS.moverFill);
        this.refresh();
    }
    mouseout() {
        if (DropDown.DEFAULT_RECT_OPTIONS.fill) this.rect.setFill(DropDown.DEFAULT_RECT_OPTIONS.fill);
        this.mouseup()
        this.refresh();
    }
    mousedown() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.mdownFill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.mdownFill);
        this.refresh();
    }
    mouseup() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.fill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.fill);
        this.refresh();
    }
    refresh() {
        this.parent.parent.refresh();
    }
}


class Header extends Konva.Text {
    constructor(options) {
        super(Object.assign({}, options, Header.DEFAULT_OPTIONS));
    }
}
Header.DEFAULT_OPTIONS = {
    fontSize: 17,
    fontFamily: 'helvetica',
    fill: '#c0dcc0',
    align: 'center',
    strokeWidth: 2,
}
class Label extends Konva.Text {
    constructor(options) {
        super(Object.assign({}, options, Label.DEFAULT_OPTIONS));
    }
}
Label.DEFAULT_OPTIONS = {
    fontSize: 14,
    fontFamily: 'helvetica',
    fill: '#c0dcc0',
    align: 'center',
    strokeWidth: 2,
}

export {
    TextButton, Header, Label, DropDown
};