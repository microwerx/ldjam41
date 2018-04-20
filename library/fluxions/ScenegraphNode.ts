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
    private _transform: Matrix4 = Matrix4.makeIdentity();
    private _pretransform: Matrix4 = Matrix4.makeIdentity();
    private _posttransform: Matrix4 = Matrix4.makeIdentity();
    private _worldMatrix: Matrix4 = Matrix4.makeIdentity();
    newlyCreated:boolean = false;

    constructor(public name: string = "unknown",
        public parent: string = "unknown",
        public geometryGroup: string = "") {
    }
    
    get transform(): Matrix4 { return this._transform; }
    get pretransform(): Matrix4 { return this._pretransform; }
    get posttransform(): Matrix4 { return this._posttransform; }
    get worldTransform(): Matrix4 { return this._calcWorldMatrix(); }
    get position(): Vector3 { return this._worldMatrix.col3(3); }

    set transform(M: Matrix4) { this._transform.LoadMatrix(M); this._calcWorldMatrix(); }
    set pretransform(M: Matrix4) { this._pretransform.LoadMatrix(M); this._calcWorldMatrix(); }
    set posttransform(M: Matrix4) { this._posttransform.LoadMatrix(M); this._calcWorldMatrix(); }

    distance(otherNode: ScenegraphNode): number {
        return Vector3.distance(this.position, otherNode.position);
    }

    dirto(otherNode: ScenegraphNode): Vector3 {
        return Vector3.sub(otherNode.position, this.position);
    }

    private _calcWorldMatrix(): Matrix4 {
        this._worldMatrix.LoadMatrix(this.pretransform);
        this._worldMatrix.MultMatrix(this.transform);
        this._worldMatrix.MultMatrix(this.posttransform);
        return this._worldMatrix;
    }
}
