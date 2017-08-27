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
        this.draw();
    }
    mouseout() {
        if (this.rectOptions.fill) this.rect.setFill(this.rectOptions.fill);
        this.mouseup()
        this.draw();
    }
    mousedown() {
        if (this.textOptions.mdownFill) this.text.setFill(this.textOptions.mdownFill);
        this.draw();
    }
    mouseup() {
        if (this.textOptions.fill) this.text.setFill(this.textOptions.fill);
        this.draw();
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

export {
    TextButton
};