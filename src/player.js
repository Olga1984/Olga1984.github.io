export default function Player() {
    this.srcX = 0;
    this.srcY = 400;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 130;
    this.height = 116;

    this.speed = 8;

    this.ticks = 0;
    this.spriteIndex = 0;
    this.sprites = [this.srcX, this.srcX + 130, this.srcX + 260, this.srcX + 390, this.srcX + 520, this.srcX + 650, this.srcX + 780, this.srcX + 910, this.srcX + 1040, this.srcX + 1040, this.srcX + 910, this.srcX + 780, this.srcX + 650, this.srcX + 520, this.srcX + 390, this.srcX + 260, this.srcX + 130, this.srcX];
}
