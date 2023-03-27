export class KeyStatus {
    public pressed: boolean;
    public heldFor: number;

    constructor(pressed = false, heldFor = 0) {
        this.pressed = pressed;
        this.heldFor = heldFor;
    }
}
