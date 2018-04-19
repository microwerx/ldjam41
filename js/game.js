"use strict";
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
        return new Matrix4(m1.m11 * m2.m11 + m1.m21 * m2.m12 + m1.m31 * m2.m13 + m1.m41 * m2.m14, m1.m11 * m2.m21 + m1.m21 * m2.m22 + m1.m31 * m2.m23 + m1.m41 * m2.m24, m1.m11 * m2.m31 + m1.m21 * m2.m32 + m1.m31 * m2.m33 + m1.m41 * m2.m34, m1.m11 * m2.m41 + m1.m21 * m2.m42 + m1.m31 * m2.m43 + m1.m41 * m2.m44, m1.m12 * m2.m11 + m1.m22 * m2.m12 + m1.m32 * m2.m13 + m1.m42 * m2.m14, m1.m12 * m2.m21 + m1.m22 * m2.m22 + m1.m32 * m2.m23 + m1.m42 * m2.m24, m1.m12 * m2.m31 + m1.m22 * m2.m32 + m1.m32 * m2.m33 + m1.m42 * m2.m34, m1.m12 * m2.m41 + m1.m22 * m2.m42 + m1.m32 * m2.m43 + m1.m42 * m2.m44, m1.m13 * m2.m11 + m1.m23 * m2.m12 + m1.m33 * m2.m13 + m1.m43 * m2.m14, m1.m13 * m2.m21 + m1.m23 * m2.m22 + m1.m33 * m2.m23 + m1.m43 * m2.m24, m1.m13 * m2.m31 + m1.m23 * m2.m32 + m1.m33 * m2.m33 + m1.m43 * m2.m34, m1.m13 * m2.m41 + m1.m23 * m2.m42 + m1.m33 * m2.m43 + m1.m43 * m2.m44, m1.m14 * m2.m11 + m1.m24 * m2.m12 + m1.m34 * m2.m13 + m1.m44 * m2.m14, m1.m14 * m2.m21 + m1.m24 * m2.m22 + m1.m34 * m2.m23 + m1.m44 * m2.m24, m1.m14 * m2.m31 + m1.m24 * m2.m32 + m1.m34 * m2.m33 + m1.m44 * m2.m34, m1.m14 * m2.m41 + m1.m24 * m2.m42 + m1.m34 * m2.m43 + m1.m44 * m2.m44);
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
/// <reference path="./Vector2.ts" />
/// <reference path="./Vector3.ts" />
/// <reference path="./Vector4.ts" />
/// <reference path="./Matrix2.ts" />
/// <reference path="./Matrix3.ts" />
/// <reference path="./Matrix4.ts" />
var GTE;
(function (GTE) {
    function oscillate(t, frequency, phase, amplitude, offset) {
        return Math.sin(frequency * t + phase) * amplitude + offset;
    }
    GTE.oscillate = oscillate;
    function oscillateBetween(t, frequency, phase, lowerLimit, upperLimit) {
        return Math.sin(frequency * t + phase) * (upperLimit - lowerLimit) * 0.5 + lowerLimit;
    }
    GTE.oscillateBetween = oscillateBetween;
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
        this.buttons = 0;
        let self = this;
        window.addEventListener("keydown", (e) => {
            self.onkeychange(e, true);
        });
        window.addEventListener("keyup", (e) => {
            self.onkeychange(e, false);
        });
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
    onkeychange(e, state) {
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
class Sprite {
    constructor(index) {
        this.index = 0;
        this.x = 0;
        this.y = 0;
        this.enabled = false;
        this.alive = 1;
        this.active = false;
        this.index = index | 0;
        this.position = Vector2.make(0, 0);
        this.offset = Vector2.make(0, 0);
        this.velocity = Vector2.make(0, 0);
        this.random = Math.random();
        this.timealive = 0.0;
        this.enabled = true;
        this.alive = 1;
        this.active = true;
    }
    reset(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.offset.x = 0;
        this.offset.y = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    update(dt) {
        this.offset.x += this.velocity.x * dt;
        this.offset.y += this.velocity.y * dt;
    }
    static Distance(sprite1, sprite2) {
        if (!sprite1 || !sprite2)
            return 1e6;
        let dx = (sprite1.x + sprite1.offset.x) - (sprite2.x + sprite2.offset.x);
        let dy = (sprite1.y + sprite1.offset.y) - (sprite2.y + sprite2.offset.y);
        return Math.sqrt(dx * dx + dy * dy);
    }
    static Collide(sprite1, sprite2, d) {
        return Sprite.Distance(sprite1, sprite2) < d ? true : false;
    }
}
//# sourceMappingURL=game.js.map