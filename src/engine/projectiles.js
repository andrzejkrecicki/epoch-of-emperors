import { Entity } from './entity.js';
import { Sprites } from '../sprites.js';
import { FPS, distance } from '../utils.js';


class Projectile extends Graphics.Node {
    constructor(thrower, victim, position, target, subtile_x, subtile_y) {
        super({
            x: position.x,
            y: position.y
        });
        this.thrower = thrower;
        this.victim = victim;
        this.realPosition = position;
        this.target = target;
        this.subtile_x = subtile_x;
        this.subtile_y = subtile_y;
        this.isFloating = true;
        this.shadow = this.makeShadow();
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
    makeShadow() {
        return null;
    }
    move() {}
    destroy() {
        this.destroyed = true;
        this.remove();
        if (this.shadow) this.shadow.destroy();
    }
    getDelta() {}
    hasReachedSubitle() {
        return distance(this.realPosition, this.target) - this.RADIUS <= this.SPEED / 2
    }
    hasReachedVictim(target_pos) {}
}
Projectile.prototype.TRACE = null;


class LinearProjectile extends Projectile {
    constructor(thrower, victim, position, target, subtile_x, subtile_y) {
        super(thrower, victim, position, target, subtile_x, subtile_y);
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
        this.TTL = FPS;
    }
    getDelta() {
        return this.delta;
    }
    move() {
        let delta = this.getDelta();
        let pos = {
            x: this.realPosition.x + delta.x,
            y: this.realPosition.y + delta.y
        };
        this.position(pos);
    }
    hasReachedVictim(target_pos) {
        return distance(this.realPosition, target_pos) - this.RADIUS <= this.SPEED / 2
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



class ParabolicProjectile extends Projectile {
    constructor(thrower, victim, position, target, subtile_x, subtile_y) {
        super(thrower, victim, position, target, subtile_x, subtile_y);
        this.initialHeight = thrower.getProjectileZOffset();

        let begin = thrower.getExactSubtileCenter();
        this.position3d = {
            x: begin.subtile_x,
            y: begin.subtile_y,
            z: this.initialHeight,
        };

        let end = victim.getExactSubtileCenter();
        this.angle = {
            alpha: Math.PI / 4,
            beta: Math.atan2(end.subtile_y - begin.subtile_y, end.subtile_x - begin.subtile_x)
        };

        this.speed = this.getInitialSpeed(begin, end);

        this.delta3d = {
            x: this.speed * Math.cos(this.angle.alpha) * Math.cos(this.angle.beta),
            y: this.speed * Math.cos(this.angle.alpha) * Math.sin(this.angle.beta),
            z: this.speed * Math.sin(this.angle.alpha),
        };

        this.image = new Graphics.Image({
            image: this.IMAGES[0],
            x: -this.IMAGE_OFFSETS.x,
            y: -this.IMAGE_OFFSETS.y
        })
        this.add(this.image);
        this.resetBoundingBox();
        this.destroyed = false;
    }

    getInitialSpeed(begin, end) {
        const s = Math.sqrt((begin.subtile_x - end.subtile_x)**2 + (begin.subtile_y - end.subtile_y)**2);
        const g = ParabolicProjectile.prototype.GRAVITY;
        const h = this.initialHeight;

        return Math.sqrt((s**2 * g) / (2 * (h + s))) * Math.sqrt(2);
    }
    move(md) {
        this.position3d.x += this.delta3d.x;
        this.position3d.y += this.delta3d.y;
        this.position3d.z += this.delta3d.z;

        let pos = md.tileCoordsToScreen(this.position3d.x / 2, this.position3d.y / 2);

        if (this.shadow) this.shadow.position({ x: pos.x, y: pos.y });

        pos.y -= this.position3d.z * 16;
        this.position(pos);

        if (this.position3d.z < 0) {
            this.TTL = 2;
        }

        this.delta3d.z -= ParabolicProjectile.prototype.GRAVITY;
    }
    hasReachedVictim(target_pos) {
        return false;
    }
    hasReachedSubitle() {
        if (this.position3d.z < 0) {
            return distance(this.realPosition, this.target) < 8;
        } else return false;
    }
}
ParabolicProjectile.prototype.GRAVITY = 1 / (FPS * 10);


class StoneTrace extends Graphics.Node {
    constructor(subtile_x, subtile_y) {
        super();
        this.subtile_x = subtile_x;
        this.subtile_y = subtile_y;
        this.isFloating = true;
        this.age = 0;
        this.imgIdx = Math.floor(Math.random() * 4);
        this.setImage();
    }
    setImage() {
        this.image = new Graphics.Image({
            x: -this.getOffset().x,
            y: -this.getOffset().y,
            image: this.getSprite(),
        });
        this.add(this.image);
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
    getSprite() {
        return this.IMAGES[this.imgIdx];
    }
    getOffset() {
        return this.IMAGE_OFFSETS;
    }
    process(engine) {
        if (++this.age % 7 == 0) {
            if (++this.imgIdx >= this.IMAGES.length) this.destroy(engine);
            else this.image.image(this.IMAGES[this.imgIdx]);
        }
    }
    destroy() {
        this.destroyed = true;
        this.remove();
    }
}
StoneTrace.prototype.SUBTILE_WIDTH = 0;
StoneTrace.prototype.IMAGES = Sprites.SpriteSequence("img/projectiles/smoke_trace/", 8);
StoneTrace.prototype.IMAGE_OFFSETS = { x: 30, y: 10 }


class StoneShadow extends Graphics.Node {
    constructor(subtile_x, subtile_y) {
        super();
        this.subtile_x = subtile_x;
        this.subtile_y = subtile_y;
        this.isFlat = true;
        this.setImage();
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
    setImage() {
        this.image = new Graphics.Image({
            x: -this.getOffset().x,
            y: -this.getOffset().y,
            image: this.getSprite(),
        });
        this.add(this.image);
    }
    getBoundingBox() {
        return this.boundingBox;
    }
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() -this.IMAGE_OFFSETS.x,
            y: this.y() -this.IMAGE_OFFSETS.y,
            w: this.IMAGE.width,
            h: this.IMAGE.height
        }
    }
    getSprite() {
        return this.IMAGE;
    }
    getOffset() {
        return this.IMAGE_OFFSETS;
    }
    destroy() {
        this.destroyed = true;
        this.remove();
    }
}
StoneShadow.prototype.SUBTILE_WIDTH = 0;
StoneShadow.prototype.IMAGE = Sprites.Sprite("img/projectiles/stone_shadow.png");
StoneShadow.prototype.IMAGE_OFFSETS = { x: 5, y: 5 }



class Stone extends ParabolicProjectile {
    constructor(thrower, victim, position, target, subtile_x, subtile_y) {
        super(thrower, victim, position, target, subtile_x, subtile_y);
        this.attributes = {
            attack: thrower.attributes.attack
        };
        this.image.image(this.IMAGES[0]);
        this.TTL = 350;
    }
    makeShadow() {
        return new StoneShadow(this.subtile_x, this.subtile_y);
    }
    draw() {
        this.image.image(this.IMAGES[Math.floor(this.TTL / 5) % this.IMAGES.length]);
        super.draw();
    }
}
Stone.prototype.SPEED = 5 / FPS;
Stone.prototype.RADIUS = 6;
Stone.prototype.IMAGES = Sprites.SpriteSequence("img/projectiles/stone/", 3);
Stone.prototype.IMAGE_OFFSETS = { x: 5, y: 5 };
Stone.prototype.TRACE = StoneTrace;


export {
    Spear, Arrow, Stone
}
