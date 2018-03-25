class TextButton extends Graphics.Group {
    constructor(x, y, textOptions, rectOptions) {
        super({ x, y });
        this.rectOptions = Object.assign({}, TextButton.DEFAULT_RECT_OPTIONS, rectOptions);
        this.textOptions = Object.assign({
            x: this.rectOptions.width / 2,
            y: this.rectOptions.height / 2
        }, TextButton.DEFAULT_TEXT_OPTIONS, textOptions);

        this.rect = new Graphics.Rect(this.rectOptions);
        this.text = new Graphics.Text(this.textOptions);

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
        this.fire("refresh");
    }
    mouseout() {
        if (this.rectOptions.fill) this.rect.setFill(this.rectOptions.fill);
        this.mouseup()
    }
    mousedown() {
        if (this.textOptions.mdownFill) this.text.setFill(this.textOptions.mdownFill);
        this.fire("refresh");
    }
    mouseup() {
        if (this.textOptions.fill) this.text.setFill(this.textOptions.fill);
        this.fire("refresh");
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
    fill: 'rgba(44, 33, 23, .7)',
    strokeWidth: 3,
    width: 370,
    height: 45,
    moverFill: 'rgba(76, 65, 55, .7)'
}

class DropDown extends Graphics.Group {
    constructor(x, y, width, values, chosenIndex) {
        super({ x, y });
        this.width = width;
        this.values = values;
        this.chosenIndex = chosenIndex;

        this.chosen = new Graphics.Group();

        this.rect = new Graphics.Rect(Object.assign({}, DropDown.DEFAULT_RECT_OPTIONS, {
            width: this.width
        }));
        this.chosen.add(this.rect);
        this.valueText = new Label({
            text: "" + this.values[this.chosenIndex],
            width: this.width,
            align: "center",
            textBaseline: "middle",
            x: this.width / 2,
            y: this.rect.height() / 2
        });
        this.chosen.add(this.valueText);
        this.add(this.chosen);

        this.options = new Graphics.Group({
            x: 0, y: this.rect.height(),
            visible: false
        });
        this.add(this.options);

        for (let i= 0 ; i < values.length; ++i) {
            let option = new Option(
                0, i * DropDown.DEFAULT_RECT_OPTIONS.height,
                "" + values[i], i,
                this.rect.width(),
                this.rect.height()
            );
            this.options.add(option);
            let that = this;
            option.on("click", function(e) {
                e.cancelBubble = true;
                that.chosenIndex = this.index;
                that.valueText.setText("" + values[this.index]);
                that.options.hide();
                that.fire("update");
                that.fire("refresh");
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
        this.fire("refresh");
    }
    mouseout() {
        if (DropDown.DEFAULT_RECT_OPTIONS.fill) this.rect.setFill(DropDown.DEFAULT_RECT_OPTIONS.fill);
        this.mouseup()
        this.fire("refresh");
    }
    mousedown() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.mdownFill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.mdownFill);
        this.fire("refresh");
    }
    mouseup() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.fill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.fill);
        this.fire("refresh");
    }
    click() {
        this.moveToTop();
        if (this.options.visible()) this.options.hide();
        else this.options.show();
        this.fire("refresh");
    }
}
DropDown.DEFAULT_RECT_OPTIONS = {
    stroke: '#817041',
    fill: 'rgba(44, 33, 23, .7)',
    strokeWidth: 3,
    height: 30,
    width: 80,
    moverFill: 'rgba(76, 65, 55, .7)'
}
DropDown.DEFAULT_TEXT_OPTIONS = {
    fill: '#e0d09f',
    mdownFill: 'yellow'
}


