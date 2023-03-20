export default class Square {
    constructor (properties, context) {
        this.id = properties.id;
        this.width = properties.width;
        this.position = properties.position;
        this.mass = properties.mass;
        this.color = properties.color;
        this.constraint = properties.constraint;
        this.context = context;
        this.velocity = 0;
    }

    draw () {
        // Color and draw the square
        this.context.fillStyle = this.color;
        let left = this.position.x > this.constraint ? this.position.x : this.constraint
        this.context.fillRect(left, this.position.y, this.width, this.width);

        // Draw the mass over the square
        this.context.fillStyle = "white";
        this.context.font = 'bold 18px Arial';
        let text = `${this.mass.toLocaleString()} kg`
        this.context.fillText(text, left + (this.width / 2) - (text.length / 2) * 9, this.position.y - 15);
    }

    update () {
        this.position.x += this.velocity
        this.updateSides();
    }

    updateSides () {
        this.left = this.position.x;
        this.right = this.position.x + this.width;
    }

    collidesWith (other) {
        return (this.right >= other.left && this.left <= other.right);
    }

    resolveCollisionWith (other) {
        let sumMasses = this.mass + other.mass;

        let finalVelocity1 = (((this.mass - other.mass) / sumMasses) * this.velocity) +
                        (((2 * other.mass) / sumMasses) * other.velocity);

        let finalVelocity2 = (((2 * this.mass) / sumMasses) * this.velocity) +
                        (((other.mass - this.mass) / sumMasses) * other.velocity);

        this.velocity = finalVelocity1;
        other.velocity = finalVelocity2;
    }
}