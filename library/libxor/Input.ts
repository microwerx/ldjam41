const KEY_BUTTON0 = 0;
const KEY_BUTTON1 = 1;
const KEY_BUTTON2 = 2;
const KEY_BUTTON3 = 3;
const KEY_BACK = 8;
const KEY_FORWARD = 9;
const KEY_SELECT = 8;
const KEY_START = 9;
const KEY_LEFT = 14;
const KEY_RIGHT = 15;
const KEY_UP = 12;
const KEY_DOWN = 13;

class InputComponent {
    buttons: number;
    constructor() {
        this.buttons = 0;
        let self = this;
        window.addEventListener("keydown", (e) => {
            self.onkeychange(e, true);
        });
        window.addEventListener("keyup", (e) => {
            self.onkeychange(e, false);
        });
    }

    setkey(which: number, state: boolean) {
        if (which < 0 || which >= 32)
            return;
        let mask = 1 << which;
        if (state) {
            this.buttons |= mask;
        } else {
            this.buttons &= ~mask;
        }
    }

    getkey(which: number) {
        if (which < 0 || which >= 32)
            return false;
        let mask = 1 << which;
        if (this.buttons & mask)
            return true;
        return false;
    }

    onkeychange(e: KeyboardEvent, state: boolean) {
        let oldbuttons = this.buttons;
        switch (e.key) {
            case 'ArrowLeft':
            case 'Left':
            case 'a':
            case 'A':
                this.setkey(KEY_LEFT, state);
                break;
            case 'ArrowRight':
            case 'Right':
            case 'd':
            case 'D':
                this.setkey(KEY_RIGHT, state);
                break;
            case 'ArrowUp':
            case 'Up':
            case 'w':
            case 'W':
                this.setkey(KEY_UP, state);
                break;
            case 'ArrowDown':
            case 'Down':
            case 's':
            case 'S':
                this.setkey(KEY_DOWN, state);
                break;
            case 'Enter':
            case 'Return':
                this.setkey(KEY_START, state);
                break;
            case 'Esc':
            case 'Escape':
                this.setkey(KEY_BACK, state);
                break;
        }
        if (this.buttons != oldbuttons)
            e.preventDefault();
    }
}
