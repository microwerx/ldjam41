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
    _transform: Matrix4 = Matrix4.makeIdentity();
    private _center: Vector3 = new Vector3();
    private _eye: Vector3 = new Vector3(0.0, 0.0, 10.0);
    private _angleOfView: number = 45.0;
    private _aspectRatio = 1.0;
    private _znear = 1.0;
    private _zfar = 100.0;
    public projection: Matrix4 = Matrix4.makePerspectiveY(this._angleOfView, this._aspectRatio, this._znear, this._zfar);
    public pretransform: Matrix4 = Matrix4.makeIdentity();
    public posttransform: Matrix4 = Matrix4.makeIdentity();

    constructor() {
    }

    get transform(): Matrix4 { return Matrix4.multiply3(this.pretransform, this._transform, this.posttransform); }

    set aspectRatio(ar: number) {
        this._aspectRatio = Math.max(0.001, ar);
        this.projection = Matrix4.makePerspectiveY(this._angleOfView, this._aspectRatio, this._znear, this._zfar);
    }

    set angleOfView(angleInDegrees: number) {
        this._angleOfView = Math.max(1.0, angleInDegrees);
        this.projection = Matrix4.makePerspectiveY(this._angleOfView, this._aspectRatio, this._znear, this._zfar);
    }

    set zfar(z: number) {
        this._zfar = Math.max(z, 0.001);
        let znear = Math.min(this._znear, this._zfar);
        let zfar = Math.max(this._znear, this._zfar);
        this._znear = znear;
        this._zfar = zfar;
        this.projection = Matrix4.makePerspectiveY(this._angleOfView, this._aspectRatio, this._znear, this._zfar);
    }

    set znear(z: number) {
        this._znear = Math.max(z, 0.001);
        let znear = Math.min(this._znear, this._zfar);
        let zfar = Math.max(this._znear, this._zfar);
        this._znear = znear;
        this._zfar = zfar;
        this.projection = Matrix4.makePerspectiveY(this._angleOfView, this._aspectRatio, this._znear, this._zfar);
    }

    get position(): Vector3 {
        return this._transform.col3(3);
    }

    get right(): Vector3 {
        return this._transform.col3(0);
    }

    get left(): Vector3 {
        return this._transform.col3(0).neg();
    }

    get up(): Vector3 {
        return this._transform.col3(1);
    }

    get down(): Vector3 {
        return this._transform.col3(1).neg();
    }

    get forward(): Vector3 {
        return this._transform.col3(2);
    }

    get backward(): Vector3 {
        return this._transform.col3(2).neg();
    }

    get eye(): Vector3 {
        return this._transform.asInverse().row3(3);
    }

    set eye(p: Vector3) {
        this._eye = p.clone();
        this._transform = Matrix4.makeLookAt(this._eye, this._center, this.up);
        this._eye = this._transform.col3(3);
    }

    set center(p: Vector3) {
        this._center = p;
        this._transform.LookAt(this._eye, this._center, this.up);
    }

    moveTo(position: Vector3) {
        this._transform.m14 = position.x;
        this._transform.m24 = position.y;
        this._transform.m34 = position.z;
    }

    move(delta: Vector3): Vector3 {
        let tx = this.right.mul(delta.x);
        let ty = this.up.mul(delta.y);
        let tz = this.forward.mul(delta.z);
        this._transform.Translate(tx.x, tx.y, tx.z);
        this._transform.Translate(ty.x, ty.y, ty.z);
        this._transform.Translate(tz.x, tz.y, tz.z);
        return this.position;
    }

    turn(delta: Vector3): void {
        let m = Matrix4.makeIdentity();
        m.Rotate(delta.x, 1, 0, 0);
        m.Rotate(delta.y, 0, 1, 0);
        m.Rotate(delta.z, 0, 0, 1);
        this._transform.MultMatrix(m);
    }

    setOrbit(azimuthInDegrees: number, pitchInDegrees: number, distance: number): Matrix4 {
        this._transform.LoadIdentity();
        this._transform.Rotate(azimuthInDegrees, 0.0, 1.0, 0.0);
        this._transform.Rotate(pitchInDegrees, 1.0, 0.0, 0.0);
        this._transform.Translate(0.0, 0.0, -distance);
        return this._transform.clone();
    }

    setLookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4 {
        this._transform.LoadIdentity();
        this._transform.LookAt(eye, center, up);
        return this._transform.clone();
    }
}