"use strict";
class Hatchetfish {
    constructor(logElementId = "") {
        this._logElementId = "";
        this._logElement = null;
        this._numLines = 0;
        this.logElement = logElementId;
    }
    set logElement(id) {
        let el = document.getElementById(id);
        if (el instanceof HTMLDivElement) {
            this._logElement = el;
            this._logElementId = id;
        }
    }
    clear() {
        this._numLines = 0;
        if (this._logElement) {
            this._logElement.innerHTML = "";
        }
        let errorElement = document.getElementById("errors");
        if (errorElement) {
            errorElement.remove();
            //errorElement.innerHTML = "";
        }
    }
    writeToLog(prefix, message, ...optionalParams) {
        let text = prefix + ": " + message;
        for (let op of optionalParams) {
            if (op.toString) {
                text += " " + op.toString();
            }
            else {
                text += " <unknown>";
            }
        }
        if (this._logElement) {
            let newHTML = "<br/>" + text + this._logElement.innerHTML;
            this._logElement.innerHTML = newHTML;
            //this._logElement.appendChild(document.createElement("br"));
            //this._logElement.appendChild(document.createTextNode(text));
        }
    }
    log(message, ...optionalParams) {
        this.writeToLog("[LOG]", message, ...optionalParams);
        console.log(message, ...optionalParams);
    }
    info(message, ...optionalParams) {
        this.writeToLog("[INF]", message, ...optionalParams);
        console.info(message, ...optionalParams);
    }
    error(message, ...optionalParams) {
        this.writeToLog("[ERR]", message, ...optionalParams);
        console.error(message, ...optionalParams);
    }
    warn(message, ...optionalParams) {
        this.writeToLog("[WRN]", message, ...optionalParams);
        console.warn(message, optionalParams);
    }
    debug(message, ...optionalParams) {
        console.log(message, ...optionalParams);
    }
}
var hflog = new Hatchetfish();
// Fluxions Geometry Transformation Engine WebGL Library
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
/// <reference path="./GTE.ts" />
class Vector2 {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    reset(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    mul(multiplicand) {
        return new Vector2(this.x * multiplicand, this.y * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector2();
        return new Vector2(this.x / divisor, this.y / divisor);
    }
    neg() {
        return new Vector2(-this.x, -this.y);
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y]);
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector3() {
        return new Vector3(this.x, this.y, 0.0);
    }
    toVector4() {
        return new Vector4(this.x, this.y, 0.0, 0.0);
    }
    project() {
        return this.x / this.y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector2();
        else
            len = Math.sqrt(len);
        return new Vector2(this.x / len, this.y / len);
    }
    static make(x, y) {
        return new Vector2(x, y);
    }
    static makeUnit(x, y) {
        let lengthSquared = x * x + y * y;
        if (lengthSquared == 0.0)
            return new Vector2(0, 0);
        let length = Math.sqrt(lengthSquared);
        return new Vector2(x / length, y / length);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    static normalize(v) {
        let len = v.length();
        if (len == 0.0) {
            v.reset(0.0, 0.0);
        }
        else {
            v.x /= len;
            v.y /= len;
        }
        return v;
    }
}
// Fluxions Geometry Transformation Engine WebGL Library
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
/// <reference path="./GTE.ts" />
class Vector3 {
    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    reset(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    static makeFromSpherical(theta, phi) {
        return new Vector3(Math.cos(phi) * Math.cos(theta), Math.sin(phi), -Math.cos(phi) * Math.sin(theta));
    }
    // Converts (rho, theta, phi) so that rho is distance from origin,
    // theta is inclination away from positive y-axis, and phi is azimuth
    // from positive z-axis towards the positive x-axis.
    static makeFromSphericalISO(rho, thetaInRadians, phiInRadians) {
        return new Vector3(rho * Math.sin(thetaInRadians) * Math.cos(phiInRadians), rho * Math.cos(thetaInRadians), rho * Math.sin(thetaInRadians) * Math.sin(phiInRadians));
    }
    // Converts (rho, theta, phi) so that rho is distance from origin,
    // phi is inclination away from positive y-axis, and theta is azimuth
    // from positive z-axis towards the positive x-axis.
    static makeFromSphericalMath(rho, thetaInRadians, phiInRadians) {
        return new Vector3(rho * Math.sin(phiInRadians) * Math.sin(thetaInRadians), rho * Math.cos(phiInRadians), rho * Math.sin(phiInRadians) * Math.cos(thetaInRadians));
    }
    // theta represents angle from +x axis on xz plane going counterclockwise
    // phi represents angle from xz plane going towards +y axis
    setFromSpherical(theta, phi) {
        this.x = Math.cos(theta) * Math.cos(phi);
        this.y = Math.sin(phi);
        this.z = -Math.sin(theta) * Math.cos(phi);
        return this;
    }
    get theta() {
        return Math.atan2(this.x, -this.z) + ((this.z <= 0.0) ? 0.0 : 2.0 * Math.PI);
    }
    get phi() {
        return Math.asin(this.y);
    }
    static make(x, y, z) {
        return new Vector3(x, y, z);
    }
    static makeUnit(x, y, z) {
        return (new Vector3(x, y, z)).norm();
    }
    static distance(a, b) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(multiplicand) {
        return new Vector3(this.x * multiplicand, this.y * multiplicand, this.z * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector3();
        return new Vector3(this.x / divisor, this.y / divisor, this.z / divisor);
    }
    neg() {
        return new Vector3(-this.x, -this.y, -this.z);
    }
    // multiplicative inverse (1/x)
    reciprocal() {
        return new Vector3(1.0 / this.x, 1.0 / this.y, 1.0 / this.z);
    }
    pow(power) {
        return new Vector3(Math.pow(this.x, power), Math.pow(this.y, power), Math.pow(this.z, power));
    }
    compdiv(divisor) {
        return new Vector3(this.x / divisor.x, this.y / divisor.y, this.z / divisor.z);
    }
    compmul(multiplicand) {
        return new Vector3(this.x * multiplicand.x, this.y * multiplicand.y, this.z * multiplicand.z);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y, this.z]);
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector4(w) {
        return new Vector4(this.x, this.y, this.z, w);
    }
    project() {
        return new Vector2(this.x / this.z, this.y / this.z);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector3();
        else
            len = Math.sqrt(len);
        return new Vector3(this.x / len, this.y / len, this.z / len);
    }
    normalize() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector3();
        else
            len = Math.sqrt(len);
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }
    distance(v) {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        let dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    get(index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
        }
        return 0.0;
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    static cross(a, b) {
        return new Vector3(a.y * b.z - b.y * a.z, a.z * b.x - b.z * a.x, a.x * b.y - b.x * a.y);
    }
    static add(a, b) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    static sub(a, b) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static mul(a, b) {
        return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
    }
    static div(a, b) {
        return new Vector3(a.x / b.x, a.y / b.y, a.z / b.z);
    }
}
// Fluxions Geometry Transformation Engine WebGL Library
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
/// <reference path="./GTE.ts" />
class Vector4 {
    constructor(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
    clone() {
        return new Vector4(this.x, this.y, this.z, this.w);
    }
    reset(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    add(v) {
        return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    }
    sub(v) {
        return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    }
    mul(multiplicand) {
        return new Vector4(this.x * multiplicand, this.y * multiplicand, this.z * multiplicand, this.w * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector4();
        return new Vector4(this.x / divisor, this.y / divisor, this.z / divisor, this.w / divisor);
    }
    neg() {
        return new Vector4(-this.x, -this.y, -this.z, -this.w);
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y, this.z, this.w]);
    }
    toArray() {
        return [this.x, this.y, this.z, this.w];
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector3() {
        return new Vector3(this.x, this.y, this.z);
    }
    project() {
        return new Vector3(this.x / this.w, this.y / this.w, this.z / this.w);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector4();
        else
            len = Math.sqrt(len);
        return new Vector4(this.x / len, this.y / len, this.z / len, this.w / len);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    }
    static normalize(v) {
        let len = v.length();
        if (len == 0.0) {
            v.reset(0.0, 0.0, 0.0, 0.0);
        }
        else {
            v.x /= len;
            v.y /= len;
            v.z /= len;
            v.w /= len;
        }
        return v;
    }
    static make(x, y, z, w) {
        return new Vector4(x, y, z, w);
    }
    static makeUnit(x, y, z, w) {
        return (new Vector4(x, y, z, w)).norm();
    }
}
// Fluxions Geometry Transformation Engine WebGL Library
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
/// <reference path="./GTE.ts" />
class Matrix2 {
    constructor(m11, m21, m12, m22) {
        this.m11 = m11;
        this.m21 = m21;
        this.m12 = m12;
        this.m22 = m22;
    }
    static makeIdentity() {
        return new Matrix2(1, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix2(0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m12, m22) {
        return new Matrix2(m11, m21, m12, m22);
    }
    static makeRowMajor(m11, m12, m21, m22) {
        return new Matrix2(m11, m21, m12, m22);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 4)
            return new Matrix2(v[0], v[2], v[1], v[3]);
        return new Matrix2(0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 4)
            return new Matrix2(v[0], v[1], v[2], v[3]);
        return new Matrix2(0, 0, 0, 0);
    }
    static makeScale(x, y) {
        return Matrix2.makeRowMajor(x, 0, 0, y);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        return Matrix2.makeRowMajor(c, -s, s, c);
    }
    asColMajorArray() {
        return [
            this.m11, this.m21,
            this.m12, this.m22
        ];
    }
    asRowMajorArray() {
        return [
            this.m11, this.m12,
            this.m21, this.m22
        ];
    }
    static multiply(m1, m2) {
        return new Matrix2(m1.m11 * m2.m11 + m1.m21 * m2.m12, m1.m11 * m2.m21 + m1.m21 * m2.m22, m1.m12 * m2.m11 + m1.m22 * m2.m12, m1.m12 * m2.m21 + m1.m22 * m2.m22);
    }
    copy(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m12 = m.m12;
        this.m22 = m.m22;
        return this;
    }
    concat(m) {
        this.copy(Matrix2.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector2(this.m11 * v.x + this.m12 * v.y, this.m21 * v.x + this.m22 * v.y);
    }
    asInverse() {
        var tmpD = 1.0 / (this.m11 * this.m22 - this.m12 * this.m21);
        return Matrix2.makeRowMajor(this.m22 * tmpD, -this.m12 * tmpD, -this.m21 * tmpD, this.m11 * tmpD);
    }
    asTranspose() {
        return Matrix2.makeRowMajor(this.m11, this.m21, this.m12, this.m22);
    }
} // class Matrix2
// Fluxions Geometry Transformation Engine WebGL Library
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
/// <reference path="./GTE.ts"/>
class Matrix3 {
    constructor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        this.m11 = m11;
        this.m21 = m21;
        this.m31 = m31;
        this.m12 = m12;
        this.m22 = m22;
        this.m32 = m32;
        this.m13 = m13;
        this.m23 = m23;
        this.m33 = m33;
    }
    static makeIdentity() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        return new Matrix3(m11, m21, m31, m12, m22, m32, m13, m23, m33);
    }
    static makeRowMajor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return new Matrix3(m11, m21, m31, m12, m22, m32, m13, m23, m33);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 9)
            return new Matrix3(v[0], v[3], v[6], v[1], v[4], v[7], v[2], v[5], v[8]);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 9)
            return new Matrix3(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8]);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeScale(x, y, z) {
        return Matrix3.makeRowMajor(x, 0, 0, 0, y, 0, 0, 0, z);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
        x *= invLength;
        y *= invLength;
        z *= invLength;
        return Matrix3.makeRowMajor(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c);
    }
    static makeCubeFaceMatrix(face) {
        // +X
        if (face == 0)
            return Matrix3.makeRotation(90.0, 0.0, 1.0, 0.0);
        // -X
        if (face == 1)
            return Matrix3.makeRotation(270.0, 0.0, 1.0, 0.0);
        // +Y
        if (face == 2)
            return Matrix3.makeRotation(90.0, 1.0, 0.0, 0.0);
        // -Y
        if (face == 3)
            return Matrix3.makeRotation(270.0, 1.0, 0.0, 0.0);
        // +Z
        if (face == 4)
            return Matrix3.makeIdentity();
        // -Z
        if (face == 5)
            return Matrix3.makeRotation(180.0, 0.0, 1.0, 0.0);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    asColMajorArray() {
        return [
            this.m11, this.m21, this.m31,
            this.m12, this.m22, this.m32,
            this.m13, this.m23, this.m33
        ];
    }
    asRowMajorArray() {
        return [
            this.m11, this.m12, this.m13,
            this.m21, this.m22, this.m23,
            this.m31, this.m32, this.m33
        ];
    }
    static multiply(m1, m2) {
        return new Matrix3(m1.m11 * m2.m11 + m1.m21 * m2.m12 + m1.m31 * m2.m13, m1.m11 * m2.m21 + m1.m21 * m2.m22 + m1.m31 * m2.m23, m1.m11 * m2.m31 + m1.m21 * m2.m32 + m1.m31 * m2.m33, m1.m12 * m2.m11 + m1.m22 * m2.m12 + m1.m32 * m2.m13, m1.m12 * m2.m21 + m1.m22 * m2.m22 + m1.m32 * m2.m23, m1.m12 * m2.m31 + m1.m22 * m2.m32 + m1.m32 * m2.m33, m1.m13 * m2.m11 + m1.m23 * m2.m12 + m1.m33 * m2.m13, m1.m13 * m2.m21 + m1.m23 * m2.m22 + m1.m33 * m2.m23, m1.m13 * m2.m31 + m1.m23 * m2.m32 + m1.m33 * m2.m33);
    }
    LoadIdentity() {
        return this.copy(Matrix3.makeIdentity());
    }
    MultMatrix(m) {
        return this.copy(Matrix3.multiply(this, m));
    }
    LoadColMajor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        return this;
    }
    LoadRowMajor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        return this;
    }
    toMatrix4() {
        return Matrix4.makeRowMajor(this.m11, this.m12, this.m13, 0.0, this.m21, this.m22, this.m23, 0.0, this.m31, this.m32, this.m33, 0.0, 0.0, 0.0, 0.0, 1.0);
    }
    copy(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m31 = m.m31;
        this.m12 = m.m12;
        this.m22 = m.m22;
        this.m32 = m.m32;
        this.m13 = m.m13;
        this.m23 = m.m23;
        this.m33 = m.m33;
        return this;
    }
    clone() {
        return Matrix3.makeRowMajor(this.m11, this.m12, this.m13, this.m21, this.m22, this.m23, this.m31, this.m32, this.m33);
    }
    concat(m) {
        this.copy(Matrix3.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector3(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z);
    }
    asInverse() {
        var tmpA = this.m22 * this.m33 - this.m23 * this.m32;
        var tmpB = this.m21 * this.m32 - this.m22 * this.m31;
        var tmpC = this.m23 * this.m31 - this.m21 * this.m33;
        var tmpD = 1.0 / (this.m11 * tmpA + this.m12 * tmpC + this.m13 * tmpB);
        return new Matrix3(tmpA * tmpD, (this.m13 * this.m32 - this.m12 * this.m33) * tmpD, (this.m12 * this.m23 - this.m13 * this.m22) * tmpD, tmpC * tmpD, (this.m11 * this.m33 - this.m13 * this.m31) * tmpD, (this.m13 * this.m21 - this.m11 * this.m23) * tmpD, tmpB * tmpD, (this.m12 * this.m31 - this.m11 * this.m32) * tmpD, (this.m11 * this.m22 - this.m12 * this.m21) * tmpD);
    }
    asTranspose() {
        return new Matrix3(this.m11, this.m12, this.m13, this.m21, this.m22, this.m23, this.m31, this.m32, this.m33);
    }
} // class Matrix3
// Fluxions Geometry Transformation Engine WebGL Library
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
///<reference path="./GTE.ts"/>
class Matrix4 {
    constructor(m11 = 1, m21 = 0, m31 = 0, m41 = 0, m12 = 0, m22 = 1, m32 = 0, m42 = 0, m13 = 0, m23 = 0, m33 = 0, m43 = 0, m14 = 0, m24 = 0, m34 = 1, m44 = 1) {
        this.m11 = m11;
        this.m21 = m21;
        this.m31 = m31;
        this.m41 = m41;
        this.m12 = m12;
        this.m22 = m22;
        this.m32 = m32;
        this.m42 = m42;
        this.m13 = m13;
        this.m23 = m23;
        this.m33 = m33;
        this.m43 = m43;
        this.m14 = m14;
        this.m24 = m24;
        this.m34 = m34;
        this.m44 = m44;
    }
    copy(m) {
        return this.LoadMatrix(m);
    }
    clone() {
        return new Matrix4(this.m11, this.m21, this.m31, this.m41, this.m12, this.m22, this.m32, this.m42, this.m13, this.m23, this.m33, this.m43, this.m14, this.m24, this.m34, this.m44);
    }
    row(i) {
        switch (i) {
            case 0: return new Vector4(this.m11, this.m12, this.m13, this.m14);
            case 1: return new Vector4(this.m21, this.m22, this.m23, this.m24);
            case 2: return new Vector4(this.m31, this.m32, this.m33, this.m34);
            case 3: return new Vector4(this.m41, this.m42, this.m43, this.m44);
        }
        return new Vector4(0, 0, 0, 0);
    }
    col(i) {
        switch (i) {
            case 0: return new Vector4(this.m11, this.m21, this.m31, this.m41);
            case 1: return new Vector4(this.m12, this.m22, this.m32, this.m42);
            case 2: return new Vector4(this.m13, this.m23, this.m33, this.m43);
            case 3: return new Vector4(this.m14, this.m24, this.m34, this.m44);
        }
        return new Vector4(0, 0, 0, 0);
    }
    row3(i) {
        switch (i) {
            case 0: return new Vector3(this.m11, this.m12, this.m13);
            case 1: return new Vector3(this.m21, this.m22, this.m23);
            case 2: return new Vector3(this.m31, this.m32, this.m33);
            case 3: return new Vector3(this.m41, this.m42, this.m43);
        }
        return new Vector3(0, 0, 0);
    }
    col3(i) {
        switch (i) {
            case 0: return new Vector3(this.m11, this.m21, this.m31);
            case 1: return new Vector3(this.m12, this.m22, this.m32);
            case 2: return new Vector3(this.m13, this.m23, this.m33);
            case 3: return new Vector3(this.m14, this.m24, this.m34);
        }
        return new Vector3(0, 0, 0);
    }
    diag3() {
        return new Vector3(this.m11, this.m22, this.m33);
    }
    LoadRowMajor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m24 = m24;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.m34 = m34;
        this.m41 = m41;
        this.m42 = m42;
        this.m43 = m43;
        this.m44 = m44;
        return this;
    }
    LoadColMajor(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m24 = m24;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.m34 = m34;
        this.m41 = m41;
        this.m42 = m42;
        this.m43 = m43;
        this.m44 = m44;
        return this;
    }
    LoadIdentity() {
        return this.LoadMatrix(Matrix4.makeIdentity());
    }
    Translate(x, y, z) {
        return this.MultMatrix(Matrix4.makeTranslation(x, y, z));
    }
    Rotate(angleInDegrees, x, y, z) {
        return this.MultMatrix(Matrix4.makeRotation(angleInDegrees, x, y, z));
    }
    Scale(sx, sy, sz) {
        return this.MultMatrix(Matrix4.makeScale(sx, sy, sz));
    }
    LookAt(eye, center, up) {
        return this.MultMatrix(Matrix4.makeLookAt2(eye, center, up));
    }
    Frustum(left, right, bottom, top, near, far) {
        return this.MultMatrix(Matrix4.makeFrustum(left, right, bottom, top, near, far));
    }
    Ortho(left, right, bottom, top, near, far) {
        return this.MultMatrix(Matrix4.makeOrtho(left, right, bottom, top, near, far));
    }
    Ortho2D(left, right, bottom, top) {
        return this.MultMatrix(Matrix4.makeOrtho2D(left, right, bottom, top));
    }
    PerspectiveX(fovx, aspect, near, far) {
        return this.MultMatrix(Matrix4.makePerspectiveX(fovx, aspect, near, far));
    }
    PerspectiveY(fovy, aspect, near, far) {
        return this.MultMatrix(Matrix4.makePerspectiveY(fovy, aspect, near, far));
    }
    ShadowBias() {
        return this.MultMatrix(Matrix4.makeShadowBias());
    }
    CubeFaceMatrix(face) {
        return this.MultMatrix(Matrix4.makeCubeFaceMatrix(face));
    }
    static makeIdentity() {
        return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) {
        return new Matrix4(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44);
    }
    static makeRowMajor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return new Matrix4(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 16)
            return new Matrix4(v[0], v[4], v[8], v[12], v[1], v[5], v[9], v[13], v[2], v[6], v[10], v[14], v[3], v[7], v[11], v[15]);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 16)
            return new Matrix4(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8], v[9], v[10], v[11], v[12], v[13], v[14], v[15]);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeTranslation(x, y, z) {
        return Matrix4.makeRowMajor(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
    }
    static makeScale(x, y, z) {
        return Matrix4.makeRowMajor(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
        x *= invLength;
        y *= invLength;
        z *= invLength;
        return Matrix4.makeRowMajor(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, 0.0, y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, 0.0, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c, 0.0, 0.0, 0.0, 0.0, 1.0);
    }
    static makeOrtho(left, right, bottom, top, near, far) {
        var tx = -(right + left) / (right - left);
        var ty = -(top + bottom) / (top - bottom);
        var tz = -(far + near) / (far - near);
        return Matrix4.makeRowMajor(2 / (right - left), 0, 0, tx, 0, 2 / (top - bottom), 0, ty, 0, 0, -2 / (far - near), tz, 0, 0, 0, 1);
    }
    static makeOrtho2D(left, right, bottom, top) {
        return Matrix4.makeOrtho(left, right, bottom, top, -1, 1);
    }
    static makeFrustum(left, right, bottom, top, near, far) {
        var A = (right + left) / (right - left);
        var B = (top + bottom) / (top - bottom);
        var C = -(far + near) / (far - near);
        var D = -2 * far * near / (far - near);
        return Matrix4.makeRowMajor(2 * near / (right - left), 0, A, 0, 0, 2 * near / (top - bottom), B, 0, 0, 0, C, D, 0, 0, -1, 0);
    }
    static makePerspectiveY(fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(Math.PI * fovy / 360.0);
        return Matrix4.makeRowMajor(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), 2 * far * near / (near - far), 0, 0, -1, 0);
    }
    static makePerspectiveX(fovx, aspect, near, far) {
        var f = 1.0 / Math.tan(Math.PI * fovx / 360.0);
        return Matrix4.makeRowMajor(f, 0, 0, 0, 0, f * aspect, 0, 0, 0, 0, (far + near) / (near - far), 2 * far * near / (near - far), 0, 0, -1, 0);
    }
    static makeLookAt(eye, center, up) {
        let F = Vector3.sub(center, eye).norm();
        let UP = up.norm();
        let S = (Vector3.cross(F, UP)).norm();
        let U = (Vector3.cross(S, F)).norm();
        return Matrix4.multiply(Matrix4.makeRowMajor(S.x, S.y, S.z, 0, U.x, U.y, U.z, 0, -F.x, -F.y, -F.z, 0, 0, 0, 0, 1), Matrix4.makeTranslation(-eye.x, -eye.y, -eye.z));
    }
    static makeLookAt2(eye, center, up) {
        let F = Vector3.sub(center, eye).norm();
        let UP = up.norm();
        let S = (Vector3.cross(F, UP)).norm();
        let U = (Vector3.cross(S, F)).norm();
        return Matrix4.multiply(Matrix4.makeTranslation(-eye.x, -eye.y, -eye.z), Matrix4.makeRowMajor(S.x, S.y, S.z, 0, U.x, U.y, U.z, 0, -F.x, -F.y, -F.z, 0, 0, 0, 0, 1));
    }
    static makeShadowBias() {
        return Matrix4.makeRowMajor(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
    }
    static makeCubeFaceMatrix(face) {
        // +X
        if (face == 0)
            return Matrix4.makeRotation(90.0, 0.0, 1.0, 0.0);
        // -X
        if (face == 1)
            return Matrix4.makeRotation(270.0, 0.0, 1.0, 0.0);
        // +Y
        if (face == 2)
            return Matrix4.makeRotation(90.0, 1.0, 0.0, 0.0);
        // -Y
        if (face == 3)
            return Matrix4.makeRotation(270.0, 1.0, 0.0, 0.0);
        // +Z
        if (face == 4)
            return Matrix4.makeIdentity();
        // -Z
        if (face == 5)
            return Matrix4.makeRotation(180.0, 0.0, 1.0, 0.0);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    toColMajorArray() {
        return [
            this.m11, this.m21, this.m31, this.m41,
            this.m12, this.m22, this.m32, this.m42,
            this.m13, this.m23, this.m33, this.m43,
            this.m14, this.m24, this.m34, this.m44
        ];
    }
    toRowMajorArray() {
        return [
            this.m11, this.m12, this.m13, this.m14,
            this.m21, this.m22, this.m23, this.m24,
            this.m31, this.m32, this.m33, this.m34,
            this.m41, this.m42, this.m43, this.m44
        ];
    }
    static multiply3(a, b, c) {
        return Matrix4.multiply(a, Matrix4.multiply(b, c));
    }
    static multiply(m1, m2) {
        return new Matrix4(m2.m11 * m1.m11 + m2.m21 * m1.m12 + m2.m31 * m1.m13 + m2.m41 * m1.m14, m2.m11 * m1.m21 + m2.m21 * m1.m22 + m2.m31 * m1.m23 + m2.m41 * m1.m24, m2.m11 * m1.m31 + m2.m21 * m1.m32 + m2.m31 * m1.m33 + m2.m41 * m1.m34, m2.m11 * m1.m41 + m2.m21 * m1.m42 + m2.m31 * m1.m43 + m2.m41 * m1.m44, m2.m12 * m1.m11 + m2.m22 * m1.m12 + m2.m32 * m1.m13 + m2.m42 * m1.m14, m2.m12 * m1.m21 + m2.m22 * m1.m22 + m2.m32 * m1.m23 + m2.m42 * m1.m24, m2.m12 * m1.m31 + m2.m22 * m1.m32 + m2.m32 * m1.m33 + m2.m42 * m1.m34, m2.m12 * m1.m41 + m2.m22 * m1.m42 + m2.m32 * m1.m43 + m2.m42 * m1.m44, m2.m13 * m1.m11 + m2.m23 * m1.m12 + m2.m33 * m1.m13 + m2.m43 * m1.m14, m2.m13 * m1.m21 + m2.m23 * m1.m22 + m2.m33 * m1.m23 + m2.m43 * m1.m24, m2.m13 * m1.m31 + m2.m23 * m1.m32 + m2.m33 * m1.m33 + m2.m43 * m1.m34, m2.m13 * m1.m41 + m2.m23 * m1.m42 + m2.m33 * m1.m43 + m2.m43 * m1.m44, m2.m14 * m1.m11 + m2.m24 * m1.m12 + m2.m34 * m1.m13 + m2.m44 * m1.m14, m2.m14 * m1.m21 + m2.m24 * m1.m22 + m2.m34 * m1.m23 + m2.m44 * m1.m24, m2.m14 * m1.m31 + m2.m24 * m1.m32 + m2.m34 * m1.m33 + m2.m44 * m1.m34, m2.m14 * m1.m41 + m2.m24 * m1.m42 + m2.m34 * m1.m43 + m2.m44 * m1.m44);
    }
    LoadMatrix(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m31 = m.m31;
        this.m41 = m.m41;
        this.m12 = m.m12;
        this.m22 = m.m22;
        this.m32 = m.m32;
        this.m42 = m.m42;
        this.m13 = m.m13;
        this.m23 = m.m23;
        this.m33 = m.m33;
        this.m43 = m.m43;
        this.m14 = m.m14;
        this.m24 = m.m24;
        this.m34 = m.m34;
        this.m44 = m.m44;
        return this;
    }
    MultMatrix(m) {
        this.LoadMatrix(Matrix4.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector4(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z + this.m14 * v.w, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z + this.m24 * v.w, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z + this.m34 * v.w, this.m41 * v.x + this.m42 * v.y + this.m43 * v.z + this.m44 * v.w);
    }
    asInverse() {
        var tmp1 = this.m32 * this.m43 - this.m33 * this.m42;
        var tmp2 = this.m32 * this.m44 - this.m34 * this.m42;
        var tmp3 = this.m33 * this.m44 - this.m34 * this.m43;
        var tmp4 = this.m22 * tmp3 - this.m23 * tmp2 + this.m24 * tmp1;
        var tmp5 = this.m31 * this.m42 - this.m32 * this.m41;
        var tmp6 = this.m31 * this.m43 - this.m33 * this.m41;
        var tmp7 = -this.m21 * tmp1 + this.m22 * tmp6 - this.m23 * tmp5;
        var tmp8 = this.m31 * this.m44 - this.m34 * this.m41;
        var tmp9 = this.m21 * tmp2 - this.m22 * tmp8 + this.m24 * tmp5;
        var tmp10 = -this.m21 * tmp3 + this.m23 * tmp8 - this.m24 * tmp6;
        var tmp11 = 1 / (this.m11 * tmp4 + this.m12 * tmp10 + this.m13 * tmp9 + this.m14 * tmp7);
        var tmp12 = this.m22 * this.m43 - this.m23 * this.m42;
        var tmp13 = this.m22 * this.m44 - this.m24 * this.m42;
        var tmp14 = this.m23 * this.m44 - this.m24 * this.m43;
        var tmp15 = this.m22 * this.m33 - this.m23 * this.m32;
        var tmp16 = this.m22 * this.m34 - this.m24 * this.m32;
        var tmp17 = this.m23 * this.m34 - this.m24 * this.m33;
        var tmp18 = this.m21 * this.m43 - this.m23 * this.m41;
        var tmp19 = this.m21 * this.m44 - this.m24 * this.m41;
        var tmp20 = this.m21 * this.m33 - this.m23 * this.m31;
        var tmp21 = this.m21 * this.m34 - this.m24 * this.m31;
        var tmp22 = this.m21 * this.m42 - this.m22 * this.m41;
        var tmp23 = this.m21 * this.m32 - this.m22 * this.m31;
        return new Matrix4(tmp4 * tmp11, (-this.m12 * tmp3 + this.m13 * tmp2 - this.m14 * tmp1) * tmp11, (this.m12 * tmp14 - this.m13 * tmp13 + this.m14 * tmp12) * tmp11, (-this.m12 * tmp17 + this.m13 * tmp16 - this.m14 * tmp15) * tmp11, tmp10 * tmp11, (this.m11 * tmp3 - this.m13 * tmp8 + this.m14 * tmp6) * tmp11, (-this.m11 * tmp14 + this.m13 * tmp19 - this.m14 * tmp18) * tmp11, (this.m11 * tmp17 - this.m13 * tmp21 + this.m14 * tmp20) * tmp11, tmp9 * tmp11, (-this.m11 * tmp2 + this.m12 * tmp8 - this.m14 * tmp5) * tmp11, (this.m11 * tmp13 - this.m12 * tmp19 + this.m14 * tmp22) * tmp11, (-this.m11 * tmp16 + this.m12 * tmp21 - this.m14 * tmp23) * tmp11, tmp7 * tmp11, (this.m11 * tmp1 - this.m12 * tmp6 + this.m13 * tmp5) * tmp11, (-this.m11 * tmp12 + this.m12 * tmp18 - this.m13 * tmp22) * tmp11, (this.m11 * tmp15 - this.m12 * tmp20 + this.m13 * tmp23) * tmp11);
    }
    asTranspose() {
        return new Matrix4(this.m11, this.m12, this.m13, this.m14, this.m21, this.m22, this.m23, this.m24, this.m31, this.m32, this.m33, this.m34, this.m41, this.m42, this.m43, this.m44);
    }
} // class Matrix4
// Fluxions Geometry Transformation Engine WebGL Library
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
/// <reference path="./Vector2.ts" />
/// <reference path="./Vector3.ts" />
/// <reference path="./Vector4.ts" />
/// <reference path="./Matrix2.ts" />
/// <reference path="./Matrix3.ts" />
/// <reference path="./Matrix4.ts" />
var GTE;
(function (GTE) {
    function oscillate(t, frequency = 1, phase = 0, amplitude = 1, offset = 0) {
        return Math.sin(frequency * t + phase) * amplitude + offset;
    }
    GTE.oscillate = oscillate;
    function oscillateBetween(t, frequency = 1, phase = 0, lowerLimit = 0, upperLimit = 1) {
        return Math.sin(frequency * t + phase) * (upperLimit - lowerLimit) * 0.5 + lowerLimit;
    }
    GTE.oscillateBetween = oscillateBetween;
    function random(a, b) {
        return Math.random() * (b - a + 1) + a;
    }
    GTE.random = random;
    function rand01() {
        return Math.random();
    }
    GTE.rand01 = rand01;
    function rand1() {
        return Math.random() * 2 - 1;
    }
    GTE.rand1 = rand1;
    function clamp(x, a, b) {
        return x < a ? a : x > b ? b : x;
    }
    GTE.clamp = clamp;
    // 0 <= x <= 1, returns a blend of a and b
    function lerp(a, b, x) {
        return (1 - x) * a + x * b;
    }
    GTE.lerp = lerp;
    // 0 <= x <= 1, returns a blend of a and b
    function smoothstep(a, b, x) {
        if (x < 0)
            return a;
        if (x > 1)
            return b;
        let mix = x * x * (3 - 2 * x);
        return lerp(a, b, mix);
    }
    GTE.smoothstep = smoothstep;
    // 0 <= x <= 1, returns a blend of a and b
    function smootherstep(a, b, x) {
        if (x < 0)
            return a;
        if (x > 1)
            return b;
        let mix = x * x * x * (x * (x * 6 - 15) + 10);
        return lerp(a, b, mix);
    }
    GTE.smootherstep = smootherstep;
    function distancePointLine2(point, linePoint1, linePoint2) {
        let v = linePoint2.sub(linePoint1);
        let d = v.length();
        let n = Math.abs(v.y * point.x - v.x * point.y + linePoint2.x * linePoint1.y - linePoint2.y * linePoint1.x);
        if (d != 0.0)
            return n / d;
        return 1e30;
    }
    GTE.distancePointLine2 = distancePointLine2;
    function gaussian(x, center, sigma) {
        let t = (x - center) / sigma;
        return 1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * t * t);
        //return 1 / (Math.sqrt(2.0 * sigma * sigma * Math.PI)) * Math.exp(-Math.pow(x - center, 2) / (2 * sigma * sigma));
    }
    GTE.gaussian = gaussian;
    function min3(a, b, c) {
        return Math.min(Math.min(a, b), c);
    }
    GTE.min3 = min3;
    function max3(a, b, c) {
        return Math.max(Math.max(a, b), c);
    }
    GTE.max3 = max3;
})(GTE || (GTE = {}));
// Fluxions WebGL Library
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
/// <reference path="../gte/GTE.ts" />
/// <reference path="Fluxions.ts" />
class RenderingContext {
    constructor(width = 640, height = 512) {
        this.width = width;
        this.height = height;
        this.enabledExtensions = new Map();
        this.aspectRatio = 1.0;
        this._visible = false;
        let appendDiv = false;
        let e = document.getElementById("webgldiv");
        if (!e) {
            this.divElement_ = document.createElement("div");
            this.divElement_.id = "webgldiv";
            appendDiv = true;
        }
        else {
            this.divElement_ = e;
        }
        this.canvasElement_ = document.createElement("canvas");
        this.canvasElement_.width = width;
        this.canvasElement_.height = height;
        this.canvasElement_.id = "webglcanvas";
        if (this.canvasElement_) {
            let gl = this.canvasElement_.getContext("webgl");
            if (!gl) {
                gl = this.canvasElement_.getContext("experimental-webgl");
            }
            if (!gl) {
                this.divElement_.innerText = "WebGL not supported.";
                throw "Unable to create rendering context!";
            }
            else {
                this.gl = gl;
                this.divElement_.appendChild(this.canvasElement_);
                this.divElement_.align = "center";
                this.aspectRatio = width / height;
                let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    let vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    hflog.log(vendor);
                    hflog.log(renderer);
                }
            }
        }
        else {
            this.divElement_.innerText = "WebGL not supported.";
            throw "Unable to create canvas!";
        }
        if (appendDiv) {
            document.body.appendChild(this.divElement_);
        }
        this.EnableExtensions([
            "OES_standard_derivatives",
            "WEBGL_depth_texture",
            "OES_texture_float",
            "OES_element_index_uint",
            "EXT_texture_filter_anisotropic",
            "OES_texture_float",
            "OES_texture_float_linear"
        ]);
    }
    // ...
    EnableExtensions(names) {
        let supportedExtensions = this.gl.getSupportedExtensions();
        if (!supportedExtensions)
            return false;
        let allFound = true;
        for (let name of names) {
            let found = false;
            for (let ext of supportedExtensions) {
                if (name == ext) {
                    this.enabledExtensions.set(name, this.gl.getExtension(name));
                    hflog.log("Extension " + name + " enabled");
                    found = true;
                    break;
                }
            }
            if (!found) {
                hflog.log("Extension " + name + " not enabled");
                allFound = false;
                break;
            }
        }
        return allFound;
    }
    GetExtension(name) {
        if (this.enabledExtensions.has(name)) {
            return this.enabledExtensions.get(name);
        }
        return null;
    }
    get canvas() {
        return this.canvasElement_;
    }
    get hidden() {
        return this.canvasElement_.hidden;
    }
    focus() {
        if (this.canvasElement_)
            this.canvasElement_.focus();
    }
    hide() {
        this.divElement_.hidden = true;
    }
    show() {
        this.divElement_.hidden = false;
    }
}
// Fluxions WebGL Library
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
/// <reference path="./RenderingContext.ts"/>
class RenderConfig {
    constructor(_context, _vertShaderSource, _fragShaderSource) {
        this._context = _context;
        this._vertShaderSource = _vertShaderSource;
        this._fragShaderSource = _fragShaderSource;
        this._isCompiled = false;
        this._isLinked = false;
        this._vertShader = null;
        this._fragShader = null;
        this._program = null;
        this._vertShaderInfoLog = "";
        this._fragShaderInfoLog = "";
        this._vertShaderCompileStatus = false;
        this._fragShaderCompileStatus = false;
        this._programInfoLog = "";
        this._programLinkStatus = false;
        this.uniforms = new Map();
        this.uniformInfo = new Map();
        this.useDepthTest = true;
        this.depthTest = WebGLRenderingContext.LESS;
        this.depthMask = true;
        this.usesFBO = false;
        this.renderShadowMap = false;
        this.renderGBuffer = false;
        this.Reset(this._vertShaderSource, this._fragShaderSource);
    }
    get usable() { return this.IsCompiledAndLinked(); }
    IsCompiledAndLinked() {
        if (this._isCompiled && this._isLinked)
            return true;
        return false;
    }
    Use() {
        let gl = this._context.gl;
        gl.useProgram(this._program);
        if (this.useDepthTest) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(this.depthTest);
        }
        gl.depthMask(this.depthMask);
    }
    Restore() {
        let gl = this._context.gl;
        gl.useProgram(null);
        if (this.useDepthTest) {
            gl.disable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LESS);
        }
        gl.depthMask(true);
    }
    SetMatrix4f(uniformName, m) {
        let gl = this._context.gl;
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniformMatrix4fv(location, false, m.toColMajorArray());
        }
    }
    SetUniform1i(uniformName, x) {
        let gl = this._context.gl;
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniform1i(location, x);
        }
    }
    SetUniform1f(uniformName, x) {
        let gl = this._context.gl;
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniform1f(location, x);
        }
    }
    SetUniform2f(uniformName, v) {
        let gl = this._context.gl;
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniform2fv(location, v.toFloat32Array());
        }
    }
    SetUniform3f(uniformName, v) {
        let gl = this._context.gl;
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location != null) {
            gl.uniform3fv(location, v.toFloat32Array());
        }
    }
    SetUniform4f(uniformName, v) {
        let gl = this._context.gl;
        let location = gl.getUniformLocation(this._program, uniformName);
        if (location) {
            gl.uniform4fv(location, v.toFloat32Array());
        }
    }
    GetAttribLocation(name) {
        let gl = this._context.gl;
        return gl.getAttribLocation(this._program, name);
    }
    GetUniformLocation(name) {
        let gl = this._context.gl;
        let uloc = gl.getUniformLocation(this._program, name);
        if (!uloc)
            return null;
        return uloc;
    }
    Reset(vertShaderSource, fragShaderSource) {
        let gl = this._context.gl;
        let vertShader = gl.createShader(gl.VERTEX_SHADER);
        if (vertShader) {
            gl.shaderSource(vertShader, vertShaderSource);
            gl.compileShader(vertShader);
            let status = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
            let infoLog = null;
            if (!status) {
                infoLog = gl.getShaderInfoLog(vertShader);
                hflog.error("VERTEX SHADER COMPILE ERROR:");
                hflog.error(infoLog ? infoLog : "");
                hflog.error("--------------------------------------------");
                let errorElement = document.getElementById("errors");
                if (!errorElement && infoLog) {
                    let newDiv = document.createElement("div");
                    newDiv.appendChild(document.createTextNode("Vertex shader info log"));
                    newDiv.appendChild(document.createElement("br"));
                    newDiv.appendChild(document.createTextNode(infoLog));
                    let pre = document.createElement("pre");
                    pre.textContent = this._vertShaderSource;
                    pre.style.width = "50%";
                    newDiv.appendChild(pre);
                    document.body.appendChild(newDiv);
                }
            }
            if (status)
                this._vertShaderCompileStatus = true;
            if (infoLog)
                this._vertShaderInfoLog = infoLog;
            this._vertShader = vertShader;
        }
        else {
            return false;
        }
        let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (fragShader) {
            gl.shaderSource(fragShader, fragShaderSource);
            gl.compileShader(fragShader);
            let status = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
            let infoLog = null;
            if (!status) {
                infoLog = gl.getShaderInfoLog(fragShader);
                hflog.error("FRAGMENT SHADER COMPILE ERROR:");
                hflog.error(infoLog ? infoLog : "");
                hflog.error("--------------------------------------------");
                let errorElement = document.getElementById("errors");
                if (!errorElement && infoLog) {
                    let newDiv = document.createElement("div");
                    newDiv.appendChild(document.createTextNode("Fragment shader info log"));
                    newDiv.appendChild(document.createElement("br"));
                    newDiv.appendChild(document.createTextNode(infoLog));
                    let pre = document.createElement("pre");
                    pre.textContent = this._fragShaderSource;
                    pre.style.width = "50%";
                    newDiv.appendChild(pre);
                    document.body.appendChild(newDiv);
                }
            }
            if (status)
                this._fragShaderCompileStatus = true;
            if (infoLog)
                this._fragShaderInfoLog = infoLog;
            this._fragShader = fragShader;
        }
        else {
            return false;
        }
        if (this._vertShaderCompileStatus && this._fragShaderCompileStatus) {
            this._isCompiled = true;
            this._program = gl.createProgram();
            if (this._program) {
                gl.attachShader(this._program, this._vertShader);
                gl.attachShader(this._program, this._fragShader);
                gl.linkProgram(this._program);
                if (gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
                    this._programLinkStatus = true;
                    this._isLinked = true;
                }
                else {
                    this._programLinkStatus = false;
                    let infoLog = gl.getProgramInfoLog(this._program);
                    console.error("PROGRAM LINK ERROR:");
                    console.error(infoLog);
                    console.error("--------------------------------------------");
                    if (infoLog) {
                        this._programInfoLog = infoLog;
                        let errorElement = document.getElementById("errors");
                        if (!errorElement && infoLog) {
                            let newDiv = document.createElement("div");
                            newDiv.appendChild(document.createTextNode("PROGRAM INFO LOG"));
                            newDiv.appendChild(document.createElement("br"));
                            newDiv.appendChild(document.createTextNode(infoLog));
                            document.body.appendChild(newDiv);
                        }
                    }
                }
            }
        }
        else {
            return false;
        }
        this.updateActiveUniforms();
        return true;
    }
    updateActiveUniforms() {
        let gl = this._context.gl;
        let numUniforms = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
        this.uniforms.clear();
        this.uniformInfo.clear();
        for (let i = 0; i < numUniforms; i++) {
            let uniform = gl.getActiveUniform(this._program, i);
            if (!uniform)
                continue;
            this.uniformInfo.set(uniform.name, uniform);
            this.uniforms.set(uniform.name, gl.getUniformLocation(this._program, uniform.name));
        }
        return true;
    }
}
// Fluxions WebGL Library
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
class Surface {
    constructor(mode, offset, mtllib, mtl) {
        this.mode = mode;
        this.offset = offset;
        this.mtllib = mtllib;
        this.mtl = mtl;
        this.count = 0;
    }
    Add() {
        this.count++;
    }
}
// Fluxions WebGL Library
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
/// <reference path="../gte/GTE.ts" />
class Vertex {
    constructor(position = new Vector3(0, 0, 0), normal = new Vector3(0, 0, 1), color = new Vector3(1, 1, 1), texcoord = new Vector3(0, 0, 0)) {
        this.position = position;
        this.normal = normal;
        this.color = color;
        this.texcoord = texcoord;
    }
    asFloat32Array() {
        return new Float32Array([
            this.position.x, this.position.y, this.position.z,
            this.normal.x, this.normal.y, this.normal.z,
            this.color.x, this.color.y, this.color.z,
            this.texcoord.x, this.texcoord.y, this.texcoord.z
        ]);
    }
    asArray() {
        return [
            this.position.x, this.position.y, this.position.z,
            this.normal.x, this.normal.y, this.normal.z,
            this.color.x, this.color.y, this.color.z,
            this.texcoord.x, this.texcoord.y, this.texcoord.z
        ];
    }
}
;
// Fluxions WebGL Library
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
/// <reference path="../gte/GTE.ts" />
class Material {
    constructor(name) {
        this.name = name;
        this.Kd = Vector3.make(0.8, 0.8, 0.8);
        this.Ka = Vector3.make(0.2, 0.2, 0.2);
        this.Ks = Vector3.make(1.0, 1.0, 1.0);
        this.map_Kd_mix = 0.0;
        this.map_Kd = "";
        this.map_Ks_mix = 0.0;
        this.map_Ks = "";
        this.map_normal_mix = 0.0;
        this.map_normal = "";
        this.PBKsm = 0;
        this.PBKdm = 0;
        this.PBn2 = 1.333;
        this.PBk2 = 0;
        this.minFilter = 0;
        this.magFilter = 0;
    }
}
// Fluxions WebGL Library
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
/// <reference path="./Fluxions.ts" />
class FBO {
    constructor(_renderingContext, depth, color, width = 512, height = 512, colorType) {
        this._renderingContext = _renderingContext;
        this.depth = depth;
        this.color = color;
        this.width = width;
        this.height = height;
        this.colorType = colorType;
        this._colorTexture = null;
        this._depthTexture = null;
        this._colorType = 0;
        this._complete = false;
        this._colorUnit = -1;
        this._depthUnit = -1;
        this.clearColor = Vector3.make(0.2, 0.2, 0.2);
        let gl = _renderingContext.gl;
        let fbo = gl.createFramebuffer();
        if (fbo) {
            this._fbo = fbo;
        }
        else {
            throw "Unable to create FBO";
        }
        width = Math.pow(2.0, Math.floor(Math.log2(width)) + 1);
        height = Math.pow(2.0, Math.floor(Math.log2(height)) + 1);
        this._powerOfTwoDimensions = Vector2.make(this.width, this.height);
        if (colorType == 0)
            this._colorType = gl.UNSIGNED_BYTE;
        else if (colorType == gl.FLOAT)
            this._colorType = gl.FLOAT;
        else if (colorType == gl.UNSIGNED_BYTE)
            this._colorType = gl.UNSIGNED_BYTE;
        else
            this._colorType = gl.FLOAT;
        this.make();
    }
    get complete() { return this._complete; }
    get dimensions() { return Vector2.make(this.width, this.height); }
    make() {
        let gl = this._renderingContext.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);
        gl.activeTexture(gl.TEXTURE0);
        if (this.color && !this._colorTexture) {
            this._colorTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this._colorTexture);
            // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
            //     this._powerOfTwoDimensions.x, this._powerOfTwoDimensions.y, 0, gl.RGBA, this._colorType, null);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, this._colorType, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._colorTexture, 0);
        }
        if (this.depth && !this._depthTexture) {
            this._depthTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this._depthTexture);
            // gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT,
            //     this._powerOfTwoDimensions.x, this._powerOfTwoDimensions.y, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._depthTexture, 0);
        }
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
            this._complete = false;
            hflog.error("Unable to create a complete framebuffer");
            hflog.error("---------------------------------------");
        }
        else {
            this._complete = true;
            hflog.log("Framebuffer is okay! size is " + this.width + "x" + this.height + " texture: " +
                this._powerOfTwoDimensions.x + "x" + this._powerOfTwoDimensions.y);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    use(clearScreen = true, disableColorWrites = false) {
        let gl = this._renderingContext.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);
        if (disableColorWrites)
            gl.colorMask(false, false, false, false);
        this._savedViewport = gl.getParameter(gl.VIEWPORT);
        gl.viewport(0, 0, this.width, this.height);
        if (clearScreen) {
            gl.clearColor(this.clearColor.x, this.clearColor.y, this.clearColor.z, 1.0);
            let bits = 0;
            if (this.color)
                bits |= gl.COLOR_BUFFER_BIT;
            if (this.depth)
                bits |= gl.DEPTH_BUFFER_BIT;
            gl.clear(bits);
        }
    }
    restore() {
        let gl = this._renderingContext.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        if (this.color && this._colorTexture) {
            gl.bindTexture(gl.TEXTURE_2D, this._colorTexture);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        gl.colorMask(true, true, true, true);
        if (this._savedViewport) {
            gl.viewport(this._savedViewport[0], this._savedViewport[1], this._savedViewport[2], this._savedViewport[3]);
            this._savedViewport = undefined;
        }
    }
    bindTextures(colorUnit = 15, depthUnit = 16) {
        let gl = this._renderingContext.gl;
        this._colorUnit = colorUnit;
        this._depthUnit = depthUnit;
        if (this._colorUnit >= 0) {
            gl.activeTexture(this._colorUnit + gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._colorTexture);
        }
        if (this._depthUnit >= 0) {
            gl.activeTexture(this._depthUnit + gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._depthTexture);
        }
        gl.activeTexture(gl.TEXTURE0);
    }
    unbindTextures() {
        let gl = this._renderingContext.gl;
        if (this._colorUnit >= 0) {
            gl.activeTexture(this._colorUnit + gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this._colorUnit = -1;
        }
        if (this._depthUnit >= 0) {
            gl.activeTexture(this._depthUnit + gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this._depthUnit = -1;
        }
        gl.activeTexture(gl.TEXTURE0);
    }
}
// Fluxions WebGL Library
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
/// <reference path="./Fluxions.ts" />
class DirectionalLight {
    constructor() {
        this._direction = new Vector3(0.34816, 0.87039, 0.34816);
        this._center = new Vector3();
        this._eye = new Vector3();
        this._distance = 5.0;
        this._zfar = 100.0;
        this._znear = 1.0;
        this._E0 = new Vector3(100000, 100000, 100000);
        this._transform = Matrix4.makeIdentity();
        this._isOrbit = false;
        this._zoom = 1.0;
        this._offset = new Vector2(0.0, 0.0);
    }
    set distance(d) {
        this._distance = d;
        this._znear = -d + 1.0;
        this._zfar = d + 1.0;
    }
    set direction(v) {
        this._direction = v.norm();
        this._eye = this._center.add(this._direction.mul(this._distance));
        this._isOrbit = false;
    }
    get direction() {
        if (this._isOrbit) {
            let v1 = new Vector4(0.0, 0.0, 0.0, 1.0);
            let v1p = this._transform.transform(v1).toVector3();
            return this._transform.asInverse().row3(3);
            // let v2 = new Vector4(1.0, 0.0, 0.0, 1.0);
            // let v2p = this._transform.transform(v2).toVector3();
            // return v2p.sub(v1p);
        }
        return this._direction.clone();
    }
    set center(location) {
        this._center = location.clone();
        this._eye = this._center.add(this._direction.mul(this._distance));
    }
    set dirto(dirto) {
        this._center.reset();
        this.direction = dirto;
    }
    set E0(color) {
        this._E0.copy(color);
    }
    get E0() {
        return this._E0.clone();
    }
    setOrbit(azimuthInDegrees, pitchInDegrees, distance) {
        this._transform.LoadIdentity();
        this._transform.Rotate(azimuthInDegrees, 0.0, 1.0, 0.0);
        this._transform.Rotate(pitchInDegrees, 1.0, 0.0, 0.0);
        this._transform.Translate(0.0, 0.0, -distance);
        this._isOrbit = true;
        return this._transform.clone();
    }
    get lightMatrix() {
        if (this._isOrbit == true)
            return this._transform.clone();
        return Matrix4.makeLookAt2(this._direction.mul(this._distance), new Vector3(0.0), new Vector3(0.0, 1.0, 0.0));
        // this._eye = this._center.add(this._direction.mul(this._distance));
        // return Matrix4.makeLookAt(this._eye, this._center, new Vector3(0.0, 1.0, 0.0));
    }
    get projectionMatrix() {
        let size = this._distance;
        // this._znear = -50.0;
        // this._zfar = 50.0;
        //return Matrix4.makePerspectiveX(90.0, 1.0, 0.1, 100.0);
        return Matrix4.makeOrtho(-size, size, -size, size, -size * 2, size * 2);
        // return Matrix4.makeOrtho(
        //     this._zoom * (-size + this._offset.x), this._zoom * (size + this._offset.x),
        //     this._zoom * (-size + this._offset.y), this._zoom * (size + this._offset.y),
        //     this._znear, this._zfar);
    }
}
// Fluxions WebGL Library
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
/// <reference path="../gte/GTE.ts" />
var Colors;
(function (Colors) {
    const DarkIntensity = 30;
    const LightIntensity = 210;
    const MediumIntensity = GTE.lerp(DarkIntensity, LightIntensity, 0.5);
    const GrayIntensity33 = GTE.lerp(DarkIntensity, LightIntensity, 0.66);
    const GrayIntensity66 = GTE.lerp(DarkIntensity, LightIntensity, 0.33);
    const Gr33Intensity = GTE.lerp(DarkIntensity, LightIntensity, 0.66);
    const Gr66Intensity = GTE.lerp(DarkIntensity, LightIntensity, 0.33);
    Colors.Black = Vector3.make(0, 0, 0);
    Colors.White = Vector3.make(1, 1, 1);
    Colors.Gray66 = Vector3.make(.7, .7, .7);
    Colors.Gray33 = Vector3.make(.3, .3, .3);
    Colors.Red = Vector3.make(1, 0, 0);
    Colors.Orange = Vector3.make(1.0, 0.5, 0.0);
    Colors.Yellow = Vector3.make(1.0, 1.0, 0.0);
    Colors.Green = Vector3.make(0.0, 1.0, 0.0);
    Colors.Cyan = Vector3.make(0.0, 1.0, 1.0);
    Colors.Blue = Vector3.make(0.0, 0.0, 1.0);
    Colors.Indigo = Vector3.make(0.5, 0.0, 1.0);
    Colors.Violet = Vector3.make(150 / 255, 30 / 255, 150 / 255);
    Colors.Magenta = Vector3.make(1.0, 0.0, 1.0);
    Colors.Rose = Vector3.make(1.0, 0.0, 0.5);
    // export const DarkGreen: Vector3 = Vector3.make(30/255, 91/255, 30/255);
    Colors.Brown = Vector3.make(150 / 255, 91 / 255, 30 / 255);
    Colors.SkyBlue = Vector3.make(30 / 255, 150 / 255, 210 / 255);
    Colors.DarkRed = Vector3.make(120 / 255, 30 / 255, 30 / 255);
    Colors.DarkCyan = Vector3.make(30 / 255, 120 / 255, 120 / 255);
    Colors.DarkGreen = Vector3.make(30 / 255, 120 / 255, 30 / 255);
    Colors.DarkMagenta = Vector3.make(120 / 255, 30 / 255, 120 / 255);
    Colors.DarkBlue = Vector3.make(30 / 255, 30 / 255, 120 / 255);
    Colors.DarkYellow = Vector3.make(120 / 255, 120 / 255, 30 / 255);
    Colors.LightRed = Vector3.make(210 / 255, 120 / 255, 120 / 255);
    Colors.LightCyan = Vector3.make(120 / 255, 210 / 255, 210 / 255);
    Colors.LightGreen = Vector3.make(120 / 255, 210 / 255, 120 / 255);
    Colors.LightMagenta = Vector3.make(210 / 255, 120 / 255, 210 / 255);
    Colors.LightBlue = Vector3.make(120 / 255, 120 / 255, 210 / 255);
    Colors.LightYellow = Vector3.make(210 / 255, 210 / 255, 120 / 255);
    Colors.ArneOrange = Vector3.make(235 / 255, 137 / 255, 49 / 255);
    Colors.ArneYellow = Vector3.make(247 / 255, 226 / 255, 107 / 255);
    Colors.ArneDarkGreen = Vector3.make(47 / 255, 72 / 255, 78 / 255);
    Colors.ArneGreen = Vector3.make(68 / 255, 137 / 255, 26 / 255);
    Colors.ArneSlimeGreen = Vector3.make(163 / 255, 206 / 255, 39 / 255);
    Colors.ArneNightBlue = Vector3.make(27 / 255, 38 / 255, 50 / 255);
    Colors.ArneSeaBlue = Vector3.make(0 / 255, 87 / 255, 132 / 255);
    Colors.ArneSkyBlue = Vector3.make(49 / 255, 162 / 255, 242 / 255);
    Colors.ArneCloudBlue = Vector3.make(178 / 255, 220 / 255, 239 / 255);
    Colors.ArneDarkBlue = Vector3.make(52 / 255, 42 / 255, 151 / 255);
    Colors.ArneDarkGray = Vector3.make(101 / 255, 109 / 255, 113 / 255);
    Colors.ArneLightGray = Vector3.make(204 / 255, 204 / 255, 204 / 255);
    Colors.ArneDarkRed = Vector3.make(115 / 255, 41 / 255, 48 / 255);
    Colors.ArneRose = Vector3.make(203 / 255, 67 / 255, 167 / 255);
    Colors.ArneTaupe = Vector3.make(82 / 255, 79 / 255, 64 / 255);
    Colors.ArneGold = Vector3.make(173 / 255, 157 / 255, 51 / 255);
    Colors.ArneTangerine = Vector3.make(236 / 255, 71 / 255, 0 / 255);
    Colors.ArneHoney = Vector3.make(250 / 255, 180 / 255, 11 / 255);
    Colors.ArneMossyGreen = Vector3.make(17 / 255, 94 / 255, 51 / 255);
    Colors.ArneDarkCyan = Vector3.make(20 / 255, 128 / 255, 126 / 255);
    Colors.ArneCyan = Vector3.make(21 / 255, 194 / 255, 165 / 255);
    Colors.ArneBlue = Vector3.make(34 / 255, 90 / 255, 246 / 255);
    Colors.ArneIndigo = Vector3.make(153 / 255, 100 / 255, 249 / 255);
    Colors.ArnePink = Vector3.make(247 / 255, 142 / 255, 214 / 255);
    Colors.ArneSkin = Vector3.make(244 / 255, 185 / 255, 144 / 255);
    Colors.ArneBlack = Vector3.make(30 / 255, 30 / 255, 30 / 255);
})(Colors || (Colors = {}));
// Fluxions WebGL Library
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
/// <reference path="./Fluxions.ts" />
class IndexedGeometryMesh {
    constructor(_renderingContext) {
        this._renderingContext = _renderingContext;
        this.vertices = [];
        this.indices = [];
        this.surfaces = [];
        this._mtllib = "";
        this._mtl = "";
        this._vertex = new Vertex();
        this._dirty = true;
        this._vboData = new Float32Array();
        this._iboData = new Uint32Array();
        let gl = this._renderingContext.gl;
        let vbo = gl.createBuffer();
        let ibo = gl.createBuffer();
        if (!vbo || !ibo)
            throw "IndexedGeometryMesh::constructor() Unable to create buffer";
        this._vbo = vbo;
        this._ibo = ibo;
    }
    Reset() {
        this.vertices = [];
        this.indices = [];
        this.surfaces = [];
        this._dirty = true;
        this._vertex = new Vertex();
        this._mtllib = "";
        this._mtl = "";
    }
    SetMtllib(mtllib) {
        this._mtllib = mtllib;
    }
    SetMtl(mtl) {
        this._mtl = mtl;
    }
    BeginSurface(mode) {
        if (this.surfaces.length == 0) {
            // if no surfaces exist, add one
            this.surfaces.push(new Surface(mode, this.indices.length, this._mtllib, this._mtl));
        }
        else if (this.currentIndexCount != 0) {
            // do not add a surface if the most recent one is empty
            this.surfaces.push(new Surface(mode, this.indices.length, this._mtllib, this._mtl));
        }
        if (this.surfaces.length > 0) {
            // simply update the important details
            let s = this.surfaces[this.surfaces.length - 1];
            s.mtl = this._mtl;
            s.mtllib = this._mtllib;
        }
    }
    AddIndex(i) {
        if (this.surfaces.length == 0)
            return;
        if (i < 0) {
            this.indices.push((this.vertices.length / 12) + i);
        }
        else {
            this.indices.push(i);
        }
        this.surfaces[this.surfaces.length - 1].Add();
        this._dirty = true;
    }
    get currentIndexCount() {
        if (this.surfaces.length == 0)
            return 0;
        return this.surfaces[this.surfaces.length - 1].count;
    }
    SetNormal(n) {
        this._vertex.normal.copy(n);
    }
    SetColor(c) {
        this._vertex.color.copy(c);
    }
    SetTexCoord(t) {
        this._vertex.texcoord.copy(t);
    }
    AddVertex(v) {
        this._vertex.position.copy(v);
        this.vertices.push(...this._vertex.asArray());
        this._vertex = new Vertex();
    }
    // DrawTexturedRect(bottomLeft: Vector3, upperRight: Vector3,
    //     minTexCoord: Vector3, maxTexCoord: Vector3): void {
    // }
    BuildBuffers() {
        // Building the VBO goes here
        if (!this._dirty)
            return;
        this._vboData = new Float32Array(this.vertices);
        this._iboData = new Uint32Array(this.indices);
        let gl = this._renderingContext.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bufferData(gl.ARRAY_BUFFER, this._vboData, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._iboData, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        this._dirty = false;
    }
    Render(rc, sg) {
        if (!rc.usable) {
            hflog.warn("IndexedGeometryMesh Called, but render config is unusable.");
            return;
        }
        // Rendering code goes here
        this.BuildBuffers();
        let gl = this._renderingContext.gl;
        let offsets = [0, 12, 24, 36];
        let locs = [
            rc.GetAttribLocation("aPosition"),
            rc.GetAttribLocation("aNormal"),
            rc.GetAttribLocation("aColor"),
            rc.GetAttribLocation("aTexcoord")
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._ibo);
        for (let i = 0; i < 4; i++) {
            if (locs[i] >= 0) {
                gl.enableVertexAttribArray(locs[i]);
                gl.vertexAttribPointer(locs[i], 3, gl.FLOAT, false, 48, offsets[i]);
            }
        }
        for (let s of this.surfaces) {
            sg.UseMaterial(rc, s.mtllib, s.mtl);
            gl.drawElements(s.mode, s.count, gl.UNSIGNED_INT, s.offset * 4);
        }
        for (let i = 0; i < 4; i++) {
            if (locs[i] >= 0) {
                gl.disableVertexAttribArray(locs[i]);
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
// Fluxions WebGL Library
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
class MatrixStack {
    constructor() {
        this._matrix = [Matrix4.makeIdentity()];
    }
    Push() {
        this._matrix.push(this.m);
    }
    Pop() {
        if (this.length == 1)
            return;
        this._matrix.pop();
    }
    toColMajorArray() {
        return this.m.toColMajorArray();
    }
    toRowMajorArray() {
        return this.m.toRowMajorArray();
    }
    get empty() { return this._matrix.length == 0; }
    get length() { return this._matrix.length; }
    get m() {
        if (!this.empty) {
            return this._matrix[this._matrix.length - 1];
        }
        return Matrix4.makeIdentity();
    }
}
// Fluxions WebGL Library
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
/// <reference path="./Fluxions.ts" />
var Utils;
(function (Utils) {
    // return last part of the url name ignoring possible ending slash
    function GetURLResource(url) {
        let parts = url.split('/');
        let lastSection = parts.pop() || parts.pop();
        if (lastSection) {
            return lastSection;
        }
        else {
            return "unknown";
        }
    }
    Utils.GetURLResource = GetURLResource;
    function GetURLPath(url) {
        let parts = url.split('/');
        if (!parts.pop())
            parts.pop();
        let path = parts.join("/") + "/";
        if (path) {
            return path;
        }
        else {
            return "";
        }
    }
    Utils.GetURLPath = GetURLPath;
    function IsExtension(sourceString, extensionWithDot) {
        let start = sourceString.length - extensionWithDot.length - 1;
        if (start >= 0 && sourceString.substr(start, extensionWithDot.length) == extensionWithDot) {
            return true;
        }
        return false;
    }
    Utils.IsExtension = IsExtension;
    function GetExtension(sourceString) {
        let position = sourceString.lastIndexOf(".");
        if (position >= 0) {
            return sourceString.substr(position + 1).toLowerCase();
        }
        return "";
    }
    Utils.GetExtension = GetExtension;
    class TextFileLoader {
        constructor(url, callbackfn, parameter = 0) {
            this.callbackfn = callbackfn;
            this._loaded = false;
            this._failed = false;
            this.data = "";
            this.name = GetURLResource(url);
            let self = this;
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("load", (e) => {
                if (!xhr.responseText) {
                    self._failed = true;
                    self.data = "unknown";
                }
                else {
                    self.data = xhr.responseText;
                }
                self._loaded = true;
                callbackfn(self.data, self.name, parameter);
            });
            xhr.addEventListener("abort", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            xhr.addEventListener("error", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            xhr.open("GET", url);
            xhr.send();
        }
        get loaded() { return this._loaded; }
        get failed() { return this._failed; }
    }
    Utils.TextFileLoader = TextFileLoader;
    class ImageFileLoader {
        constructor(url, callbackfn, parameter = 0) {
            this.callbackfn = callbackfn;
            this._loaded = false;
            this._failed = false;
            this.image = new Image();
            this.name = GetURLResource(url);
            let self = this;
            let ajax = new XMLHttpRequest();
            this.image.addEventListener("load", (e) => {
                self._loaded = true;
                callbackfn(self.image, this.name, parameter);
            });
            this.image.addEventListener("error", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            this.image.addEventListener("abort", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            this.image.src = url;
        }
        get loaded() { return this._loaded; }
        get failed() { return this._failed; }
    }
    Utils.ImageFileLoader = ImageFileLoader;
    function niceTimestamp(timestamp) {
        return (Math.round(1000.0 * timestamp) / 1000.0).toString() + "ms";
    }
    Utils.niceTimestamp = niceTimestamp;
    function niceFramesPerSecond(t0, t1) {
        let s = (t1 - t0);
        return Math.round(1.0 / s).toString() + "fps";
    }
    Utils.niceFramesPerSecond = niceFramesPerSecond;
    function niceDuration(t0, t1) {
        return ((Math.round(1000.0 * (t1 - t0))) / 1000.0).toString() + "ms";
    }
    Utils.niceDuration = niceDuration;
    function round3(x) {
        return Math.round(x * 1000.0) / 1000.0;
    }
    Utils.round3 = round3;
    function round3str(x) {
        return (Math.round(x * 1000.0) / 1000.0).toString();
    }
    Utils.round3str = round3str;
    function niceVector(v) {
        return "(" + round3str(v.x) + ", " + round3str(v.y) + ", " + round3str(v.z) + ")";
    }
    Utils.niceVector = niceVector;
    function niceNumber(x, digits) {
        let t = Math.pow(10.0, digits);
        return (Math.round(x * t) / t).toString();
    }
    Utils.niceNumber = niceNumber;
    function niceMatrix4(m) {
        return "("
            + round3str(m.m11) + ", " + round3str(m.m12) + ", " + round3str(m.m13) + ", " + round3str(m.m14) + ", "
            + round3str(m.m21) + ", " + round3str(m.m22) + ", " + round3str(m.m23) + ", " + round3str(m.m24) + ", "
            + round3str(m.m31) + ", " + round3str(m.m32) + ", " + round3str(m.m33) + ", " + round3str(m.m34) + ", "
            + round3str(m.m41) + ", " + round3str(m.m42) + ", " + round3str(m.m43) + ", " + round3str(m.m44)
            + ")";
    }
    Utils.niceMatrix4 = niceMatrix4;
    function SeparateCubeMapImages(image, images) {
        if (image.width != 6 * image.height) {
            return;
        }
        // images are laid out: +X, -X, +Y, -Y, +Z, -Z
        let canvas = document.createElement("canvas");
        if (canvas) {
            canvas.width = image.width;
            canvas.height = image.height;
            let ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(image, 0, 0);
                for (let i = 0; i < 6; i++) {
                    images[i] = ctx.getImageData(i * image.height, 0, image.height, image.height);
                }
            }
        }
    }
    Utils.SeparateCubeMapImages = SeparateCubeMapImages;
    class TextParser {
        constructor(data) {
            this.lines = [];
            // split using regex any sequence of 1 or more newlines or carriage returns
            let lines = data.split(/[\n\r]+/);
            for (let line of lines) {
                let unfilteredTokens = line.split(/\s+/);
                if (unfilteredTokens.length > 0 && unfilteredTokens[0][0] == '#')
                    continue;
                let tokens = [];
                for (let t of unfilteredTokens) {
                    if (t.length > 0) {
                        tokens.push(t);
                    }
                }
                if (tokens.length == 0) {
                    continue;
                }
                this.lines.push(tokens);
            }
        }
        static MakeIdentifier(token) {
            if (token.length == 0)
                return "unknown";
            return token.replace(/[^\w]+/, "_");
        }
        static ParseIdentifier(tokens) {
            if (tokens.length >= 2)
                return tokens[1].replace(/[^\w]+/, "_");
            return "unknown";
        }
        static ParseFloat(tokens) {
            let x = (tokens.length >= 2) ? parseFloat(tokens[1]) : 0.0;
            return x;
        }
        static ParseVector(tokens) {
            let x = (tokens.length >= 2) ? parseFloat(tokens[1]) : 0.0;
            let y = (tokens.length >= 3) ? parseFloat(tokens[2]) : 0.0;
            let z = (tokens.length >= 4) ? parseFloat(tokens[3]) : 0.0;
            return new Vector3(x, y, z);
        }
        static ParseArray(tokens) {
            let v = new Array(tokens.length - 1);
            for (let i = 1; i < tokens.length; i++) {
                v[i] = parseFloat(tokens[i]);
            }
            return v;
        }
        static ParseMatrix(tokens) {
            if (tokens.length > 16 && tokens[0] == "transform") {
                let m = new Matrix4(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]), parseFloat(tokens[4]), parseFloat(tokens[5]), parseFloat(tokens[6]), parseFloat(tokens[7]), parseFloat(tokens[8]), parseFloat(tokens[9]), parseFloat(tokens[10]), parseFloat(tokens[11]), parseFloat(tokens[12]), parseFloat(tokens[13]), parseFloat(tokens[14]), parseFloat(tokens[15]), parseFloat(tokens[16])).asTranspose();
                return m;
            }
            return Matrix4.makeZero();
        }
        static ParseFaceIndices(_token) {
            // index 0 is position
            // index 1 is texcoord
            // index 2 is normal
            let indices = [-1, -1, -1];
            let token = _token.replace("//", "/0/");
            let tokens = token.split("/");
            if (tokens.length >= 1) {
                indices[0] = parseInt(tokens[0]) - 1;
            }
            if (tokens.length == 2) {
                indices[2] = parseInt(tokens[1]) - 1;
            }
            else if (tokens.length == 3) {
                indices[1] = parseInt(tokens[1]) - 1;
                indices[2] = parseInt(tokens[2]) - 1;
            }
            return indices;
        }
        static ParseFace(tokens) {
            let indices = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            if (tokens.length < 4) {
                return indices;
            }
            let v1 = TextParser.ParseFaceIndices(tokens[1]);
            let v2 = TextParser.ParseFaceIndices(tokens[2]);
            let v3 = TextParser.ParseFaceIndices(tokens[3]);
            return [...v1, ...v2, ...v3];
        }
    } // class TextParser    
    Utils.TextParser = TextParser;
    class ShaderLoader {
        constructor(vertShaderUrl, fragShaderUrl, callbackfn) {
            this.vertShaderUrl = vertShaderUrl;
            this.fragShaderUrl = fragShaderUrl;
            this.callbackfn = callbackfn;
            this.vertLoaded = false;
            this.fragLoaded = false;
            this.vertFailed = false;
            this.fragFailed = false;
            this.vertShaderSource = "";
            this.fragShaderSource = "";
            let self = this;
            let vertXHR = new XMLHttpRequest();
            vertXHR.addEventListener("load", (e) => {
                self.vertShaderSource = vertXHR.responseText;
                self.vertLoaded = true;
                if (this.loaded) {
                    self.callbackfn(self.vertShaderSource, self.fragShaderSource);
                }
            });
            vertXHR.addEventListener("abort", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + vertShaderUrl);
            });
            vertXHR.addEventListener("error", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + vertShaderUrl);
            });
            vertXHR.open("GET", vertShaderUrl);
            vertXHR.send();
            let fragXHR = new XMLHttpRequest();
            fragXHR.addEventListener("load", (e) => {
                self.fragShaderSource = fragXHR.responseText;
                self.fragLoaded = true;
                if (this.loaded) {
                    self.callbackfn(self.vertShaderSource, self.fragShaderSource);
                }
            });
            fragXHR.addEventListener("abort", (e) => {
                self.fragFailed = true;
                console.error("unable to GET " + fragShaderUrl);
            });
            fragXHR.addEventListener("error", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + fragShaderUrl);
            });
            fragXHR.open("GET", fragShaderUrl);
            fragXHR.send();
        }
        get failed() { return this.vertFailed || this.fragFailed; }
        get loaded() { return this.vertLoaded && this.fragLoaded; }
    }
    Utils.ShaderLoader = ShaderLoader;
    class GLTypeInfo {
        constructor(type, baseType, components, sizeOfType) {
            this.type = type;
            this.baseType = baseType;
            this.components = components;
            this.sizeOfType = sizeOfType;
        }
        CreateArray(size) {
            switch (this.type) {
                case WebGLRenderingContext.FLOAT:
                case WebGLRenderingContext.FLOAT_VEC2:
                case WebGLRenderingContext.FLOAT_VEC3:
                case WebGLRenderingContext.FLOAT_VEC4:
                case WebGLRenderingContext.FLOAT_MAT2:
                case WebGLRenderingContext.FLOAT_MAT3:
                case WebGLRenderingContext.FLOAT_MAT4:
                    return new Float32Array(size);
                case WebGLRenderingContext.INT:
                case WebGLRenderingContext.INT_VEC2:
                case WebGLRenderingContext.INT_VEC3:
                case WebGLRenderingContext.INT_VEC4:
                    return new Int32Array(size);
                case WebGLRenderingContext.SHORT:
                    return new Int16Array(size);
                case WebGLRenderingContext.UNSIGNED_INT:
                    return new Uint32Array(size);
                case WebGLRenderingContext.UNSIGNED_SHORT:
                    return new Uint16Array(size);
                case WebGLRenderingContext.UNSIGNED_BYTE:
                    return new Uint8ClampedArray(size);
                case WebGLRenderingContext.BOOL:
                    return new Uint32Array(size);
            }
            return null;
        }
    }
    Utils.GLTypeInfo = GLTypeInfo;
    Utils.WebGLTypeInfo = new Map([
        [WebGLRenderingContext.BYTE, new GLTypeInfo(WebGLRenderingContext.BYTE, WebGLRenderingContext.BYTE, 1, 1)],
        [WebGLRenderingContext.UNSIGNED_BYTE, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_BYTE, WebGLRenderingContext.UNSIGNED_BYTE, 1, 1)],
        [WebGLRenderingContext.SHORT, new GLTypeInfo(WebGLRenderingContext.SHORT, WebGLRenderingContext.SHORT, 1, 2)],
        [WebGLRenderingContext.UNSIGNED_SHORT, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_SHORT, WebGLRenderingContext.UNSIGNED_SHORT, 1, 2)],
        [WebGLRenderingContext.INT, new GLTypeInfo(WebGLRenderingContext.INT, WebGLRenderingContext.INT, 1, 4)],
        [WebGLRenderingContext.UNSIGNED_INT, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        [WebGLRenderingContext.BOOL, new GLTypeInfo(WebGLRenderingContext.BOOL, WebGLRenderingContext.INT, 1, 4)],
        [WebGLRenderingContext.FLOAT, new GLTypeInfo(WebGLRenderingContext.FLOAT, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.FLOAT_VEC2, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC2, WebGLRenderingContext.FLOAT, 2, 4)],
        [WebGLRenderingContext.FLOAT_VEC3, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC3, WebGLRenderingContext.FLOAT, 3, 4)],
        [WebGLRenderingContext.FLOAT_VEC4, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC4, WebGLRenderingContext.FLOAT, 4, 4)],
        [WebGLRenderingContext.FLOAT_MAT2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2, WebGLRenderingContext.FLOAT, 4, 4)],
        [WebGLRenderingContext.FLOAT_MAT3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3, WebGLRenderingContext.FLOAT, 9, 4)],
        [WebGLRenderingContext.FLOAT_MAT4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4, WebGLRenderingContext.FLOAT, 16, 4)],
        // [WebGLRenderingContext.FLOAT_MAT2x3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2x3, WebGLRenderingContext.FLOAT, 6, 4)],
        // [WebGLRenderingContext.FLOAT_MAT2x4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2x4, WebGLRenderingContext.FLOAT, 8, 4)],
        // [WebGLRenderingContext.FLOAT_MAT3x2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3x2, WebGLRenderingContext.FLOAT, 6, 4)],
        // [WebGLRenderingContext.FLOAT_MAT3x4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3x4, WebGLRenderingContext.FLOAT, 12, 4)],
        // [WebGLRenderingContext.FLOAT_MAT4x2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4x2, WebGLRenderingContext.FLOAT, 8, 4)],
        // [WebGLRenderingContext.FLOAT_MAT4x3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4x3, WebGLRenderingContext.FLOAT, 12, 4)],
        // [WebGLRenderingContext.SAMPLER_1D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_1D, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.SAMPLER_2D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_2D, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_3D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_3D, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.SAMPLER_CUBE, new GLTypeInfo(WebGLRenderingContext.SAMPLER_CUBE, WebGLRenderingContext.FLOAT, 1, 4)],
    ]);
})(Utils || (Utils = {}));
// Fluxions WebGL Library
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
class Texture {
    constructor(_renderingContext, name, url, target, texture) {
        this._renderingContext = _renderingContext;
        this.name = name;
        this.url = url;
        this.target = target;
        this.texture = texture;
        this.id = "";
    }
    makeDefaultTexture() {
        let gl = this._renderingContext.gl;
        gl.bindTexture(this.target, this.texture);
        if (this.target == gl.TEXTURE_2D) {
            let black = [0, 0, 0, 255];
            let white = [255, 255, 255, 255];
            let check = new Uint8ClampedArray([...black, ...white, ...white, ...black]);
            gl.texImage2D(this.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(check, 2, 2));
        }
        else if (this.target == gl.TEXTURE_CUBE_MAP) {
            let red = new Uint8ClampedArray([255, 0, 0, 255]);
            let cyan = new Uint8ClampedArray([0, 255, 255, 255]);
            let green = new Uint8ClampedArray([0, 255, 0, 255]);
            let magenta = new Uint8ClampedArray([255, 0, 255, 255]);
            let blue = new Uint8ClampedArray([0, 0, 255, 255]);
            let yellow = new Uint8ClampedArray([255, 255, 0, 255]);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(cyan, 1, 1));
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(red, 1, 1));
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(magenta, 1, 1));
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(green, 1, 1));
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(yellow, 1, 1));
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(blue, 1, 1));
        }
        gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(this.target);
        gl.bindTexture(this.target, null);
    }
}
// Fluxions WebGL Library
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
/// <reference path="./Fluxions.ts" />
class ScenegraphNode {
    constructor(name = "unknown", parent = "unknown", geometryGroup = "") {
        this.name = name;
        this.parent = parent;
        this.geometryGroup = geometryGroup;
        this._transform = Matrix4.makeIdentity();
        this._pretransform = Matrix4.makeIdentity();
        this._posttransform = Matrix4.makeIdentity();
        this._worldMatrix = Matrix4.makeIdentity();
        this.newlyCreated = false;
    }
    get transform() { return this._transform; }
    get pretransform() { return this._pretransform; }
    get posttransform() { return this._posttransform; }
    get worldTransform() { return this._calcWorldMatrix(); }
    get position() { return this._worldMatrix.col3(3); }
    set transform(M) { this._transform.LoadMatrix(M); this._calcWorldMatrix(); }
    set pretransform(M) { this._pretransform.LoadMatrix(M); this._calcWorldMatrix(); }
    set posttransform(M) { this._posttransform.LoadMatrix(M); this._calcWorldMatrix(); }
    distance(otherNode) {
        return Vector3.distance(this.position, otherNode.position);
    }
    dirto(otherNode) {
        return Vector3.sub(otherNode.position, this.position);
    }
    _calcWorldMatrix() {
        this._worldMatrix.LoadMatrix(this.pretransform);
        this._worldMatrix.MultMatrix(this.transform);
        this._worldMatrix.MultMatrix(this.posttransform);
        return this._worldMatrix;
    }
}
// Fluxions WebGL Library
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
/// <reference path="./Fluxions.ts" />
var SGAssetType;
(function (SGAssetType) {
    SGAssetType[SGAssetType["Scene"] = 0] = "Scene";
    SGAssetType[SGAssetType["GeometryGroup"] = 1] = "GeometryGroup";
    SGAssetType[SGAssetType["MaterialLibrary"] = 2] = "MaterialLibrary";
    SGAssetType[SGAssetType["ShaderProgram"] = 3] = "ShaderProgram";
    SGAssetType[SGAssetType["Image"] = 4] = "Image";
    SGAssetType[SGAssetType["Text"] = 5] = "Text";
})(SGAssetType || (SGAssetType = {}));
;
class Scenegraph {
    constructor(_renderingContext) {
        this._renderingContext = _renderingContext;
        this.textfiles = [];
        this.imagefiles = [];
        this.shaderSrcFiles = [];
        this._fbo = new Map();
        this._renderConfigs = new Map();
        //private _cubeTextures: Map<string, WebGLTexture> = new Map<string, WebGLTexture>();
        this._textures = new Map();
        this._materials = new Map();
        this._sceneResources = new Map();
        this._nodes = [];
        this._meshes = new Map();
        this._tempNode = new ScenegraphNode("", "");
        this.textFiles = new Map();
        this.camera = new Camera();
        this.sunlight = new DirectionalLight();
        this.moonlight = new DirectionalLight();
        this._defaultRenderConfig = new RenderConfig(this._renderingContext, `attribute vec3 aPosition;
             void main() {
                 gl_Position = vec4(aPosition, 1.0);
            }
            `, `void main() {
                gl_FragColor = vec4(0.4, 0.3, 0.2, 1.0);
            }
            `);
        let widthPO2 = Math.pow(2.0, Math.floor(Math.log2(this._renderingContext.width)) + 1);
        let heightPO2 = Math.pow(2.0, Math.floor(Math.log2(this._renderingContext.height)) + 1);
        let gl = this._renderingContext.gl;
        this._defaultFBO = new FBO(this._renderingContext, true, true, 128, 128, 0);
        this._fbo.set("gbuffer", new FBO(this._renderingContext, true, true, this._renderingContext.width, this._renderingContext.height, gl.FLOAT));
        this._fbo.set("sunshadow", new FBO(this._renderingContext, true, true, 512, 512, gl.FLOAT));
        this._fbo.set("moonshadow", new FBO(this._renderingContext, true, true, 512, 512, gl.FLOAT));
        this._deferredMesh = new IndexedGeometryMesh(this._renderingContext);
        this._deferredMesh.SetTexCoord(Vector3.make(0.0, 0.0, 0.0));
        this._deferredMesh.AddVertex(Vector3.make(-1.0, -1.0, 0.0));
        this._deferredMesh.SetTexCoord(Vector3.make(1.0, 0.0, 0.0));
        this._deferredMesh.AddVertex(Vector3.make(1.0, -1.0, 0.0));
        this._deferredMesh.SetTexCoord(Vector3.make(1.0, 1.0, 0.0));
        this._deferredMesh.AddVertex(Vector3.make(1.0, 1.0, 0.0));
        this._deferredMesh.SetTexCoord(Vector3.make(0.0, 1.0, 0.0));
        this._deferredMesh.AddVertex(Vector3.make(-1.0, 1.0, 0.0));
        this._deferredMesh.SetMtllib("Floor10x10_mtl");
        this._deferredMesh.SetMtl("ConcreteFloor");
        this._deferredMesh.BeginSurface(gl.TRIANGLES);
        this._deferredMesh.AddIndex(0);
        this._deferredMesh.AddIndex(1);
        this._deferredMesh.AddIndex(2);
        this._deferredMesh.AddIndex(0);
        this._deferredMesh.AddIndex(2);
        this._deferredMesh.AddIndex(3);
        let t = gl.createTexture();
        if (!t) {
            throw "Unable to create default 2D texture.";
        }
        this._defaultT2D = new Texture(this._renderingContext, "", "", gl.TEXTURE_2D, t);
        this._defaultT2D.makeDefaultTexture();
        t = gl.createTexture();
        if (!t) {
            throw "Unable to create default Cube texture.";
        }
        this._defaultTCube = new Texture(this._renderingContext, "", "", gl.TEXTURE_CUBE_MAP, t);
        this._defaultTCube.makeDefaultTexture();
    }
    get moonlightFBO() { return this.getFBO("moonshadow"); }
    get sunlightFBO() { return this.getFBO("sunshadow"); }
    get gbufferFBO() { return this.getFBO("gbuffer"); }
    get loaded() {
        for (let t of this.textfiles) {
            if (!t.loaded)
                return false;
        }
        for (let i of this.imagefiles) {
            if (!i.loaded)
                return false;
        }
        for (let s of this.shaderSrcFiles) {
            if (!s.loaded)
                return false;
        }
        return true;
    }
    get failed() {
        for (let t of this.textfiles) {
            if (t.failed)
                return true;
        }
        for (let i of this.imagefiles) {
            if (i.failed)
                return true;
        }
        for (let s of this.shaderSrcFiles) {
            if (s.failed)
                return true;
        }
        return false;
    }
    get percentLoaded() {
        let a = 0;
        for (let t of this.textfiles) {
            if (t.loaded)
                a++;
        }
        for (let i of this.imagefiles) {
            if (i.loaded)
                a++;
        }
        for (let s of this.shaderSrcFiles) {
            if (s.loaded)
                a++;
        }
        return 100.0 * a / (this.textfiles.length + this.imagefiles.length + this.shaderSrcFiles.length);
    }
    Load(url) {
        let name = Utils.GetURLResource(url);
        let self = this;
        let assetType;
        let ext = Utils.GetExtension(name);
        let path = Utils.GetURLPath(url);
        if (ext == "scn")
            assetType = SGAssetType.Scene;
        else if (ext == "obj")
            assetType = SGAssetType.GeometryGroup;
        else if (ext == "mtl")
            assetType = SGAssetType.MaterialLibrary;
        else if (ext == "png")
            assetType = SGAssetType.Image;
        else if (ext == "jpg")
            assetType = SGAssetType.Image;
        else if (ext == "txt")
            assetType = SGAssetType.Text;
        else
            return;
        hflog.debug("Scenegraph::Load() => Requesting " + url);
        if (assetType == SGAssetType.Image) {
            if (this._textures.has(name))
                return;
            this.imagefiles.push(new Utils.ImageFileLoader(url, (data, name, assetType) => {
                self.processTextureMap(data, name, assetType);
                hflog.log("Loaded " + Math.round(self.percentLoaded) + "% " + name);
            }));
        }
        else {
            this.textfiles.push(new Utils.TextFileLoader(url, (data, name, assetType) => {
                self.processTextFile(data, name, path, assetType);
                hflog.log("Loaded " + Math.round(self.percentLoaded) + "% " + name);
            }, assetType));
        }
    }
    AddRenderConfig(name, vertshaderUrl, fragshaderUrl) {
        let self = this;
        this.shaderSrcFiles.push(new Utils.ShaderLoader(vertshaderUrl, fragshaderUrl, (vertShaderSource, fragShaderSource) => {
            this._renderConfigs.set(name, new RenderConfig(this._renderingContext, vertShaderSource, fragShaderSource));
            hflog.log("Loaded " + Math.round(self.percentLoaded) + "% " + vertshaderUrl + " and " + fragshaderUrl);
        }));
    }
    UseRenderConfig(name) {
        let rc = this._renderConfigs.get(name);
        if (rc) {
            rc.Use();
            return rc;
        }
        return null; //this._defaultRenderConfig;
    }
    GetMaterial(mtllib, mtl) {
        for (let ml of this._materials) {
            if (ml["0"] == mtllib + mtl) {
                return ml["1"];
            }
        }
        return null;
    }
    UseMaterial(rc, mtllib, mtl) {
        let gl = this._renderingContext.gl;
        for (let ml of this._materials) {
            if (ml["0"] == mtllib + mtl) {
                let m = ml["1"];
                let tnames = ["map_Kd", "map_Ks", "map_normal"];
                let textures = [m.map_Kd, m.map_Ks, m.map_normal];
                for (let i = 0; i < textures.length; i++) {
                    rc.SetUniform1i(tnames[i], i);
                    gl.activeTexture(gl.TEXTURE0 + i);
                    gl.bindTexture(gl.TEXTURE_2D, this._defaultT2D.texture);
                    if (textures[i].length == 0)
                        continue;
                    let loc = rc.GetUniformLocation(tnames[i]);
                    if (loc) {
                        this.UseTexture(textures[i], i);
                    }
                }
                let v1fnames = ["map_Kd_mix", "map_Ks_mix", "map_normal_mix", "PBKdm", "PBKsm", "PBn2", "PBk2"];
                let v1fvalues = [m.map_Kd_mix, m.map_Ks_mix, m.map_normal_mix, m.PBKdm, m.PBKsm, m.PBn2, m.PBk2];
                for (let i = 0; i < v1fnames.length; i++) {
                    let uloc = rc.GetUniformLocation(v1fnames[i]);
                    if (uloc) {
                        rc.SetUniform1f(v1fnames[i], v1fvalues[i]);
                    }
                }
                let v3fnames = ["Kd", "Ks", "Ka"];
                let v3fvalues = [m.Kd, m.Ks, m.Ka];
                for (let i = 0; i < v3fnames.length; i++) {
                    let uloc = rc.GetUniformLocation(v3fnames[i]);
                    if (uloc) {
                        rc.SetUniform3f(v3fnames[i], v3fvalues[i]);
                    }
                }
            }
        }
    }
    RenderMesh(name, rc) {
        if (name.length == 0) {
            for (let mesh of this._meshes) {
                mesh["1"].Render(rc, this);
            }
            return;
        }
        let mesh = this._meshes.get(name);
        if (mesh) {
            mesh.Render(rc, this);
        }
    }
    UseTexture(textureName, unit, enable = true) {
        let texunit = unit | 0;
        let gl = this._renderingContext.gl;
        let result = false;
        let minFilter = gl.LINEAR_MIPMAP_LINEAR;
        let magFilter = gl.LINEAR;
        if (unit <= 31) {
            unit += gl.TEXTURE0;
        }
        gl.activeTexture(unit);
        let t = this._textures.get(textureName);
        if (!t) {
            let alias = this._sceneResources.get(textureName);
            if (alias) {
                t = this._textures.get(alias);
            }
        }
        if (t) {
            if (unit <= 31) {
                unit += gl.TEXTURE0;
            }
            gl.activeTexture(unit);
            if (enable) {
                gl.bindTexture(t.target, t.texture);
                gl.texParameteri(t.target, gl.TEXTURE_MIN_FILTER, minFilter);
                gl.texParameteri(t.target, gl.TEXTURE_MAG_FILTER, magFilter);
                result = true;
            }
            else {
                gl.bindTexture(t.target, null);
            }
        }
        if (!t) {
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        }
        gl.activeTexture(gl.TEXTURE0);
        return result;
    }
    HasNode(parentName, objectName) {
        for (let node of this._nodes) {
            if (parentName.length > 0 && node.parent != parentName) {
                continue;
            }
            if (node.name.length > 0 && node.name == objectName) {
                node.newlyCreated = false;
                return node;
            }
        }
        return null;
    }
    GetNode(parentName, objectName) {
        let node = this.HasNode(parentName, objectName);
        if (node)
            return node;
        node = new ScenegraphNode(objectName, parentName);
        return this.AddNode(node);
    }
    AddNode(newNode) {
        newNode.newlyCreated = true;
        this._nodes.push(newNode);
        return newNode;
    }
    ClearNodes() {
        this._nodes.length = 0;
    }
    GetMesh(meshName) {
        let mesh = this._meshes.get(meshName);
        if (!mesh) {
            mesh = new IndexedGeometryMesh(this._renderingContext);
            this._meshes.set(meshName, mesh);
        }
        return mesh;
    }
    SetGlobalParameters(rc) {
        let gl = this._renderingContext.gl;
        if (rc) {
            rc.Use();
            rc.SetUniform1f("uWindowWidth", this._renderingContext.width);
            rc.SetUniform1f("uWindowHeight", this._renderingContext.height);
            rc.SetUniform1f("uWindowCenterX", this._renderingContext.width * 0.5);
            rc.SetUniform1f("uWindowCenterY", this._renderingContext.height * 0.5);
            rc.SetUniform3f("SunDirTo", this.sunlight.direction);
            rc.SetUniform3f("SunE0", this.sunlight.E0);
            rc.SetUniform3f("MoonDirTo", this.moonlight.direction);
            rc.SetUniform3f("MoonE0", this.moonlight.E0);
            this.camera.aspectRatio = this._renderingContext.aspectRatio;
            rc.SetMatrix4f("ProjectionMatrix", this.camera.projection);
            rc.SetMatrix4f("CameraMatrix", this.camera.transform);
            rc.SetUniform3f("CameraPosition", this.camera.eye);
            if (this._textures.has("enviroCube")) {
                this.UseTexture("enviroCube", 10);
            }
            else {
                gl.activeTexture(gl.TEXTURE10);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._defaultTCube.texture);
            }
            rc.SetUniform1i("EnviroCube", 10);
            rc.SetUniform1i("UsingGBuffer", 0);
            const GBUFFER_COLOR_TEXUNIT = 11;
            const GBUFFER_DEPTH_TEXUNIT = 12;
            const SUNLIGHT_COLOR_TEXUNIT = 13;
            const SUNLIGHT_DEPTH_TEXUNIT = 14;
            const MOONLIGHT_COLOR_TEXUNIT = 15;
            const MOONLIGHT_DEPTH_TEXUNIT = 16;
            if (!rc.usesFBO) {
                if (this.gbufferFBO.complete) {
                    this.gbufferFBO.bindTextures(GBUFFER_COLOR_TEXUNIT, GBUFFER_DEPTH_TEXUNIT);
                    if (this.gbufferFBO.color)
                        rc.SetUniform1i("GBufferColor0", GBUFFER_COLOR_TEXUNIT);
                    if (this.gbufferFBO.depth)
                        rc.SetUniform1i("GBufferDepth", GBUFFER_DEPTH_TEXUNIT);
                    rc.SetUniform2f("iResolutionGBuffer", this.gbufferFBO.dimensions);
                    rc.SetUniform1i("UsingGBuffer", 1);
                }
                if (this.sunlightFBO.complete) {
                    this.sunlightFBO.bindTextures(13, 14);
                    if (this.sunlightFBO.color)
                        rc.SetUniform1i("SunShadowColorMap", SUNLIGHT_COLOR_TEXUNIT);
                    if (this.sunlightFBO.depth)
                        rc.SetUniform1i("SunShadowDepthMap", SUNLIGHT_DEPTH_TEXUNIT);
                    rc.SetMatrix4f("SunShadowBiasMatrix", Matrix4.makeShadowBias());
                    rc.SetMatrix4f("SunShadowProjectionMatrix", this.sunlight.projectionMatrix);
                    rc.SetMatrix4f("SunShadowViewMatrix", this.sunlight.lightMatrix);
                    rc.SetUniform2f("iResolutionSunShadow", this.sunlightFBO.dimensions);
                }
                if (this.moonlightFBO.complete) {
                    this.moonlightFBO.bindTextures(15, 16);
                    if (this.sunlightFBO.color)
                        rc.SetUniform1i("SunShadowColorMap", MOONLIGHT_COLOR_TEXUNIT);
                    if (this.sunlightFBO.depth)
                        rc.SetUniform1i("SunShadowDepthMap", MOONLIGHT_DEPTH_TEXUNIT);
                    rc.SetMatrix4f("SunShadowBiasMatrix", Matrix4.makeShadowBias());
                    rc.SetMatrix4f("SunShadowProjectionMatrix", this.sunlight.projectionMatrix);
                    rc.SetMatrix4f("SunShadowViewMatrix", this.sunlight.lightMatrix);
                    rc.SetUniform2f("iResolutionSunShadow", this.sunlightFBO.dimensions);
                }
            }
            else {
                gl.activeTexture(gl.TEXTURE11);
                gl.bindTexture(gl.TEXTURE11, this._defaultT2D.texture);
                gl.activeTexture(gl.TEXTURE12);
                gl.bindTexture(gl.TEXTURE12, this._defaultT2D.texture);
                gl.activeTexture(gl.TEXTURE13);
                gl.bindTexture(gl.TEXTURE13, this._defaultT2D.texture);
                gl.activeTexture(gl.TEXTURE14);
                gl.bindTexture(gl.TEXTURE14, this._defaultT2D.texture);
                gl.activeTexture(gl.TEXTURE15);
                gl.bindTexture(gl.TEXTURE15, this._defaultT2D.texture);
                gl.activeTexture(gl.TEXTURE16);
                gl.bindTexture(gl.TEXTURE16, this._defaultT2D.texture);
                if (this.gbufferFBO.color)
                    rc.SetUniform1i("GBufferColor0", GBUFFER_COLOR_TEXUNIT);
                if (this.gbufferFBO.depth)
                    rc.SetUniform1i("GBufferDepth", GBUFFER_DEPTH_TEXUNIT);
                if (this.sunlightFBO.color)
                    rc.SetUniform1i("SunShadowColorMap", SUNLIGHT_COLOR_TEXUNIT);
                if (this.sunlightFBO.depth)
                    rc.SetUniform1i("SunShadowDepthMap", SUNLIGHT_DEPTH_TEXUNIT);
                if (this.moonlightFBO.color)
                    rc.SetUniform1i("SunShadowColorMap", MOONLIGHT_COLOR_TEXUNIT);
                if (this.moonlightFBO.depth)
                    rc.SetUniform1i("SunShadowDepthMap", MOONLIGHT_DEPTH_TEXUNIT);
            }
        }
    }
    Restore() {
        let gl = this._renderingContext.gl;
        for (let i = 0; i < 10; i++) {
            gl.activeTexture(i + gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.UseTexture("enviroCube", 10, false);
        if (this.sunlightFBO.complete) {
            this.sunlightFBO.unbindTextures();
        }
        if (this.gbufferFBO.complete) {
            this.gbufferFBO.unbindTextures();
        }
    }
    // RenderScene(shaderName: string, sceneName: string) {
    //     let rc = this.UseRenderConfig(shaderName);
    //     if (!rc || !rc.usable) {
    //         //hflog.error("Scenegraph::RenderScene(): \"" + shaderName + "\" is not a render config");
    //         return;
    //     }
    RenderScene(rc, sceneName) {
        for (let node of this._nodes) {
            if (sceneName.length > 0 && node.parent != sceneName) {
                continue;
            }
            rc.SetMatrix4f("WorldMatrix", node.worldTransform);
            let mesh = this._meshes.get(node.geometryGroup);
            if (mesh) {
                mesh.Render(rc, this);
            }
        }
        rc.Restore();
    }
    RenderDeferred(shaderName) {
        let rc = this.UseRenderConfig(shaderName);
        if (!rc || !rc.usable) {
            //hflog.error("Scenegraph::RenderDeferred(): \"" + shaderName + "\" is not a render config");
            return;
        }
        let gl = this._renderingContext.gl;
        gl.disable(gl.DEPTH_TEST);
        rc.SetMatrix4f("ProjectionMatrix", Matrix4.makeOrtho2D(-1.0, 1.0, -1.0, 1.0));
        rc.SetMatrix4f("CameraMatrix", Matrix4.makeLookAt(Vector3.make(0.0, 0.0, 1.0), Vector3.make(0.0, 0.0, 0.0), Vector3.make(0.0, 1.0, 0.0)));
        rc.SetMatrix4f("WorldMatrix", Matrix4.makeTranslation(0.0, 0.0, 0.0));
        this._deferredMesh.Render(rc, this);
        rc.Restore();
    }
    processTextFile(data, name, path, assetType) {
        let textParser = new Utils.TextParser(data);
        switch (assetType) {
            // ".SCN"
            case SGAssetType.Scene:
                this.loadScene(textParser.lines, name, path);
                break;
            // ".OBJ"
            case SGAssetType.GeometryGroup:
                this.loadOBJ(textParser.lines, name, path);
                break;
            // ".MTL"
            case SGAssetType.MaterialLibrary:
                this.loadMTL(textParser.lines, name, path);
                break;
            case SGAssetType.Text:
                this.textFiles.set(name, textParser.lines);
                break;
        }
    }
    processTextureMap(image, name, assetType) {
        let gl = this._renderingContext.gl;
        let minFilter = gl.NEAREST;
        let magFilter = gl.NEAREST;
        let maxAnisotropy = 1.0;
        let ext = this._renderingContext.GetExtension("EXT_texture_filter_anisotropic");
        if (ext) {
            let maxAnisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        }
        else {
            hflog.debug("cannot use anisotropic filtering");
        }
        if (image.width == 6 * image.height) {
            let images = new Array(6);
            Utils.SeparateCubeMapImages(image, images);
            let texture = gl.createTexture();
            if (texture) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                for (let i = 0; i < 6; i++) {
                    if (!images[i]) {
                        continue;
                    }
                    else {
                        hflog.debug("image " + i + " w:" + images[i].width + "/h:" + images[i].height);
                    }
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                let t = new Texture(this._renderingContext, name, name, gl.TEXTURE_CUBE_MAP, texture);
                this._textures.set(name, t);
            }
        }
        else {
            let texture = gl.createTexture();
            if (texture) {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
                if (ext) {
                    gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, maxAnisotropy);
                }
                let t = new Texture(this._renderingContext, name, name, gl.TEXTURE_2D, texture);
                this._textures.set(name, t);
            }
        }
    }
    loadScene(lines, name, path) {
        // sundir <direction: Vector3>
        // camera <eye: Vector3> <center: Vector3> <up: Vector3>
        // transform <worldMatrix: Matrix4>
        // o <objectName: string>
        // geometryGroup <objUrl: string>
        for (let tokens of lines) {
            if (tokens[0] == "enviroCube") {
                this._sceneResources.set("enviroCube", Utils.GetURLResource(tokens[1]));
                this.Load(path + tokens[1]);
            }
            else if (tokens[0] == "cameraLookAt") {
                let eye = Utils.TextParser.ParseVector(tokens);
                let center = Utils.TextParser.ParseVector(tokens);
                let up = Utils.TextParser.ParseVector(tokens);
                this.camera.setLookAt(eye, center, up);
            }
            else if (tokens[0] == "cameraFOV") {
                this.camera.angleOfView = Utils.TextParser.ParseFloat(tokens);
            }
            else if (tokens[0] == "sunDirTo") {
                this.sunlight.dirto = Utils.TextParser.ParseVector(tokens);
            }
            else if (tokens[0] == "sunE0") {
                this.sunlight.E0 = Utils.TextParser.ParseVector(tokens);
            }
            else if (tokens[0] == "moonDirTo") {
                this.moonlight.dirto = Utils.TextParser.ParseVector(tokens);
            }
            else if (tokens[0] == "moonE0") {
                this.moonlight.E0 = Utils.TextParser.ParseVector(tokens);
            }
            else if (tokens[0] == "sprite" || tokens[0] == "texture") {
                this.Load(path + tokens[1]);
            }
            else if (tokens[0] == "transform") {
                this._tempNode.transform = Utils.TextParser.ParseMatrix(tokens);
            }
            else if (tokens[0] == "loadIdentity") {
                this._tempNode.transform.LoadIdentity();
            }
            else if (tokens[0] == "translate") {
                let v = Utils.TextParser.ParseVector(tokens);
                this._tempNode.transform.Translate(v.x, v.y, v.z);
            }
            else if (tokens[0] == "rotate") {
                let v = Utils.TextParser.ParseArray(tokens);
                if (v.length >= 4) {
                    this._tempNode.transform.Rotate(v[0], v[1], v[2], v[3]);
                }
            }
            else if (tokens[0] == "rotatex") {
                let angle = Utils.TextParser.ParseFloat(tokens);
                this._tempNode.transform.Rotate(angle, 1, 0, 0);
            }
            else if (tokens[0] == "rotatey") {
                let angle = Utils.TextParser.ParseFloat(tokens);
                this._tempNode.transform.Rotate(angle, 0, 1, 0);
            }
            else if (tokens[0] == "rotatez") {
                let angle = Utils.TextParser.ParseFloat(tokens);
                this._tempNode.transform.Rotate(angle, 0, 0, 1);
            }
            else if (tokens[0] == "scale") {
                let scale = Utils.TextParser.ParseVector(tokens);
                this._tempNode.transform.Scale(scale.x, scale.y, scale.z);
            }
            else if (tokens[0] == "o") {
                this._tempNode = new ScenegraphNode();
                if (tokens.length >= 2) {
                    this._tempNode.name = tokens[1];
                }
            }
            else if (tokens[0] == "geometryGroup") {
                this._tempNode.parent = name;
                if (this._tempNode.name.length == 0) {
                    this._tempNode.name = tokens[1];
                }
                this._tempNode.geometryGroup = tokens[1];
                this.Load(path + tokens[1]);
                let node = this.GetNode(this._tempNode.parent, this._tempNode.name);
                node.geometryGroup = this._tempNode.geometryGroup;
                node.transform = this._tempNode.transform;
                this._tempNode = new ScenegraphNode();
            }
            else if (tokens[0] == "node") {
                this._tempNode.parent = name;
                this._tempNode.name = tokens[1];
                this._tempNode.geometryGroup = tokens[2];
                let node = this.GetNode(this._tempNode.parent, this._tempNode.name);
                node.geometryGroup = this._tempNode.geometryGroup;
                node.transform = this._tempNode.transform;
                this._tempNode = new ScenegraphNode();
            }
            else if (tokens[0] == "renderconfig") {
                let name = tokens[1];
                let vertShaderUrl = tokens[2];
                let fragShaderUrl = tokens[3];
                this.AddRenderConfig(name, vertShaderUrl, fragShaderUrl);
            }
        }
    }
    loadOBJ(lines, name, path) {
        // mtllib <mtlUrl: string>
        // usemtl <name: string>
        // v <position: Vector3>
        // vn <normal: Vector3>
        // vt <texcoord: Vector2|Vector3>
        // vc <color: Vector4>
        // f <v1: number> <v2: number> <v3: number>
        // f <v1: number>/<vt1:number> <v2: number>/<vt2:number> <v2: number>/<vt2:number>
        // f <v1: number>//<vt1:number> <v2: number>//<vt2:number> <v2: number>//<vt2:number>
        // f <v1: number>/<vn1:number>/<vt1:number> <v2: number>/<vn2:number>/<vt2:number> <v2: number>/<vn3:number>/<vt2:number>
        // o <objectName: string>
        // g <newSmoothingGroup: string>
        // s <newSmoothingGroup: string>
        let gl = this._renderingContext.gl;
        let positions = [];
        let normals = [];
        let colors = [];
        let texcoords = [];
        let mesh = new IndexedGeometryMesh(this._renderingContext);
        // in case there are no mtllib's, usemtl's, o's, g's, or s's
        mesh.BeginSurface(gl.TRIANGLES);
        for (let tokens of lines) {
            if (tokens.length >= 3) {
                if (tokens[0] == "v") {
                    positions.push(Utils.TextParser.ParseVector(tokens));
                }
                else if (tokens[0] == "vn") {
                    normals.push(Utils.TextParser.ParseVector(tokens));
                }
                else if (tokens[0] == "vt") {
                    texcoords.push(Utils.TextParser.ParseVector(tokens));
                }
                else if (tokens[0] == "f") {
                    let indices = Utils.TextParser.ParseFace(tokens);
                    for (let i = 0; i < 3; i++) {
                        try {
                            if (indices[i * 3 + 2] >= 0)
                                mesh.SetNormal(normals[indices[i * 3 + 2]]);
                            if (indices[i * 3 + 1] >= 0)
                                mesh.SetTexCoord(texcoords[indices[i * 3 + 1]]);
                            mesh.AddVertex(positions[indices[i * 3 + 0]]);
                            mesh.AddIndex(-1);
                        }
                        catch (s) {
                            hflog.debug(s);
                        }
                    }
                }
            }
            else if (tokens.length >= 2) {
                if (tokens[0] == "mtllib") {
                    this.Load(path + tokens[1]);
                    mesh.SetMtllib(Utils.TextParser.ParseIdentifier(tokens));
                    mesh.BeginSurface(gl.TRIANGLES);
                }
                else if (tokens[0] == "usemtl") {
                    mesh.SetMtl(Utils.TextParser.ParseIdentifier(tokens));
                    mesh.BeginSurface(gl.TRIANGLES);
                }
                else if (tokens[0] == "o") {
                    mesh.BeginSurface(gl.TRIANGLES);
                }
                else if (tokens[0] == "g") {
                    mesh.BeginSurface(gl.TRIANGLES);
                }
                else if (tokens[0] == "s") {
                    mesh.BeginSurface(gl.TRIANGLES);
                }
            }
        }
        mesh.BuildBuffers();
        this._meshes.set(name, mesh);
    }
    loadMTL(lines, name, path) {
        // newmtl <name: string>
        // Kd <color: Vector3>
        // Ks <color: Vector3>
        // map_Kd <url: string>
        // map_Ks <url: string>
        // map_normal <url: string>
        let mtl = "";
        let mtllib = Utils.TextParser.MakeIdentifier(name);
        let curmtl;
        for (let tokens of lines) {
            if (tokens.length >= 2) {
                if (tokens[0] == "newmtl") {
                    mtl = tokens[1];
                    curmtl = new Material(mtl);
                    this._materials.set(mtllib + mtl, curmtl);
                }
                else if (tokens[0] == "map_Kd") {
                    if (curmtl) {
                        curmtl.map_Kd = Utils.GetURLResource(tokens[1]);
                        curmtl.map_Kd_mix = 1.0;
                    }
                    this.Load(path + tokens[1]);
                }
                else if (tokens[0] == "map_Ks") {
                    if (curmtl) {
                        curmtl.map_Ks = Utils.GetURLResource(tokens[1]);
                        curmtl.map_Ks_mix = 1.0;
                    }
                    this.Load(path + tokens[1]);
                }
                else if (tokens[0] == "map_normal") {
                    if (curmtl) {
                        curmtl.map_normal = Utils.GetURLResource(tokens[1]);
                        curmtl.map_normal_mix = 1.0;
                    }
                    this.Load(path + tokens[1]);
                }
                else if (tokens[0] == "Kd") {
                    if (curmtl) {
                        curmtl.Kd = Utils.TextParser.ParseVector(tokens);
                    }
                }
                else if (tokens[0] == "Ks") {
                    if (curmtl) {
                        curmtl.Ks = Utils.TextParser.ParseVector(tokens);
                    }
                }
                else if (tokens[0] == "Ka") {
                    if (curmtl) {
                        curmtl.Ka = Utils.TextParser.ParseVector(tokens);
                    }
                }
                else if (tokens[0] == "PBn2") {
                    if (curmtl) {
                        curmtl.PBn2 = parseFloat(tokens[1]);
                    }
                }
                else if (tokens[0] == "PBk2") {
                    if (curmtl) {
                        curmtl.PBk2 = parseFloat(tokens[1]);
                    }
                }
                else if (tokens[0] == "map_Kd_mix") {
                    if (curmtl) {
                        curmtl.map_Kd_mix = parseFloat(tokens[1]);
                    }
                }
                else if (tokens[0] == "map_Ks_mix") {
                    if (curmtl) {
                        curmtl.map_Ks_mix = parseFloat(tokens[1]);
                    }
                }
                else if (tokens[0] == "map_normal_mix") {
                    if (curmtl) {
                        curmtl.map_normal_mix = parseFloat(tokens[1]);
                    }
                }
            }
        }
    }
    getFBO(name) {
        let fbo = this._fbo.get(name);
        if (!fbo)
            return this._defaultFBO;
        return fbo;
    }
}
// Fluxions WebGL Library
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
/// <reference path="../misc/Hatchetfish.ts" />
/// <reference path="../gte/GTE.ts" />
/// <reference path="RenderingContext.ts" />
/// <reference path="RenderConfig.ts" />
/// <reference path="Camera.ts" />
/// <reference path="Surface.ts" />
/// <reference path="Vertex.ts" />
/// <reference path="Material.ts" />
/// <reference path="FBO.ts" />
/// <reference path="DirectionalLight.ts" />
/// <reference path="Colors.ts" />
/// <reference path="IndexedGeometryMesh.ts" />
/// <reference path="MatrixStack.ts" />
/// <reference path="Utils.ts" />
/// <reference path="Texture.ts" />
/// <reference path="ScenegraphNode.ts" />
/// <reference path="Scenegraph.ts" />
// Fluxions WebGL Library
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
/// <reference path="./Fluxions.ts" />
class Camera {
    constructor() {
        this._transform = Matrix4.makeIdentity();
        this._center = new Vector3();
        this._eye = new Vector3(0.0, 0.0, 10.0);
        this._angleOfView = 45.0;
        this._aspectRatio = 1.0;
        this._znear = 1.0;
        this._zfar = 100.0;
        this.projection = Matrix4.makePerspectiveY(this._angleOfView, this._aspectRatio, this._znear, this._zfar);
        this.pretransform = Matrix4.makeIdentity();
        this.posttransform = Matrix4.makeIdentity();
    }
    get transform() { return Matrix4.multiply3(this.pretransform, this._transform, this.posttransform); }
    set aspectRatio(ar) {
        this._aspectRatio = Math.max(0.001, ar);
        this.projection = Matrix4.makePerspectiveY(this._angleOfView, this._aspectRatio, this._znear, this._zfar);
    }
    set angleOfView(angleInDegrees) {
        this._angleOfView = Math.max(1.0, angleInDegrees);
        this.projection = Matrix4.makePerspectiveY(this._angleOfView, this._aspectRatio, this._znear, this._zfar);
    }
    set zfar(z) {
        this._zfar = Math.max(z, 0.001);
        let znear = Math.min(this._znear, this._zfar);
        let zfar = Math.max(this._znear, this._zfar);
        this._znear = znear;
        this._zfar = zfar;
        this.projection = Matrix4.makePerspectiveY(this._angleOfView, this._aspectRatio, this._znear, this._zfar);
    }
    set znear(z) {
        this._znear = Math.max(z, 0.001);
        let znear = Math.min(this._znear, this._zfar);
        let zfar = Math.max(this._znear, this._zfar);
        this._znear = znear;
        this._zfar = zfar;
        this.projection = Matrix4.makePerspectiveY(this._angleOfView, this._aspectRatio, this._znear, this._zfar);
    }
    get position() {
        return this._transform.col3(3);
    }
    get right() {
        return this._transform.col3(0);
    }
    get left() {
        return this._transform.col3(0).neg();
    }
    get up() {
        return this._transform.col3(1);
    }
    get down() {
        return this._transform.col3(1).neg();
    }
    get forward() {
        return this._transform.col3(2);
    }
    get backward() {
        return this._transform.col3(2).neg();
    }
    get eye() {
        return this._transform.asInverse().row3(3);
    }
    set eye(p) {
        this._eye = p.clone();
        this._transform = Matrix4.makeLookAt(this._eye, this._center, this.up);
        this._eye = this._transform.col3(3);
    }
    set center(p) {
        this._center = p;
        this._transform.LookAt(this._eye, this._center, this.up);
    }
    moveTo(position) {
        this._transform.m14 = position.x;
        this._transform.m24 = position.y;
        this._transform.m34 = position.z;
    }
    move(delta) {
        let tx = this.right.mul(delta.x);
        let ty = this.up.mul(delta.y);
        let tz = this.forward.mul(delta.z);
        this._transform.Translate(tx.x, tx.y, tx.z);
        this._transform.Translate(ty.x, ty.y, ty.z);
        this._transform.Translate(tz.x, tz.y, tz.z);
        return this.position;
    }
    turn(delta) {
        let m = Matrix4.makeIdentity();
        m.Rotate(delta.x, 1, 0, 0);
        m.Rotate(delta.y, 0, 1, 0);
        m.Rotate(delta.z, 0, 0, 1);
        this._transform.MultMatrix(m);
    }
    setOrbit(azimuthInDegrees, pitchInDegrees, distance) {
        this._transform.LoadIdentity();
        this._transform.Rotate(azimuthInDegrees, 0.0, 1.0, 0.0);
        this._transform.Rotate(pitchInDegrees, 1.0, 0.0, 0.0);
        this._transform.Translate(0.0, 0.0, -distance);
        return this._transform.clone();
    }
    setLookAt(eye, center, up) {
        this._transform.LoadIdentity();
        this._transform.LookAt(eye, center, up);
        return this._transform.clone();
    }
}
/// <reference path="../gte/GTE.ts" />
const PLAYER = 0;
const THINCAMEL = 1;
const NORMALCAMEL = 2;
const FATCAMEL = 3;
const ARROW = 4;
const RICESACK = 5;
const RICEBOWL = 6;
const GRAVESTONE = 7;
const GEM = 8;
const RUBY = 9;
const GOLD = 10;
const SNOW = 11;
const BUSH = 12;
const CACTUS = 13;
const TREE = 14;
const PLANT = 15;
const ROCK = 16;
const SCORPION = 17;
const PIRATE = 18;
const NINJA = 19;
const TIGER = 20;
const DOG = 21;
const EAGLE = 22;
const SNAKE = 23;
const MAX_SPRITES = 24;
const TERRAIN_START = SNOW;
const TERRAIN_END = ROCK;
const ENEMY_START = SCORPION;
const ENEMY_END = SNAKE;
const MAX_CAMELS = 16;
const MAX_ENEMIES = 32;
const MAX_KIBBLES = 128;
const MAX_TERRAIN = 32;
const MAX_MISSILES = 4;
const KIBBLES_PER_EXPLOSION = 16;
const KIBBLE_SPEED = 64;
const KIBBLE_GRAVITY = 16;
const ENEMY_SPEED = 32;
const MISSILE_SPEED = 512;
const PLAYER_SPEED = 128;
function CreateSprites() {
    let sprites = new Array(MAX_SPRITES);
    sprites[PLAYER] = [2, 2];
    sprites[THINCAMEL] = [0, 1];
    sprites[NORMALCAMEL] = [8, 9];
    sprites[FATCAMEL] = [16, 17];
    sprites[GRAVESTONE] = [3, 3];
    sprites[SCORPION] = [4, 5];
    sprites[PIRATE] = [6, 6];
    sprites[NINJA] = [14, 14];
    sprites[RICESACK] = [7, 7];
    sprites[RICEBOWL] = [15, 15];
    sprites[TIGER] = [10, 11];
    sprites[DOG] = [12, 13];
    sprites[EAGLE] = [24, 25];
    sprites[SNAKE] = [18, 19];
    sprites[ARROW] = [20, 20];
    sprites[GEM] = [21, 21];
    sprites[RUBY] = [22, 22];
    sprites[GOLD] = [23, 23];
    sprites[SNOW] = [26, 26];
    sprites[BUSH] = [27, 27];
    sprites[CACTUS] = [28, 28];
    sprites[TREE] = [29, 29];
    sprites[PLANT] = [30, 30];
    sprites[ROCK] = [31, 31];
    return sprites;
}
/// <reference path="./Common.ts" />
class ActionGame {
    constructor(XOR) {
        this.XOR = XOR;
        this.camels = new Array(MAX_CAMELS);
        this.player = new Sprite(PLAYER);
        this.enemies = new Array(MAX_ENEMIES);
        this.kibbles = new Array(MAX_KIBBLES);
        this.terrain = new Array(MAX_TERRAIN);
        this.missiles = new Array(MAX_MISSILES);
        this.lastKibble = Vector3.make(0, 0, 0);
        this.animframe = 0;
        this.numCamels = 0;
        this.numEnemies = 0;
        this.score = 0;
        this.camelLocation = Vector3.make(64, 256, 0);
        this.playerLocation = Vector3.make(64, 256, 0);
        this.playerField = Vector2.make(64, 192);
        this.init();
    }
    init() {
        this.score = 0;
        this.numCamels = 0;
        this.numEnemies = 0;
        this.animframe = 0;
        this.sprites = CreateSprites();
        this.player = new Sprite(this.sprites[PLAYER][0]);
        this.player.position.reset(64 + GTE.rand1() * this.playerField.x, this.XOR.height / 2 + GTE.rand1() * this.playerField.y);
        for (let i = 0; i < MAX_CAMELS; i++) {
            this.camels[i] = new Sprite(0);
            this.camels[i].alive = GTE.random(1, 5) | 0;
            this.numCamels++;
            this.camels[i].position.x = this.camelLocation.x + GTE.random(-32, 32);
            this.camels[i].position.y = this.camelLocation.y + GTE.random(-128, 128);
        }
        for (let i = 0; i < MAX_ENEMIES; i++) {
            this.enemies[i] = new Sprite(0);
            this.enemies[i].type = GTE.random(ENEMY_START, ENEMY_END) | 0;
            this.enemies[i].alive = 0;
            this.enemies[i].position.x = GTE.random(this.XOR.width, 2 * this.XOR.width);
            this.enemies[i].position.y = GTE.random(0, this.XOR.height - 32);
            this.numEnemies++;
        }
        for (let i = 0; i < MAX_KIBBLES; i++) {
            this.kibbles[i] = new Sprite(31);
        }
        for (let i = 0; i < MAX_MISSILES; i++) {
            this.missiles[i] = new Sprite(20);
            this.missiles[i].alive = 0;
            this.missiles[i].velocity.reset(PLAYER_SPEED * 4, 0);
        }
    }
    get lost() {
        if (this.player.alive <= 0)
            return true;
        if (this.numCamels <= 0)
            return true;
        return false;
    }
    get won() {
        if (this.player.alive <= 0)
            return false;
        if (this.numCamels <= 0)
            return false;
        if (this.numEnemies > 0)
            return false;
        return true;
    }
    startKibbles(x, y) {
        this.lastKibble.x = x;
        this.lastKibble.y = y;
        for (let num = 0; num < KIBBLES_PER_EXPLOSION; num++) {
            let i = (GTE.rand01() * MAX_KIBBLES) | 0;
            this.kibbles[i].alive = 1;
            this.kibbles[i].position.reset(x, y);
            this.kibbles[i].refpoint.reset(x, y);
            this.kibbles[i].velocity.reset(GTE.random(-KIBBLE_SPEED / 2, KIBBLE_SPEED / 2), -GTE.random(KIBBLE_SPEED, KIBBLE_SPEED * 2));
            this.kibbles[i].timealive = this.XOR.t1;
        }
    }
    startMissile(x, y, dir) {
        let alive = this.XOR.t1;
        let best = 0;
        for (let i = 0; i < this.missiles.length; i++) {
            let missile = this.missiles[i];
            if (missile.alive <= 0) {
                best = i;
                break;
            }
            if (alive > missile.timealive) {
                best = i;
                alive = missile.timealive;
            }
        }
        let missile = this.missiles[best];
        missile.position.reset(x, y);
        let v = dir.norm().mul(MISSILE_SPEED);
        missile.velocity.reset(v.x, v.y);
        missile.alive = 1;
    }
    update() {
        let t1 = this.XOR.t1 * 3.14159;
        this.animframe = Math.sin(t1) > 0.0 ? 1 : 0;
        this.updateCamels(t1);
        this.updateEnemies(t1);
        this.updatePlayer(t1);
        this.updateKibbles(t1);
        this.updateMissiles(t1);
    }
    updatePlayer(t1) {
        let dx = this.XOR.Input.getkey2(KEY_LEFT, KEY_RIGHT);
        let dy = this.XOR.Input.getkey2(KEY_UP, KEY_DOWN);
        let dir = Vector2.makeUnit(dx, dy);
        this.player.velocity.x = dir.x;
        this.player.velocity.y = dir.y;
        this.player.velocity = this.player.velocity.norm().mul(PLAYER_SPEED * this.XOR.dt);
        this.player.position = this.player.position.add(this.player.velocity);
        for (let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            if (this.player.collides(enemy, 32)) {
                this.startKibbles(this.player.x, this.player.y);
                this.player.alive--;
                this.player.position.x = this.XOR.width / 4 + GTE.rand1() * this.playerField.x;
                this.player.position.y = this.XOR.height / 2 + GTE.rand1() * this.playerField.y;
            }
        }
        let XOR = this.XOR;
        if (XOR.Timers.ended("PLAYERSHOOT")) {
            if (XOR.Input.getkey(KEY_START) || XOR.Input.getkey(KEY_SELECT)) {
                XOR.Timers.start("PLAYERSHOOT", 0.1);
                XOR.Sounds.playSound("SNARE");
                this.startMissile(this.player.x, this.player.y, Vector2.make(1, 0));
            }
        }
    }
    updateCamels(t1) {
        for (let i = 0; i < MAX_CAMELS; i++) {
            let camel = this.camels[i];
            if (this.camels[i].alive > 0) {
                let type = NORMALCAMEL;
                if (this.camels[i].alive == 1)
                    type = THINCAMEL;
                if (this.camels[i].alive == 2)
                    type = NORMALCAMEL;
                if (this.camels[i].alive >= 3)
                    type = FATCAMEL;
                let animframe = Math.sin(this.camels[i].random + t1) > 0 ? 1 : 0;
                this.camels[i].index = this.sprites[type][animframe];
                this.camels[i].offset.x = GTE.oscillateBetween(t1, this.camels[i].random, i, -2.0, 2.0);
                this.camels[i].offset.y = GTE.oscillateBetween(t1, 2 * this.camels[i].random, i, -2.0, 2.0);
                for (let j = 0; j < MAX_ENEMIES; j++) {
                    let enemy = this.enemies[j];
                    if (enemy.alive <= 0)
                        continue;
                    if (enemy.collides(camel, 24)) {
                        camel.alive--;
                        if (camel.alive <= 0) {
                            this.numCamels--;
                            this.startKibbles(camel.x, camel.y);
                        }
                        enemy.alive--;
                        if (enemy.alive <= 0) {
                            this.startKibbles(enemy.x, enemy.y);
                        }
                    }
                }
            }
        }
    }
    updateEnemies(t1) {
        for (let i = 0; i < MAX_ENEMIES; i++) {
            let enemy = this.enemies[i];
            if (enemy.position.x < -32) {
                enemy.alive = 0;
            }
            if (enemy.alive > 0) {
                let random = enemy.random;
                let type = enemy.type;
                let animframe = Math.sin(random + t1) > 0 ? 1 : 0;
                enemy.index = this.sprites[type][animframe];
                enemy.offset.x = GTE.oscillateBetween(t1, random, i, -2.0, 2.0);
                enemy.offset.y = GTE.oscillateBetween(t1, 2 * random, i, -2.0, 2.0);
                enemy.position = enemy.position.add(enemy.velocity.mul(this.XOR.dt));
            }
            else {
                enemy.alive = 1;
                enemy.position.x = GTE.random(this.XOR.width, 2 * this.XOR.width);
                enemy.position.y = GTE.random(0, this.XOR.height - 32);
                let randomEnemySpeed = GTE.random(ENEMY_SPEED, 2 * ENEMY_SPEED);
                enemy.velocity.x = -randomEnemySpeed;
                enemy.velocity.y = GTE.random(-2, 2);
                if (GTE.rand01() < 0.5) {
                    let randomCamelIndex = GTE.random(0, this.camels.length) | 0;
                    let camel = this.camels[randomCamelIndex];
                    enemy.velocity = enemy.dirto(camel).norm().mul(ENEMY_SPEED);
                }
            }
            for (let j = i + 1; j < MAX_ENEMIES; j++) {
                if (i == j)
                    continue;
                let dirto = enemy.dirto(this.enemies[j]);
                if (dirto.length() < 32) {
                    let ndirto = dirto.norm().mul(16.5);
                    let middle = enemy.position.add(this.enemies[j].position).mul(0.5);
                    enemy.position = middle.add(ndirto);
                    this.enemies[j].position = middle.sub(ndirto);
                }
            }
        }
    }
    updateKibbles(t1) {
        for (let i = 0; i < MAX_KIBBLES; i++) {
            let k = this.kibbles[i];
            if (k.position.y > k.refpoint.y + 4) {
                k.alive = 0;
            }
            if (k.alive) {
                k.velocity.y += KIBBLE_GRAVITY * 9.8 * this.XOR.dt;
                k.position.x += k.velocity.x * this.XOR.dt;
                k.position.y += k.velocity.y * this.XOR.dt;
            }
        }
    }
    updateMissiles(t1) {
        for (let i = 0; i < this.missiles.length; i++) {
            let missile = this.missiles[i];
            if (missile.x > this.XOR.width * 1.5) {
                missile.alive = 0;
            }
            if (missile.alive > 0) {
                missile.move(this.XOR.dt);
                missile.offset.y = GTE.oscillate(missile.random + t1, 1, 0, 3, 0);
                for (let j = 0; j < this.enemies.length; j++) {
                    let enemy = this.enemies[j];
                    if (enemy.alive && enemy.collides(missile, 16)) {
                        this.numEnemies--;
                        missile.alive = 0;
                        enemy.alive = 0;
                        this.score += 100;
                        this.startKibbles(enemy.x, enemy.y);
                    }
                }
            }
        }
    }
    draw(g) {
        for (let i = 0; i < MAX_CAMELS; i++) {
            if (this.camels[i].alive > 0) {
                g.drawSprite(this.camels[i].index, this.camels[i].position.x + this.camels[i].offset.x, this.camels[i].position.y + this.camels[i].offset.y);
            }
        }
        for (let i = 0; i < MAX_ENEMIES; i++) {
            if (this.enemies[i].alive) {
                g.drawSprite(this.enemies[i].index, this.enemies[i].position.x + this.enemies[i].offset.x, this.enemies[i].position.y + this.enemies[i].offset.y);
            }
        }
        g.drawSprite(this.player.index, this.player.position.x + this.player.offset.x, this.player.position.y + this.player.offset.y);
        for (let i = 0; i < MAX_MISSILES; i++) {
            let missile = this.missiles[i];
            if (missile.alive) {
                g.drawSprite(missile.index, missile.x, missile.y);
            }
        }
        for (let i = 0; i < MAX_KIBBLES; i++) {
            let k = this.kibbles[i];
            if (k.alive) {
                //g.drawSprite(this.kibbles[i].index, this.kibbles[i].position.x, this.kibbles[i].position.y);
                g.drawBox(k.position.x, k.position.y, 'black');
            }
        }
    }
    draw2doverlay(g) {
        g.putTextAligned("Camels: " + this.numCamels, 'white', 1, -1, 0, 0);
        g.putTextAligned("Enemies: " + this.numEnemies, 'white', -1, 1, 0, 0);
        g.putTextAligned("Score " + this.score, 'white', 0, -1, 0, 0);
        g.putTextAligned("Lives: " + this.player.alive, 'white', 1, 1, 0, 0);
    }
}
const INITIAL_CAMELS = 16;
const INITIAL_HEALTH = 16;
const MILES_TO_TRAVEL = 6000;
class AdventureGame {
    constructor(XOR) {
        this.XOR = XOR;
        this.milesTraveled = 0;
        this.numCamels = 16;
        this.playerHealth = 5;
        this.numJewels = 100;
        this.numTurns = 0;
        this.lines = [];
        this.sprites = CreateSprites();
        this.states = new StateMachine(XOR);
    }
    get lost() {
        if (this.numCamels <= 0)
            return true;
        if (this.playerHealth <= 0)
            return true;
        return false;
    }
    get won() {
        if (this.milesTraveled > MILES_TO_TRAVEL)
            return true;
        return false;
    }
    get timeForAction() {
        if (this.numTurns > 10)
            return true;
        return false;
    }
    init() {
        this.milesTraveled = 0;
        this.numCamels = INITIAL_CAMELS;
        this.playerHealth = INITIAL_HEALTH;
        this.lines = [
            "You are setting out on a fantastic",
            "journey...",
            "",
            "It is full of danger...",
            "",
            "Yay!"
        ];
        this.XOR.Timers.start("simwait", 4);
    }
    start() {
        this.numTurns = 0;
    }
    update() {
        let XOR = this.XOR;
        if (XOR.Timers.ended("simwait")) {
            this.sim();
            XOR.Timers.start("simwait", 4);
        }
    }
    printStatus() {
        this.lines = [
            "Number of camels: " + this.numCamels,
            "Health: " + this.playerHealth
        ];
    }
    sim() {
        this.numTurns++;
        this.printStatus();
    }
    draw(g) {
    }
    draw2doverlay(g) {
        let y = 0;
        let font = g.context.font;
        g.setFont("EssentialPragmataPro", 32);
        g.context.fillStyle = "black";
        g.context.textAlign = "left";
        for (let line of this.lines) {
            g.putText(line, 0, y);
            y += 32;
        }
        g.context.font = font;
    }
}
// Toadfish Library
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
/// <reference path="./gte/GTE.ts" />
class Toadfish {
    constructor() {
        this._sounds = new Map();
        this._buffers = [];
        this._curbuffer = 0;
        this._context = new AudioContext();
        if (!this._context) {
            throw "Unable to use Web Audio API";
        }
        this._soundVolume = this._context.createGain();
    }
    setSound(name, ab) {
        this._sounds.set(name, ab);
    }
    setVolume(amount) {
        this._soundVolume.gain.value = GTE.clamp(amount, 0, 1);
    }
    playSound(name) {
        let sfx = this._sounds.get(name);
        if (!sfx)
            return;
        // if (this._buffers.length < 32) {
        //     this._buffers.push(this._context.createBufferSource())
        //     this._curbuffer = this._buffers.length - 1;
        // }
        // else {
        //     this._curbuffer = (this._curbuffer + 1) % 32;
        // }
        let source = this._context.createBufferSource(); //this._buffers[this._curbuffer];
        source.buffer = sfx;
        source.connect(this._context.destination);
        source.start(0);
    }
    queueSound(name, url) {
        let self = this;
        let request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = (e) => {
            self._context.decodeAudioData(request.response, (buffer) => {
                self.setSound(name, buffer);
            });
        };
        request.send();
    }
}
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
/// <reference path="../gte/GTE.ts" />
class Sprite {
    constructor(index) {
        this.index = 0;
        this.animframe = 0;
        this.enabled = false;
        this.alive = 1;
        this.type = 0; // used for classifying the main sprite
        this.active = false;
        this.index = index | 0;
        this.position = Vector2.make(0, 0);
        this.offset = Vector2.make(0, 0);
        this.velocity = Vector2.make(0, 0);
        this.refpoint = Vector2.make(0, 0);
        this.random = Math.random();
        this.timealive = 0.0;
        this.enabled = true;
        this.alive = 1;
        this.active = true;
    }
    get x() { return this.position.x + this.offset.x; }
    get y() { return this.position.y + this.offset.y; }
    reset(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.offset.x = 0;
        this.offset.y = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.refpoint.x = 0;
        this.refpoint.y = 0;
    }
    update(dt) {
        this.offset.x += this.velocity.x * dt;
        this.offset.y += this.velocity.y * dt;
    }
    move(dt) {
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }
    dirto(sprite) {
        return Sprite.DirTo(this, sprite);
    }
    distance(sprite) {
        return Sprite.Distance(this, sprite);
    }
    collides(sprite, d) {
        return Sprite.Collide(this, sprite, d);
    }
    static Distance(sprite1, sprite2) {
        if (!sprite1 || !sprite2)
            return 1e6;
        let dx = (sprite1.position.x + sprite1.offset.x) - (sprite2.position.x + sprite2.offset.x);
        let dy = (sprite1.position.y + sprite1.offset.y) - (sprite2.position.y + sprite2.offset.y);
        let d = Math.sqrt(dx * dx + dy * dy);
        return d;
    }
    static Collide(sprite1, sprite2, d) {
        if (Math.abs(sprite1.x - sprite2.x) > d)
            return false;
        if (Math.abs(sprite1.y - sprite2.y) > d)
            return false;
        return Sprite.Distance(sprite1, sprite2) < d ? true : false;
    }
    static DirTo(sprite1, sprite2) {
        if (!sprite1 || !sprite2)
            return Vector2.make(0, 0);
        let dx = (sprite1.position.x + sprite1.offset.x) - (sprite2.position.x + sprite2.offset.x);
        let dy = (sprite1.position.y + sprite1.offset.y) - (sprite2.position.y + sprite2.offset.y);
        return Vector2.make(-dx, -dy);
    }
}
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
/// <reference path="../gte/GTE.ts" />
/// <reference path="Sprite.ts" />
class GraphicsComponent {
    constructor(XOR, width, height) {
        this.XOR = XOR;
        this.width = width;
        this.height = height;
        this.spriteImages = [];
        this._spritesLoaded = false;
        this._fontPixelHeight = 0;
        this._fontPixelHeightOver2 = 0;
        this._fontPixelSlantAdjust = 0;
        this._tiles = [0];
        this._tileOffsets = [];
        this._cols = 1;
        this._rows = 1;
        this._layers = 1;
        this._layerstride = 1;
        this._stride = 1;
        this.spriteCoords = [];
        let e = document.getElementById('graphicsdiv');
        if (!e) {
            this.divElement_ = document.createElement('div');
            this.divElement_.id = 'graphicsdiv';
            this.divElement_.style.textAlign = 'center';
            document.body.appendChild(this.divElement_);
        }
        else {
            this.divElement_ = e;
        }
        e = document.getElementById('graphicscanvas');
        if (!e) {
            this.canvasElement_ = document.createElement('canvas');
            this.canvasElement_.id = 'graphicscanvas';
            this.divElement_.appendChild(this.canvasElement_);
        }
        else {
            this.canvasElement_ = e;
        }
        this.canvasElement_.width = this.width;
        this.canvasElement_.height = this.height;
        let ctx2d = this.canvasElement_.getContext("2d");
        if (!ctx2d)
            throw "Fatal error, no 2d canvas";
        this.context = ctx2d;
        this.context.imageSmoothingEnabled = false;
        this.canvasElement_.setAttribute('cssText', "image-rendering: pixelated;");
        //this.context.globalCompositeOperation = "source-in";
        this.OAM = [];
        this.sprites = new Image();
        this.setFont('Salsbury,EssentialPragmataPro', 32);
    }
    resizeTiles(cols, rows, layers) {
        cols = GTE.clamp(cols | 0, 1, 256);
        rows = GTE.clamp(rows | 0, 1, 256);
        layers = GTE.clamp(layers | 0, 1, 8);
        this._cols = cols;
        this._rows = rows;
        this._layers = layers;
        this._tiles.length = cols * rows * layers;
        this._tiles.fill(0);
        this._layerstride = cols * rows;
        this._stride = cols;
        for (let i = 0; i < this._tiles.length; i++) {
            if (Math.random() < 0.1)
                this._tiles[i] = (Math.random() * 15.999) | 0;
        }
    }
    setTile(col, row, layer, tile) {
        let i = this._layerstride * layer + this._stride * row + col;
        this._tiles[i] = GTE.clamp(tile, 0, 255);
    }
    drawTiles() {
        let twidth = 32;
        let theight = 32;
        for (let layer = 0; layer < this._layers; layer++) {
            let x = -layer * this.XOR.t1 * 10.0;
            let y = 0;
            for (let row = 0; row < this._rows; row++) {
                for (let col = 0; col < this._cols; col++) {
                    let i = this._layerstride * layer + this._stride * row + col;
                    let tile = this._tiles[i];
                    if (tile == 0 && layer != 0)
                        continue;
                    if (x + col * twidth > this.width)
                        break;
                    if (tile > 0 && tile < this._tiles.length) {
                        this.drawSprite(tile, x + col * twidth, y + row * theight);
                    }
                }
                if (y * row * theight > this.height)
                    break;
            }
        }
    }
    get spritesLoaded() {
        return this._spritesLoaded;
    }
    get fontHeight() { return this._fontPixelHeight; }
    setFont(fontName, pixelHeight) {
        this._fontPixelHeight = pixelHeight;
        this._fontPixelHeightOver2 = pixelHeight / 2.0;
        this._fontPixelSlantAdjust = pixelHeight * Math.sin(Math.PI / 18) | 0;
        this.context.font = pixelHeight.toString() + 'px ' + fontName + ',fixed';
    }
    clearScreen(color = null) {
        if (color) {
            this.context.fillStyle = color || "black";
            this.context.fillRect(0, 0, this.width, this.height);
        }
        else {
            this.context.clearRect(0, 0, this.width, this.height);
        }
    }
    loadSprites(url) {
        let self = this;
        this._spritesLoaded = false;
        this.sprites = new Image();
        this.sprites.addEventListener("load", (e) => {
            self._spritesLoaded = true;
            this.extractSprites();
        });
        this.sprites.src = url;
    }
    resize(src, dstw, dsth) {
        let dst = new ImageData(dstw, dsth);
        let scalex = src.width / dstw;
        let scaley = src.height / dsth;
        for (let dsty = 0; dsty < dsth; dsty++) {
            for (let dstx = 0; dstx < dstw; dstx++) {
                let srcx = GTE.clamp(Math.round(-scalex + dstx * scalex), 0, src.width - 1);
                let srcy = GTE.clamp(Math.round(-2 * scaley + dsty * scaley), 0, src.height - 1);
                let srcaddr = (srcy * src.width + srcx) << 2;
                let dstaddr = (dsty * dstw + dstx) << 2;
                dst.data[dstaddr + 0] = src.data[srcaddr + 0];
                dst.data[dstaddr + 1] = src.data[srcaddr + 1];
                dst.data[dstaddr + 2] = src.data[srcaddr + 2];
                dst.data[dstaddr + 3] = src.data[srcaddr + 3];
            }
        }
        return dst;
    }
    extractSprites() {
        let g = this.context;
        let cols = (this.sprites.width / 8) | 0;
        let rows = (this.sprites.height / 8) | 0;
        let c = document.createElement("canvas");
        c.width = this.sprites.width;
        c.height = this.sprites.height;
        let ctx = c.getContext("2d");
        if (!ctx)
            return;
        //ctx.globalCompositeOperation = "copy";
        ctx.drawImage(this.sprites, 0, 0);
        this.spriteImages = [];
        let self = this;
        let i = 0;
        this.spriteImages.length = cols * rows;
        for (let y = 0; y < this.sprites.height; y += 8) {
            for (let x = 0; x < this.sprites.width; x += 8) {
                let src = ctx.getImageData(x, y, 8, 8);
                let dst = this.resize(src, 32, 32);
                this.spriteImages[i] = dst;
                i++;
            }
        }
        this.spriteCoords.length = cols * rows;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                this.spriteCoords[y * cols + x] = [x * 8, y * 8];
            }
        }
    }
    setText(color, alignment) {
        let g = this.context;
        g.fillStyle = color;
        g.textAlign = alignment;
    }
    putText(text, x, y) {
        this.context.fillText(text, x, y + this._fontPixelHeight);
    }
    putTextAligned(text, color, xloc, yloc, xo, yo) {
        let x = 0;
        let halign = "left";
        let y = 0;
        let valign = "top";
        if (xloc == 0) {
            x += this.width / 2;
            halign = "center";
        }
        else if (xloc > 0) {
            x = this.width - this._fontPixelSlantAdjust;
            halign = "right";
        }
        if (yloc == 0) {
            y = this.height / 2 - this._fontPixelHeightOver2;
        }
        else if (yloc > 0) {
            y = this.height - this._fontPixelHeight - this._fontPixelSlantAdjust;
        }
        x += xo;
        y += yo;
        this.setText('black', halign);
        this.putText(text, x + 2, y + 2);
        this.setText(color, halign);
        this.putText(text, x, y);
    }
    putSprite(index, x, y) {
        let g = this.context;
        let cols = (this.sprites.width / 8) | 0;
        let sx = index % cols;
        let sy = (index / cols) | 0;
        g.putImageData(this.spriteImages[index], x, y);
        // if (this.spriteImages[index]) {
        //     g.drawImage(this.spriteImages[index], x, y);
        // }
        //g.drawImage(this.sprites, sx * 8, sy * 8, 8, 8, x, y, 32, 32);
    }
    drawSprite(index, x, y) {
        let g = this.context;
        let sx = this.spriteCoords[index][0];
        let sy = this.spriteCoords[index][1];
        g.drawImage(this.sprites, sx, sy, 8, 8, x - 16, y - 16, 32, 32);
    }
    drawSprites() {
        for (let sprite of this.OAM) {
            if (sprite.enabled)
                this.drawSprite(sprite.index, sprite.position.x + sprite.offset.x, sprite.position.y + sprite.offset.y);
        }
    }
    drawBox(x, y, color) {
        let g = this.context;
        g.fillStyle = color || 'black';
        g.fillRect(x - 2, y - 2, 4, 4);
    }
    get canvas() {
        return this.canvasElement_;
    }
    get hidden() {
        return this.canvasElement_.hidden;
    }
    focus() {
        if (this.canvasElement_)
            this.canvasElement_.focus();
    }
    hide() {
        this.divElement_.hidden = true;
    }
    show() {
        this.divElement_.hidden = false;
    }
}
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
    constructor() {
        this.wasdFormat = true;
        this.lastClick = Vector3.make(0, 0, 0);
        this.gamepadStick1 = Vector3.make(0, 0, 0);
        this.gamepadStick2 = Vector3.make(0, 0, 0);
        this.gamepadDpad = Vector3.make(0, 0, 0);
        this.gamepadButtons = [0, 0, 0, 0];
        this.gamepadLB = 0;
        this.gamepadRB = 0;
        this.gamepadLT = 0;
        this.gamepadRT = 0;
        this.gamepadStart = 0;
        this.gamepadSelect = 0;
        this.gamepadIndex = -1;
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
            let gp = e.gamepad;
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", gp.index, gp.id, gp.buttons.length, gp.axes.length);
            self.gamepadIndex = 0; //gp.index;            
        });
        window.addEventListener("gamepaddisconnected", (e) => {
            let gp = e.gamepad;
            console.log("Gamepad disconnected at index %d: %s.", gp.index, gp.id);
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
    onmousedown(e, v) {
        e.preventDefault();
        v.x = e.offsetX;
        v.y = e.offsetY;
    }
    onmouseup(e, v) {
        e.preventDefault();
        v.x = e.offsetX;
        v.y = e.offsetY;
    }
    setkey(which, state) {
        if (which < 0 || which >= 32)
            return;
        let mask = 1 << which;
        if (state) {
            this.buttons |= mask;
        }
        else {
            this.buttons &= ~mask;
        }
    }
    getkey(which) {
        if (which < 0 || which >= 32)
            return false;
        let mask = 1 << which;
        if (this.buttons & mask)
            return true;
        return false;
    }
    getkey2(negwhich, poswhich) {
        let dx = 0;
        if (this.getkey(negwhich))
            dx -= 1;
        if (this.getkey(poswhich))
            dx += 1;
        return dx;
    }
    onkeychange(e, state) {
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
/// <reference path="../gte/GTE.ts" />
class MusicComponent {
    constructor() {
        this.musicElements = [];
        this.musicElements.push(document.createElement("audio"));
        this.musicElements.push(document.createElement("audio"));
        this.musicElements[0].src = "assets/music/1hgj153.mp3";
        this.musicElements[1].src = "assets/music/oceanwaves.mp3";
        this.promises = [null, null];
        this.musicElements[0].pause();
        this.musicElements[1].pause();
        this.currentPiece = -1;
        this.lastPiece = -1;
    }
    load(url) {
        this.musicElements.push(document.createElement("audio"));
        let i = this.musicElements.length - 1;
        this.musicElements[i].pause();
        this.promises.push(null);
    }
    play(which) {
        if (which < 0 || which >= this.musicElements.length)
            return false;
        this.musicElements[which].currentTime = 0;
        this.promises[which] = this.musicElements[which].play();
        this.mute(this.lastPiece);
        this.lastPiece = this.currentPiece;
        this.currentPiece = which;
        return true;
    }
    update(tInSeconds) {
        // blend the current and last pieces together
    }
    ended(index) {
        if (index < 0 || index >= this.musicElements.length)
            return true;
        return this.musicElements[index].ended || this.musicElements[index].paused;
    }
    stop(index) {
        if (index < 0 || index >= this.musicElements.length)
            return;
        this.musicElements[index].currentTime = 0.0;
        this.musicElements[index].pause();
    }
    mute(index) {
        if (index < 0 || index >= this.musicElements.length)
            return;
        this.musicElements[index].volume = 0;
    }
    fadeOut(index, amount) {
        if (index < 0 || index >= this.musicElements.length)
            return 0;
        this.musicElements[index].volume *= GTE.clamp(amount, 0.0, 0.99999);
        return this.musicElements[index].volume;
    }
    fadeIn(index, amount) {
        if (index < 0 || index >= this.musicElements.length)
            return 0.0;
        ;
        this.musicElements[index].volume += (1.0 - this.musicElements[index].volume) * amount;
        return this.musicElements[index].volume;
    }
    setVolume(index, volume) {
        if (index < 0 || index >= this.musicElements.length)
            return;
        this.musicElements[index].volume = volume;
    }
    getVolume(index) {
        if (index < 0 || index >= this.musicElements.length)
            return 0;
        return this.musicElements[index].volume;
    }
}
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
class TimerComponent {
    constructor() {
        this.dt = 0;
        this.t0 = 0;
        this.t1 = 0;
        this.timers = new Map();
    }
    update(tInSeconds) {
        this.t0 = this.t1;
        this.t1 = tInSeconds;
        this.dt = this.t1 - this.t0;
    }
    start(name, length) {
        this.timers.set(name, this.t1 + length);
    }
    ended(name) {
        let timer = this.timers.get(name);
        if (!timer)
            return true;
        if (this.t1 >= timer) {
            return true;
        }
        return false;
    }
    timeleft(name) {
        let timer = this.timers.get(name);
        if (!timer)
            return 0;
        if (this.t1 < timer) {
            return timer - this.t1;
        }
        return 0;
    }
}
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
/// <reference path="../gte/GTE.ts" />
/// <reference path="../misc/Hatchetfish.ts" />
/// <reference path="../misc/Toadfish.ts" />
/// <reference path="../fluxions/Fluxions.ts" />
/// <reference path="Graphics.ts" />
/// <reference path="Input.ts" />
/// <reference path="Music.ts" />
/// <reference path="Timer.ts" />
class LibXOR {
    constructor(width = 640, height = 512) {
        this.width = width;
        this.height = height;
        this.Fluxions = new RenderingContext(width, height);
        this.Scenegraph = new Scenegraph(this.Fluxions);
        this.Graphics = new GraphicsComponent(this, width, height);
        this.Input = new InputComponent();
        this.Music = new MusicComponent();
        this.Timers = new TimerComponent();
        this.Sounds = new Toadfish();
    }
    update(tInSeconds) {
        this.Timers.update(tInSeconds);
        this.Music.update(tInSeconds);
        this.Input.update();
    }
    get dt() { return this.Timers.dt; }
    get t1() { return this.Timers.t1; }
    get t0() { return this.Timers.t0; }
}
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
// There are different kinds of useful states and state transitions
// PAUSE - wait until a certain time, and then pop
// NORMAL - wait until popped
class State {
    constructor(name, alt = "NONE", delayTime = 0, queueSound = "", queueMusic = "") {
        this.name = name;
        this.alt = alt;
        this.delayTime = delayTime;
        this.queueSound = queueSound;
        this.queueMusic = queueMusic;
    }
}
class StateMachine {
    constructor(XOR) {
        this.XOR = XOR;
        this.states = [];
        this._t1 = 0;
    }
    update(tInSeconds) {
        this._t1 = tInSeconds;
        let topTime = this.topTime;
        if (topTime > 0 && topTime < tInSeconds) {
            this.pop();
            this.XOR.Sounds.playSound(this.topSound);
        }
    }
    push(name, alt, delayTime) {
        if (delayTime > 0)
            delayTime += this._t1;
        this.states.push(new State(name, alt, delayTime));
    }
    pushwithsound(name, alt, delayTime, sound, music) {
        if (delayTime > 0)
            delayTime += this._t1;
        this.states.push(new State(name, alt, delayTime, sound, music));
        this.push(name, "PAUSE", 0.01);
    }
    pop() {
        if (this.states.length)
            this.states.pop();
    }
    get topName() {
        let l = this.states.length;
        if (l > 0) {
            return this.states[l - 1].name;
        }
        return "NONE";
    }
    get topAlt() {
        let l = this.states.length;
        if (l > 0) {
            return this.states[l - 1].alt;
        }
        return "NONE";
    }
    get topTime() {
        let l = this.states.length;
        if (l > 0) {
            return this.states[l - 1].delayTime;
        }
        return -1;
    }
    get topSound() {
        let l = this.states.length;
        if (l > 0) {
            return this.states[l - 1].queueSound;
        }
        return "NONE";
    }
    get topMusic() {
        let l = this.states.length;
        if (l > 0) {
            return this.states[l - 1].queueMusic;
        }
        return "NONE";
    }
}
/// <reference path="../gte/GTE.ts" />
/// <reference path="../libxor/LibXOR.ts" />
/// <reference path="../libxor/State.ts" />
/// <reference path="Common.ts" />
/// <reference path="AdventureGame.ts" />
/// <reference path="ActionGame.ts" />
class Game {
    constructor() {
        this.series = "#LDJAM 41";
        this.title = "Marco Polo";
        this.author = "by microwerx";
        this.askToQuit = false;
        this.gameover = true;
        this.gamelevel = 1;
        this.score = 0;
        this.levelColors = [
            ["#ffbf3f", '#ff3f3f'],
        ];
        this.currentEnvironmentColor = 'lightbrown';
        this.XOR = new LibXOR(640, 512);
        this.states = new StateMachine(this.XOR);
        this.actionGame = new ActionGame(this.XOR);
        this.adventureGame = new AdventureGame(this.XOR);
        this.gameover = true;
        this.gamelevel = 1;
        this.score = 0;
        document.title = this.series + " " + this.title + " " + this.author;
        let e;
        if (e = document.getElementById("headerSeries")) {
            e.innerHTML = this.series;
        }
        if (e = document.getElementById("headerTitle")) {
            e.innerHTML = this.title;
        }
        if (e = document.getElementById("headerAuthor")) {
            e.innerHTML = this.author;
        }
    }
    focus() {
        this.XOR.Graphics.focus();
    }
    run() {
        this.load();
        this.mainloop(0);
    }
    mainloop(t) {
        let self = this;
        this.update(t);
        this.display();
        window.requestAnimationFrame((t) => {
            self.mainloop(t / 1000.0);
        });
    }
    load() {
        let XOR = this.XOR;
        let g = XOR.Graphics;
        g.loadSprites("assets/images/marcopolo.png?" + Date.now());
        XOR.Sounds.queueSound('hihat', 'assets/sounds/E12HIHAT.wav');
        XOR.Sounds.queueSound('kick', 'assets/sounds/E12KICK.wav');
        XOR.Sounds.queueSound('kickaccent', 'assets/sounds/E12KICKACCENT.wav');
        XOR.Sounds.queueSound('rimshot', 'assets/sounds/E12RIMSHOT.wav');
        XOR.Sounds.queueSound('snare', 'assets/sounds/E12SNARE.wav');
        g.resizeTiles(64, 64, 4);
        if (XOR.Scenegraph) {
            let sg = XOR.Scenegraph;
            //sg.AddRenderConfig("default", "assets/shaders/default.vert", "assets/shaders/default.frag");
            //sg.Load("assets/test.scn");
        }
        this.states.push("MAINMENU", "", 0);
        this.states.push("MAINMENU", "PAUSE", 0.25);
    }
    changelevel(which) {
        let XOR = this.XOR;
        let g = this.XOR.Graphics;
        if (which == 1) {
            XOR.Music.play(0);
        }
        this.gamelevel = which;
        this.states.push("MAINMENU", "", 0);
        //this.states.push("ACTIONGAME", "INIT", 0);
        this.states.push("ADVENTUREGAME", "INIT", 0);
    }
    readySetGo() {
        let name = this.states.topName;
        this.states.pushwithsound(name, "GO", 3, "snare", "");
        this.states.pushwithsound(name, "SET", 2, "snare", "");
        this.states.pushwithsound(name, "READY", 1, "snare", "");
    }
    statePause() {
        if (this.states.topAlt == "PAUSE")
            return true;
        return false;
    }
    stateMainMenu() {
        let XOR = this.XOR;
        if (this.states.topName == "MAINMENU") {
            XOR.Music.fadeOut(0, 0.95);
            if (XOR.Input.getkey(KEY_START)) {
                this.changelevel(1);
            }
            return true;
        }
        else {
            XOR.Music.fadeIn(0, 0.05);
        }
        return false;
    }
    checkGameModeAskToQuit() {
        let XOR = this.XOR;
        if (this.states.topAlt == "PLAY") {
            if (XOR.Input.getkey(KEY_BACK)) {
                this.states.push("ASKTOQUIT", "INIT", 0);
                this.states.push("ASKTOQUIT", "PAUSE", 0.5);
                return true;
            }
        }
        return false;
    }
    stateAskToQuit() {
        let XOR = this.XOR;
        if (this.states.topName == "ASKTOQUIT") {
            if (XOR.Input.getkey(KEY_BACK)) {
                this.states.pop(); // pop ASKTOQUIT
                this.states.push("PAUSE", "PAUSE", 0.25);
                return true;
            }
            if (XOR.Input.getkey(KEY_START)) {
                this.states.pop(); // pop ASKTOQUIT
                this.states.pop(); // pop GAMEMODE
                this.states.push("MAINMENU", "PAUSE", 0.25);
                return true;
            }
        }
        return false;
    }
    getTimeredKey(key, delay = 1 / 15) {
        let result = false;
        let timerName = "tk" + key;
        if (this.XOR.Timers.ended(timerName)) {
            if (this.XOR.Input.getkey(key)) {
                result = true;
                this.XOR.Timers.start(timerName, delay);
            }
        }
        return result;
    }
    update(tInSeconds) {
        let XOR = this.XOR;
        let g = this.XOR.Graphics;
        this.states.update(tInSeconds);
        XOR.update(tInSeconds);
        this.actionGame.playerLocation.copy(XOR.Input.lastClick);
        if (this.statePause())
            return;
        if (this.stateMainMenu())
            return;
        if (this.stateAskToQuit())
            return;
        if (this.checkGameModeAskToQuit())
            return;
        XOR.Music.setVolume(1, (1.0 - XOR.Music.getVolume(0)) * 0.25 + 0.15);
        if (XOR.Music.ended(0))
            XOR.Music.play(0);
        if (XOR.Music.ended(1))
            XOR.Music.play(1);
        if (this.getTimeredKey(KEY_RIGHT)) {
            XOR.Sounds.playSound('snare');
        }
        if (this.getTimeredKey(KEY_LEFT)) {
            XOR.Sounds.playSound('kick');
        }
        if (this.getTimeredKey(KEY_UP)) {
            XOR.Sounds.playSound('rimshot');
        }
        if (this.getTimeredKey(KEY_RIGHT)) {
            XOR.Sounds.playSound('kickaccent');
        }
        if (this.stateActionGame() && this.states.topAlt == "PLAY") {
            if (this.actionGame.lost) {
                this.states.pop();
                this.states.push("ACTIONGAME", "INIT", 0);
                this.states.push("ACTIONGAME", "LOST", 4);
            }
            else if (this.actionGame.won) {
                this.states.pop();
                this.states.push("ACTIONGAME", "INIT", 0);
                this.states.push("ACTIONGAME", "WON", 4);
            }
            this.actionGame.update();
            return;
        }
        if (this.stateAdventureGame() && this.states.topAlt == "PLAY") {
            if (this.adventureGame.lost) {
                this.states.pop();
                this.states.push("ADVENTUREGAME", "LOST", 4);
                this.states.push("MAINMENU", "", 0);
            }
            else if (this.adventureGame.won) {
                this.states.pop();
                this.states.push("MAINMENU", "", 0);
                this.states.push("ADVENTUREGAME", "WON", 4);
            }
            else if (this.adventureGame.timeForAction) {
                this.states.push("ACTIONGAME", "INIT", 0);
            }
            else {
                this.adventureGame.update();
            }
            return;
        }
    }
    stateActionGame() {
        if (this.states.topName != "ACTIONGAME")
            return false;
        if (this.states.topAlt == "INIT") {
            this.actionGame.init();
            this.states.pop();
            this.states.push("ACTIONGAME", "PLAY", 0);
            this.readySetGo();
        }
        return true;
    }
    stateAdventureGame() {
        if (this.states.topName != "ADVENTUREGAME")
            return false;
        if (this.states.topAlt == "INIT") {
            this.adventureGame.init();
            this.adventureGame.start();
            this.states.pop();
            this.states.push("ADVENTUREGAME", "PLAY", 0);
            this.readySetGo();
        }
        return true;
    }
    display() {
        let XOR = this.XOR;
        let g = XOR.Graphics;
        g.setFont("Salsbury,EssentialPragmataPro,consolas,fixed", 32);
        let assetsLoaded = 1;
        if (!XOR.Scenegraph.loaded || !g.spritesLoaded) {
            assetsLoaded = 0;
        }
        if (!assetsLoaded) {
            g.clearScreen('blue');
            g.putTextAligned('Loading', 'white', 0, 0, 0, 0);
        }
        else {
            //this.draw3d();
            let gradient = g.context.createLinearGradient(0, 0, 0, XOR.height);
            gradient.addColorStop(0, this.levelColors[0][0]);
            gradient.addColorStop(1, this.levelColors[0][1]);
            g.clearScreen(gradient);
            this.draw2d();
            this.draw2doverlay();
        }
    }
    draw3d() {
    }
    draw2d() {
        let g = this.XOR.Graphics;
        //g.drawTiles();
        //g.drawSprites();
        if (this.states.topName == "ACTIONGAME") {
            this.actionGame.draw(g);
        }
        if (this.states.topName == "ADVENTUREGAME") {
            this.adventureGame.draw(g);
        }
    }
    draw2doverlay() {
        let g = this.XOR.Graphics;
        if (this.states.topName != "ADVENTUREGAME") {
            g.putTextAligned(this.states.topName, 'white', -1, -1, 0, 0);
            g.putTextAligned(this.states.topAlt, 'white', -1, -1, 0, 32);
            g.putTextAligned("Time: " + Math.ceil(this.XOR.t1 - this.states.topTime), 'white', -1, -1, 0, 64);
        }
        if (this.states.topName == "MAINMENU") {
            let font = g.context.font;
            g.context.font = "64px Salsbury,EssentialPragmataPro,sans-serif";
            g.putTextAligned(this.title, 'white', 0, 0, 0, -g.height / 5);
            g.context.font = font;
            g.putTextAligned('Press START!', 'red', 0, 0, 0, 0);
        }
        else {
            g.context.fillStyle = 'red';
        }
        if (this.states.topName == "ASKTOQUIT") {
            g.putTextAligned("REALLY QUIT?", 'white', 0, 0, 0, 0);
            g.putTextAligned("ESCAPE = NO", 'white', 0, 0, 0, g.fontHeight * 2);
            g.putTextAligned("ENTER = YES", "white", 0, 0, 0, g.fontHeight * 3);
        }
        if (this.states.topAlt == "READY") {
            g.putTextAligned('READY!', 'red', 0, 0, 0, 0);
        }
        if (this.states.topAlt == "SET") {
            g.putTextAligned('SET!', 'yellow', 0, 0, 0, 0);
        }
        if (this.states.topAlt == "GO") {
            g.putTextAligned('GO!!!', 'green', 0, 0, 0, 0);
        }
        if (this.states.topName == "ACTIONGAME") {
            this.actionGame.draw2doverlay(g);
            if (this.states.topAlt == "WON") {
                g.putTextAligned("YOU WON THIS ROUND!!!", 'red', 0, 0, 0, 0);
            }
            if (this.states.topAlt == "LOST") {
                g.putTextAligned("YOU LOST THIS ROUND!!!", 'red', 0, 0, 0, 0);
            }
        }
        if (this.states.topName == "ADVENTUREGAME") {
            this.adventureGame.draw2doverlay(g);
        }
    }
    setInstructions() {
        let EIs = [
            ["gameInstructions", "Part Adventure, Part Action. Marco Polo is journeying across Asia with his camels. But many deadly foes and situations lay ahead. Will he survive?"],
            ["leftInstructions", "Move left"],
            ["rightInstructions", "Move right"],
            ["upInstructions", "Move up"],
            ["downInstructions", "Move down"],
            ["enterInstructions", "Fire"],
            ["escapeInstructions", "Quit game"],
            ["spaceInstructions", "Fire"]
        ];
        for (let ei of EIs) {
            let e = document.getElementById(ei[0]);
            if (e) {
                e.innerHTML = ei[1];
            }
        }
    }
}
function swapZQSD() {
    let e = document.getElementById('zqsd');
    if (!e)
        return;
    game.XOR.Input.wasdFormat = !game.XOR.Input.wasdFormat;
    if (game.XOR.Input.wasdFormat) {
        e.setAttribute("value", "Switch to ZQSD");
        let uk = document.getElementById('UPKEY');
        if (uk)
            uk.innerHTML = 'w';
        let lk = document.getElementById('LEFTKEY');
        if (lk)
            lk.innerHTML = 'a';
    }
    else {
        e.setAttribute("value", "Switch to WASD");
        let uk = document.getElementById('UPKEY');
        if (uk)
            uk.innerHTML = 'z';
        let lk = document.getElementById('LEFTKEY');
        if (lk)
            lk.innerHTML = 'q';
    }
    game.focus();
}
let game = new Game();
var Brainfish;
(function (Brainfish) {
    class Perceptron1Output {
        constructor(inputCount) {
            this.I = [];
            this.w = [];
            this.O = 0;
            this.t = 0;
            this.w.length = inputCount;
            this.I.length = inputCount;
        }
        compute() {
            this.O = 0.0;
            for (let i = 0; i < this.w.length; i++) {
                this.O += this.I[i] * this.w[i];
            }
            return this.O > this.t ? 1 : 0;
        }
    }
    Brainfish.Perceptron1Output = Perceptron1Output;
    function CreatePerceptron1(count) {
        return new Perceptron1Output(count);
    }
    Brainfish.CreatePerceptron1 = CreatePerceptron1;
    function CreateLogicPerceptron(w1, w2, t) {
        let p = CreatePerceptron1(2);
        p.w[0] = w1;
        p.w[1] = w2;
        p.t = t;
        return p;
    }
    Brainfish.CreateLogicPerceptron = CreateLogicPerceptron;
    function CreateANDPerceptron() {
        return CreateLogicPerceptron(1, 1, 2);
    }
    Brainfish.CreateANDPerceptron = CreateANDPerceptron;
    function CreateORPerceptron() {
        return CreateLogicPerceptron(1, 1, 1);
    }
    Brainfish.CreateORPerceptron = CreateORPerceptron;
})(Brainfish || (Brainfish = {}));
//# sourceMappingURL=game.js.map