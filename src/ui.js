class TextButton extends Graphics.Group {
    constructor(x, y, textOptions, rectOptions) {
        super({ x, y });
        this.rectOptions = Object.assign({}, TextButton.DEFAULT_RECT_OPTIONS, rectOptions);
        this.textOptions = Object.assign({}, TextButton.DEFAULT_TEXT_OPTIONS, textOptions);

        this.rect = new Graphics.Rect(this.rectOptions);
        this.text = new Graphics.Text(this.textOptions);
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
        this.fire("refresh", null, true);
    }
    mouseout() {
        if (this.rectOptions.fill) this.rect.setFill(this.rectOptions.fill);
        this.mouseup()
        this.fire("refresh", null, true);
    }
    mousedown() {
        if (this.textOptions.mdownFill) this.text.setFill(this.textOptions.mdownFill);
        this.fire("refresh", null, true);
    }
    mouseup() {
        if (this.textOptions.fill) this.text.setFill(this.textOptions.fill);
        this.fire("refresh", null, true);
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
            width: this.width
        });
        this.valueText.setY(this.rect.height() / 2 - this.valueText.fontSize() / 2);
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
                this.width
            );
            this.options.add(option);
            let that = this;
            option.on("click", function(e) {
                e.cancelBubble = true;
                that.chosenIndex = this.index;
                that.valueText.setText("" + values[this.index]);
                that.options.hide();
                that.fire("update");
                that.fire("refresh", null, true);
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
        this.fire("refresh", null, true);
    }
    mouseout() {
        if (DropDown.DEFAULT_RECT_OPTIONS.fill) this.rect.setFill(DropDown.DEFAULT_RECT_OPTIONS.fill);
        this.mouseup()
        this.fire("refresh", null, true);
    }
    mousedown() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.mdownFill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.mdownFill);
        this.fire("refresh", null, true);
    }
    mouseup() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.fill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.fill);
        this.fire("refresh", null, true);
    }
    click() {
        this.moveToTop();
        this.options.show();
        this.fire("refresh", null, true);
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


class Option extends Graphics.Group {
    constructor(x, y, text, index, width) {
        super({ x, y });
        this.index = index;
        this.text = text;
        this.rect = new Graphics.Rect(Object.assign({}, Option.DEFAULT_RECT_OPTIONS, {
            width: width,
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
    }
    mouseover() {
        if (Option.DEFAULT_RECT_OPTIONS.moverFill) this.rect.setFill(Option.DEFAULT_RECT_OPTIONS.moverFill);
        this.fire("refresh", null, true);
    }
    mouseout() {
        if (Option.DEFAULT_RECT_OPTIONS.fill) this.rect.setFill(Option.DEFAULT_RECT_OPTIONS.fill);
        this.mouseup()
        this.fire("refresh", null, true);
    }
    mousedown() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.mdownFill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.mdownFill);
        this.fire("refresh", null, true);
    }
    mouseup() {
        if (DropDown.DEFAULT_TEXT_OPTIONS.fill) this.valueText.setFill(DropDown.DEFAULT_TEXT_OPTIONS.fill);
        this.fire("refresh", null, true);
    }
}
Option.DEFAULT_RECT_OPTIONS = Object.assign({}, DropDown.DEFAULT_RECT_OPTIONS, {
    stroke: '#716031',
    fill: '#1c1107',
    moverFill: '#3c3127'
});


class MultiStateButton extends TextButton {
    constructor(x, y, states, currentState, textOptions, rectOptions) {
        let mergedRectOptions = Object.assign({}, MultiStateButton.DEFAULT_RECT_OPTIONS, rectOptions);
        let mergedTextOptions = Object.assign({}, MultiStateButton.DEFAULT_TEXT_OPTIONS, textOptions, {
            text: states[currentState]
        });
        super(x, y, mergedTextOptions, mergedRectOptions);
        this.states = states;
        this.currentState = currentState;

        this.on("click", () => {
            this.currentState = (this.currentState + 1) % this.states.length;
            this.text.setText(this.states[this.currentState]);
            this.text.setX(this.rect.getWidth() / 2 - this.text.getWidth() / 2);
            this.text.setY(this.rect.getHeight() / 2 - this.text.getFontSize() / 2);
            this.fire("update");
            this.fire("refresh", null, true);
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
            data: "M 50 100 L 100 50 L 250 200 L 400 50 L 450 100 L 300 250 L 450 400 L 400 450 L 250 300 L 100 450 L 50 400 L 200 250",
            fill: this.options.stroke,
            scale: { x: this.options.width / 500, y: this.options.height / 500 },
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
        this.fire("refresh", null, true);
    }
    mouseout() {
        if (this.options.fill) this.rect.setFill(this.options.fill);
        this.fire("refresh", null, true);
    }
    click() {
        this.checked = !this.checked;
        this.mark.setVisible(this.checked);
        this.fire("update");
        this.fire("refresh", null, true);
    }
}
CheckBox.DEFAULT_OPTIONS = {
    stroke: '#817041',
    fill: '#2c2117',
    strokeWidth: 3,
    width: 30,
    height: 30,
    moverFill: '#4c4137'
}


class Header extends Graphics.Text {
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
class Label extends Graphics.Text {
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
    TextButton, Header, Label, DropDown, MultiStateButton, CheckBox
};