class Option extends Graphics.Group {
    constructor(x, y, text, index, width, height) {
        super({ x, y });
        this.index = index;
        this.text = text;
        this.rect = new Graphics.Rect(Object.assign({}, Option.DEFAULT_RECT_OPTIONS, {
            width: width,
            height: height
        }));
        this.add(this.rect);
        this.valueText = new Label({
            text: this.text,
            x: this.rect.width() / 2,
            y: this.rect.height() / 2,
            align: "center",
            textBaseline: "middle"
        });
        this.add(this.valueText);

        this.on("mouseover", this.mouseover);
        this.on("mouseout", this.mouseout);
        this.on("mousedown", this.mousedown);
        this.on("mouseup", this.mouseup);
    }
    mouseover() {
        if (Option.DEFAULT_RECT_OPTIONS.moverFill) this.rect.setFill(Option.DEFAULT_RECT_OPTIONS.moverFill);
        this.fire("refresh");
    }
    mouseout() {
        if (Option.DEFAULT_RECT_OPTIONS.fill) this.rect.setFill(Option.DEFAULT_RECT_OPTIONS.fill);
        this.mouseup()
        this.fire("refresh");
    }
    mousedown() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.mdownFill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.mdownFill);
        this.fire("refresh");
    }
    mouseup() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.fill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.fill);
        this.fire("refresh");
    }
}
Option.DEFAULT_RECT_OPTIONS = Object.assign({}, DropDown.DEFAULT_RECT_OPTIONS, {
    stroke: '#716031',
    fill: 'rgba(28, 17, 7, .7)',
    moverFill: 'rgba(60, 49, 39, .7)'
});


class MultiStateButton extends TextButton {
    constructor(x, y, states, currentState, textOptions, rectOptions) {
        let mergedRectOptions = Object.assign({}, MultiStateButton.DEFAULT_RECT_OPTIONS, rectOptions);
        let mergedTextOptions = Object.assign({}, MultiStateButton.DEFAULT_TEXT_OPTIONS, textOptions, {
            text: states[currentState],
            width: mergedRectOptions.width,
            height: mergedRectOptions.height
        });
        super(x, y, mergedTextOptions, mergedRectOptions);
        this.states = states;
        this.currentState = currentState;

        this.on("click", () => {
            this.currentState = (this.currentState + 1) % this.states.length;
            this.text.setText(this.states[this.currentState]);
            this.fire("update");
            this.fire("refresh");
        });
    }
}
MultiStateButton.DEFAULT_RECT_OPTIONS = Object.assign({}, TextButton.DEFAULT_RECT_OPTIONS, {
    width: 40,
    height: 30
});
MultiStateButton.DEFAULT_TEXT_OPTIONS = Object.assign({}, TextButton.DEFAULT_TEXT_OPTIONS, {
    fontSize: 14
});


class CheckBox extends Graphics.Group {
    constructor(x, y, checked, options) {
        super({ x, y });
        this.options = Object.assign({}, CheckBox.DEFAULT_OPTIONS, options);

        this.checked = checked;

        this.rect = new Graphics.Rect(this.options);
        this.mark = new Graphics.Path({
            fill: this.options.stroke,
            visible: checked
        });
        this.add(this.rect);
        this.add(this.mark);

        this.on("mouseover", this.mouseover);
        this.on("mouseout", this.mouseout);
        this.on("click", this.click);
    }
    mouseover() {
        if (this.options.moverFill) this.rect.setFill(this.options.moverFill);
        this.fire("refresh");
    }
    mouseout() {
        if (this.options.fill) this.rect.setFill(this.options.fill);
        this.fire("refresh");
    }
    click() {
        this.checked = !this.checked;
        this.mark.setVisible(this.checked);
        this.fire("update");
        this.fire("refresh");
    }
}
CheckBox.DEFAULT_OPTIONS = {
    stroke: '#817041',
    fill: 'rgba(44, 33, 23, .7)',
    strokeWidth: 3,
    width: 30,
    height: 30,
    moverFill: 'rgba(76, 65, 55, .7)'
}


class Header extends Graphics.Text {
    constructor(options) {
        super(Object.assign({}, Header.DEFAULT_OPTIONS, options));
    }
}
Header.DEFAULT_OPTIONS = {
    fontSize: 17,
    fontFamily: 'helvetica',
    fill: '#c0dcc0',
    align: 'left',
    strokeWidth: 2,
}
class Label extends Graphics.Text {
    constructor(options) {
        super(Object.assign({}, Label.DEFAULT_OPTIONS, options));
    }
}
Label.DEFAULT_OPTIONS = {
    fontSize: 14,
    fontFamily: 'helvetica',
    fill: '#c0dcc0',
    align: 'left',
    textBaseline: "top",
    strokeWidth: 2,
}

export {
    TextButton, Header, Label, DropDown, MultiStateButton, CheckBox
};