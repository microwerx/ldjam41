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
    constructor(public x: number = 0.0, public y: number = 0.0, public z = 0.0) {
    }

    copy(v: Vector3): Vector3 {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    reset(x: number = 0, y: number = 0, z: number = 0): Vector3 {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    static makeFromSpherical(theta: number, phi: number): Vector3 {
        return new Vector3(
            Math.cos(phi) * Math.cos(theta),
            Math.sin(phi),
            -Math.cos(phi) * Math.sin(theta)
        );
    }

    // Converts (rho, theta, phi) so that rho is distance from origin,
    // theta is inclination away from positive y-axis, and phi is azimuth
    // from positive z-axis towards the positive x-axis.
    static makeFromSphericalISO(rho: number, thetaInRadians: number, phiInRadians: number): Vector3 {
        return new Vector3(
            rho * Math.sin(thetaInRadians) * Math.cos(phiInRadians),
            rho * Math.cos(thetaInRadians),
            rho * Math.sin(thetaInRadians) * Math.sin(phiInRadians)
        );
    }

    // Converts (rho, theta, phi) so that rho is distance from origin,
    // phi is inclination away from positive y-axis, and theta is azimuth
    // from positive z-axis towards the positive x-axis.
    static makeFromSphericalMath(rho: number, thetaInRadians: number, phiInRadians: number): Vector3 {
        return new Vector3(
            rho * Math.sin(phiInRadians) * Math.sin(thetaInRadians),
            rho * Math.cos(phiInRadians),
            rho * Math.sin(phiInRadians) * Math.cos(thetaInRadians)
        );
    }

    // theta represents angle from +x axis on xz plane going counterclockwise
    // phi represents angle from xz plane going towards +y axis
    setFromSpherical(theta: number, phi: number): Vector3 {
        this.x = Math.cos(theta) * Math.cos(phi);
        this.y = Math.sin(phi);
        this.z = -Math.sin(theta) * Math.cos(phi);
        return this;
    }

    get theta(): number {
        return Math.atan2(this.x, -this.z) + ((this.z <= 0.0) ? 0.0 : 2.0 * Math.PI);
    }

    get phi(): number {
        return Math.asin(this.y);
    }

    static make(x: number, y: number, z: number): Vector3 {
        return new Vector3(x, y, z);
    }

    static makeUnit(x: number, y: number, z: number): Vector3 {
        return (new Vector3(x, y, z)).norm();
    }

    add(v: Vector3): Vector3 {
        return new Vector3(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        );
    }

    sub(v: Vector3): Vector3 {
        return new Vector3(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        );
    }

    mul(multiplicand: number): Vector3 {
        return new Vector3(
            this.x * multiplicand,
            this.y * multiplicand,
            this.z * multiplicand
        );
    }

    // returns 0 if denominator is 0
    div(divisor: number): Vector3 {
        if (divisor == 0.0)
            return new Vector3();
        return new Vector3(
            this.x / divisor,
            this.y / divisor,
            this.z / divisor
        )
    }

    neg(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    // multiplicative inverse (1/x)
    reciprocal(): Vector3 {
        return new Vector3(1.0 / this.x, 1.0 / this.y, 1.0 / this.z);
    }

    pow(power: number): Vector3 {
        return new Vector3(
            Math.pow(this.x, power),
            Math.pow(this.y, power),
            Math.pow(this.z, power)
        );
    }

    compdiv(divisor: Vector3): Vector3 {
        return new Vector3(
            this.x / divisor.x,
            this.y / divisor.y,
            this.z / divisor.z
        );
    }

    compmul(multiplicand: Vector3): Vector3 {
        return new Vector3(
            this.x * multiplicand.x,
            this.y * multiplicand.y,
            this.z * multiplicand.z
        );
    }

    toArray(): number[] {
        return [this.x, this.y, this.z];
    }

    toFloat32Array(): Float32Array {
        return new Float32Array([this.x, this.y, this.z]);
    }

    toVector2(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    toVector4(w: number): Vector4 {
        return new Vector4(this.x, this.y, this.z, w);
    }

    project(): Vector2 {
        return new Vector2(this.x / this.z, this.y / this.z);
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    norm(): Vector3 {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector3();
        else
            len = Math.sqrt(len);
        return new Vector3(this.x / len, this.y / len, this.z / len);
    }

    normalize(): Vector3 {
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

    get(index: number): number {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
        }
        return 0.0;
    }

    static dot(v1: Vector3, v2: Vector3): number {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    static cross(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(
            a.y * b.z - b.y * a.z,
            a.z * b.x - b.z * a.x,
            a.x * b.y - b.x * a.y
        );
    }

    static add(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static sub(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static mul(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
    }

    static div(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x / b.x, a.y / b.y, a.z / b.z);
    }
}
