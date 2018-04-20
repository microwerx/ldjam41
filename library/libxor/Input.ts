// LibXOR Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
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
    wasdFormat: boolean = true;

    lastClick: Vector3 = Vector3.make(0, 0, 0);

    gamepadStick1: Vector3 = Vector3.make(0, 0, 0);
    gamepadStick2: Vector3 = Vector3.make(0, 0, 0);
    gamepadDpad: Vector3 = Vector3.make(0, 0, 0);
    gamepadButtons: number[] = [0, 0, 0, 0];
    gamepadLB: number = 0;
    gamepadRB: number = 0;
    gamepadLT: number = 0;
    gamepadRT: number = 0;
    gamepadStart: number = 0;
    gamepadSelect: number = 0;
    gamepadIndex: number = -1;

    constructor() {
        this.buttons = 0;
        let self = this;
        window.addEventListener("keydown", (e) => {
            self.onkeychange(e, true);
        });
        window.addEventListener("keyup", (e) => {
            self.onkeychange(e, false);
        });

        let e = document.getElementById("graphicscanvas");
        if (e) {
            e.addEventListener("mousedown", (e) => {
                self.onmousedown(e, this.lastClick);
            });
            e.addEventListener("mouseup", (e) => {
                self.onmouseup(e, this.lastClick);
            });
        }

        window.addEventListener("gamepadconnected", (e) => {
            let gp = (<GamepadEvent>e).gamepad;
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                gp.index, gp.id,
                gp.buttons.length, gp.axes.length);
            self.gamepadIndex = 0;//gp.index;            
        });
        window.addEventListener("gamepaddisconnected", (e) => {
            let gp = (<GamepadEvent>e).gamepad;
            console.log("Gamepad disconnected at index %d: %s.",
                gp.index, gp.id);
            self.gamepadIndex = -1;
        });
    }

    update() {
        let gamepads = navigator.getGamepads();
        let gp = null;
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                gp = gamepads[i];
                break;
            }
        }
        if (gp) {
            if (gp.axes.length >= 4) {
                this.gamepadStick1.x = Math.abs(gp.axes[0]) > 0.1 ? gp.axes[0] : 0;
                this.gamepadStick1.y = Math.abs(gp.axes[1]) > 0.1 ? gp.axes[1] : 0;
                this.gamepadStick2.x = Math.abs(gp.axes[2]) > 0.1 ? gp.axes[2] : 0;
                this.gamepadStick2.y = Math.abs(gp.axes[3]) > 0.1 ? gp.axes[3] : 0;

            }
            if (gp.buttons.length >= 10) {
                this.gamepadButtons[0] = gp.buttons[0].value;
                this.gamepadButtons[1] = gp.buttons[1].value;
                this.gamepadButtons[2] = gp.buttons[2].value;
                this.gamepadButtons[3] = gp.buttons[3].value;
                this.gamepadLB = gp.buttons[4].value;
                this.gamepadRB = gp.buttons[5].value;
                this.gamepadLT = gp.buttons[6].value;
                this.gamepadRT = gp.buttons[7].value;
                this.gamepadSelect = gp.buttons[8].value;
                this.gamepadStart = gp.buttons[9].value;
            }
            let gpinfo = document.getElementById("gamepaddebug");
            if (gpinfo) {
                gpinfo.innerText = "gamepad connected";
                gpinfo.className = "mycontrols";
            }
        }
    }

    onmousedown(e: MouseEvent, v: Vector3) {
        e.preventDefault();
        v.x = e.offsetX;
        v.y = e.offsetY;
    }

    onmouseup(e: MouseEvent, v: Vector3) {
        e.preventDefault();
        v.x = e.offsetX;
        v.y = e.offsetY;
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
                this.setkey(KEY_LEFT, state);
                break;
            case 'ArrowRight':
            case 'Right':
                this.setkey(KEY_RIGHT, state);
                break;
            case 'ArrowUp':
            case 'Up':
                this.setkey(KEY_UP, state);
                break;
            case 'ArrowDown':
            case 'Down':
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
        // allow for european keyboards
        // ZQSD
        if (this.wasdFormat) {
            // WASD
            switch (e.key) {
                case 'a':
                case 'A':
                    this.setkey(KEY_LEFT, state);
                    break;
                case 'd':
                case 'D':
                    this.setkey(KEY_RIGHT, state);
                    break;
                case 'w':
                case 'W':
                    this.setkey(KEY_UP, state);
                    break;
                case 's':
                case 'S':
                    this.setkey(KEY_DOWN, state);
                    break;
            }
        }
        else {
            // ZQSD
            switch (e.key) {
                case 'q':
                case 'Q':
                    this.setkey(KEY_LEFT, state);
                    break;
                case 'd':
                case 'D':
                    this.setkey(KEY_RIGHT, state);
                    break;
                case 'z':
                case 'Z':
                    this.setkey(KEY_UP, state);
                    break;
                case 's':
                case 'S':
                    this.setkey(KEY_DOWN, state);
                    break;
            }
        }

        if (this.buttons != oldbuttons)
            e.preventDefault();
    }
}
