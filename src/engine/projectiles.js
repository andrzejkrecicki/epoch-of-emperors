import { Sprites } from '../sprites.js';

class LinearProjectile extends Graphics.Node {
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
            attack: 4
        };
    }
}
Spear.prototype.SPEED = 10;
Spear.prototype.RADIUS = 17;
Spear.prototype.IMAGES = Sprites.SpriteSequence("img/projectiles/spear/", 32);
Spear.prototype.IMAGE_OFFSETS = { x: 25, y: 9 };


class Arrow extends LinearProjectile {
    constructor(thrower, victim, position, target, subtile_x, subtile_y) {
        super(thrower, victim, position, target, subtile_x, subtile_y);
        this.attributes = {
            attack: thrower.attributes.attack
        };
    }
}
Arrow.prototype.SPEED = 10;
Arrow.prototype.RADIUS = 13;
Arrow.prototype.IMAGES = Sprites.SpriteSequence("img/projectiles/arrow/", 72);
Arrow.prototype.IMAGE_OFFSETS = { x: 20, y: 6 };

export {
    Spear, Arrow
}
