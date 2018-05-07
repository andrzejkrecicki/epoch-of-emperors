import { make_image, leftpad } from '../utils.js';


class LinearProjectile extends Graphics.Group {
    constructor(thrower, victim, position, target, subtile_x, subtile_y) {
        super({
            x: position.x,
            y: position.y
        });
        this.thrower = thrower;
        this.victim = victim;
        this.target = target;
        this.subtile_x = subtile_x;
        this.subtile_y = subtile_y;
        this.realPosition = position;
        this.angle = Math.atan2(target.y - position.y, target.x - position.x);
        this.delta = {
            x: this.SPEED * Math.cos(this.angle),
            y: this.SPEED * Math.sin(this.angle)
        }

        let normalized_angle = this.angle;
        if (this.angle < 0) normalized_angle = 2 * Math.PI + this.angle;

        let img_idx = Math.floor((normalized_angle / (2 * Math.PI)) * this.IMAGES.length);

        this.image = new Graphics.Image({
            image: this.IMAGES[img_idx],
            x: -this.IMAGE_OFFSETS.x,
            y: -this.IMAGE_OFFSETS.y
        })
        this.add(this.image);
        this.resetBoundingBox();
        this.destroyed = false;
        this.TTL = 35;
    }
    draw() {
        super.draw();
    }
    getBoundingBox() {
        return this.boundingBox;
    }
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() -this.IMAGE_OFFSETS.x,
            y: this.y() -this.IMAGE_OFFSETS.y,
            w: this.IMAGES[0].width,
            h: this.IMAGES[0].height
        }
    }
    position(pos) {
        if (pos == null) return super.position();
        let old = {
            x: this.attrs.x,
            y: this.attrs.y
        };
        this.realPosition = pos;
        super.position({
            x: Math.round(this.realPosition.x),
            y: Math.round(this.realPosition.y)
        });
        if (this.parent != null) this.parent.updateBucket(this, old);
    }
    destroy() {
        this.destroyed = true;
        this.remove();
    }
}



class Spear extends LinearProjectile {
    constructor() {
        super(...arguments);
        this.attributes = {
            attack: 3
        };
    }
}
Spear.prototype.SPEED = 10;

Spear.prototype.IMAGES = [];
for (let i = 0; i < 32; ++i) Spear.prototype.IMAGES.push(
    make_image(`img/projectiles/spear/${leftpad(i, 2, "0")}.png`)
)

Spear.prototype.IMAGE_OFFSETS = { x: 25, y: 9 };

export {
    Spear
}
