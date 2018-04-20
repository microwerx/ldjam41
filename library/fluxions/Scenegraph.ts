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

enum SGAssetType {
    Scene,
    GeometryGroup,
    MaterialLibrary,
    ShaderProgram,
    Image,
    Text
};


class Scenegraph {
    private textfiles: Utils.TextFileLoader[] = [];
    private imagefiles: Utils.ImageFileLoader[] = [];
    private shaderSrcFiles: Utils.ShaderLoader[] = [];

    private _defaultT2D: Texture;
    private _defaultTCube: Texture;
    private _defaultFBO: FBO;

    private _fbo: Map<string, FBO> = new Map<string, FBO>();
    private _deferredMesh: IndexedGeometryMesh;
    private _renderConfigs: Map<string, RenderConfig> = new Map<string, RenderConfig>();
    //private _cubeTextures: Map<string, WebGLTexture> = new Map<string, WebGLTexture>();
    private _textures: Map<string, Texture> = new Map<string, Texture>();
    private _materials: Map<string, Material> = new Map<string, Material>();
    private _sceneResources: Map<string, string> = new Map<string, string>();
    private _nodes: Array<ScenegraphNode> = [];
    private _meshes: Map<string, IndexedGeometryMesh> = new Map<string, IndexedGeometryMesh>();
    private _tempNode: ScenegraphNode = new ScenegraphNode("", "");
    public textFiles: Map<string, string[][]> = new Map<string, string[][]>();

    public camera: Camera = new Camera();
    public sunlight: DirectionalLight = new DirectionalLight();
    public moonlight: DirectionalLight = new DirectionalLight();

    private _defaultRenderConfig: RenderConfig;

    get moonlightFBO(): FBO { return this.getFBO("moonshadow"); }
    get sunlightFBO(): FBO { return this.getFBO("sunshadow"); }
    get gbufferFBO(): FBO { return this.getFBO("gbuffer"); }

    constructor(private _renderingContext: RenderingContext) {
        this._defaultRenderConfig = new RenderConfig(this._renderingContext,
            `attribute vec3 aPosition;
             void main() {
                 gl_Position = vec4(aPosition, 1.0);
            }
            `,
            `void main() {
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
        this._deferredMesh.SetMtllib("Floor10x10_mtl")
        this._deferredMesh.SetMtl("ConcreteFloor");
        this._deferredMesh.BeginSurface(gl.TRIANGLES);
        this._deferredMesh.AddIndex(0);
        this._deferredMesh.AddIndex(1);
        this._deferredMesh.AddIndex(2);
        this._deferredMesh.AddIndex(0);
        this._deferredMesh.AddIndex(2);
        this._deferredMesh.AddIndex(3);

        let t = gl.createTexture();
        if (!t) { throw "Unable to create default 2D texture."; }
        this._defaultT2D = new Texture(this._renderingContext, "", "", gl.TEXTURE_2D, t);
        this._defaultT2D.makeDefaultTexture();
        t = gl.createTexture();
        if (!t) { throw "Unable to create default Cube texture."; }
        this._defaultTCube = new Texture(this._renderingContext, "", "", gl.TEXTURE_CUBE_MAP, t);
        this._defaultTCube.makeDefaultTexture();
    }

    get loaded(): boolean {
        for (let t of this.textfiles) {
            if (!t.loaded) return false;
        }
        for (let i of this.imagefiles) {
            if (!i.loaded) return false;
        }
        for (let s of this.shaderSrcFiles) {
            if (!s.loaded) return false;
        }
        return true;
    }

    get failed(): boolean {
        for (let t of this.textfiles) {
            if (t.failed) return true;
        }
        for (let i of this.imagefiles) {
            if (i.failed) return true;
        }
        for (let s of this.shaderSrcFiles) {
            if (s.failed) return true;
        }
        return false;
    }

    get percentLoaded(): number {
        let a = 0;
        for (let t of this.textfiles) {
            if (t.loaded) a++;
        }
        for (let i of this.imagefiles) {
            if (i.loaded) a++;
        }
        for (let s of this.shaderSrcFiles) {
            if (s.loaded) a++;
        }
        return 100.0 * a / (this.textfiles.length + this.imagefiles.length + this.shaderSrcFiles.length);
    }

    Load(url: string): void {
        let name = Utils.GetURLResource(url);
        let self = this;
        let assetType: SGAssetType;
        let ext = Utils.GetExtension(name);
        let path = Utils.GetURLPath(url);

        if (ext == "scn") assetType = SGAssetType.Scene;
        else if (ext == "obj") assetType = SGAssetType.GeometryGroup;
        else if (ext == "mtl") assetType = SGAssetType.MaterialLibrary;
        else if (ext == "png") assetType = SGAssetType.Image;
        else if (ext == "jpg") assetType = SGAssetType.Image;
        else if (ext == "txt") assetType = SGAssetType.Text;
        else return;

        hflog.debug("Scenegraph::Load() => Requesting " + url);

        if (assetType == SGAssetType.Image) {
            if (this._textures.has(name))
                return;
            this.imagefiles.push(new Utils.ImageFileLoader(url, (data, name, assetType) => {
                self.processTextureMap(data, name, assetType);
                hflog.log("Loaded " + Math.round(self.percentLoaded) + "% " + name);
            }));
        } else {
            this.textfiles.push(new Utils.TextFileLoader(url, (data, name, assetType) => {
                self.processTextFile(data, name, path, assetType);
                hflog.log("Loaded " + Math.round(self.percentLoaded) + "% " + name);
            }, assetType));
        }
    }

    AddRenderConfig(name: string, vertshaderUrl: string, fragshaderUrl: string) {
        let self = this;
        this.shaderSrcFiles.push(new Utils.ShaderLoader(vertshaderUrl, fragshaderUrl, (vertShaderSource: string, fragShaderSource: string) => {
            this._renderConfigs.set(name, new RenderConfig(this._renderingContext, vertShaderSource, fragShaderSource));
            hflog.log("Loaded " + Math.round(self.percentLoaded) + "% " + vertshaderUrl + " and " + fragshaderUrl);
        }));
    }

    UseRenderConfig(name: string): RenderConfig | null {
        let rc = this._renderConfigs.get(name);
        if (rc) {
            rc.Use();
            return rc;
        }
        return null;//this._defaultRenderConfig;
    }

    GetMaterial(mtllib: string, mtl: string): Material | null {
        for (let ml of this._materials) {
            if (ml["0"] == mtllib + mtl) {
                return ml["1"];
            }
        }
        return null;
    }

    UseMaterial(rc: RenderConfig, mtllib: string, mtl: string) {
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

    RenderMesh(name: string, rc: RenderConfig) {
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

    UseTexture(textureName: string, unit: number, enable: boolean = true): boolean {
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
                gl.bindTexture(t.target, t.texture)
                gl.texParameteri(t.target, gl.TEXTURE_MIN_FILTER, minFilter);
                gl.texParameteri(t.target, gl.TEXTURE_MAG_FILTER, magFilter);
                result = true;
            } else {
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

    HasNode(parentName: string, objectName: string): ScenegraphNode | null {
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

    GetNode(parentName: string, objectName: string): ScenegraphNode {
        let node = this.HasNode(parentName, objectName);
        if (node) return node;
        node = new ScenegraphNode(objectName, parentName);
        return this.AddNode(node);
    }

    AddNode(newNode: ScenegraphNode): ScenegraphNode {
        newNode.newlyCreated = true;
        this._nodes.push(newNode);
        return newNode;
    }

    ClearNodes() {
        this._nodes.length = 0;
    }

    GetMesh(meshName: string): IndexedGeometryMesh | null {
        let mesh = this._meshes.get(meshName);
        if (!mesh) {
            mesh = new IndexedGeometryMesh(this._renderingContext)
            this._meshes.set(meshName, mesh);
        }
        return mesh;
    }

    SetGlobalParameters(rc: RenderConfig) {
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
            } else {
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
                    if (this.gbufferFBO.color) rc.SetUniform1i("GBufferColor0", GBUFFER_COLOR_TEXUNIT);
                    if (this.gbufferFBO.depth) rc.SetUniform1i("GBufferDepth", GBUFFER_DEPTH_TEXUNIT);
                    rc.SetUniform2f("iResolutionGBuffer", this.gbufferFBO.dimensions);
                    rc.SetUniform1i("UsingGBuffer", 1);
                }

                if (this.sunlightFBO.complete) {
                    this.sunlightFBO.bindTextures(13, 14);
                    if (this.sunlightFBO.color) rc.SetUniform1i("SunShadowColorMap", SUNLIGHT_COLOR_TEXUNIT);
                    if (this.sunlightFBO.depth) rc.SetUniform1i("SunShadowDepthMap", SUNLIGHT_DEPTH_TEXUNIT);
                    rc.SetMatrix4f("SunShadowBiasMatrix", Matrix4.makeShadowBias());
                    rc.SetMatrix4f("SunShadowProjectionMatrix", this.sunlight.projectionMatrix);
                    rc.SetMatrix4f("SunShadowViewMatrix", this.sunlight.lightMatrix);
                    rc.SetUniform2f("iResolutionSunShadow", this.sunlightFBO.dimensions);
                }

                if (this.moonlightFBO.complete) {
                    this.moonlightFBO.bindTextures(15, 16);
                    if (this.sunlightFBO.color) rc.SetUniform1i("SunShadowColorMap", MOONLIGHT_COLOR_TEXUNIT);
                    if (this.sunlightFBO.depth) rc.SetUniform1i("SunShadowDepthMap", MOONLIGHT_DEPTH_TEXUNIT);
                    rc.SetMatrix4f("SunShadowBiasMatrix", Matrix4.makeShadowBias());
                    rc.SetMatrix4f("SunShadowProjectionMatrix", this.sunlight.projectionMatrix);
                    rc.SetMatrix4f("SunShadowViewMatrix", this.sunlight.lightMatrix);
                    rc.SetUniform2f("iResolutionSunShadow", this.sunlightFBO.dimensions);
                }
            }
            else {
                gl.activeTexture(gl.TEXTURE11); gl.bindTexture(gl.TEXTURE11, this._defaultT2D.texture);
                gl.activeTexture(gl.TEXTURE12); gl.bindTexture(gl.TEXTURE12, this._defaultT2D.texture);
                gl.activeTexture(gl.TEXTURE13); gl.bindTexture(gl.TEXTURE13, this._defaultT2D.texture);
                gl.activeTexture(gl.TEXTURE14); gl.bindTexture(gl.TEXTURE14, this._defaultT2D.texture);
                gl.activeTexture(gl.TEXTURE15); gl.bindTexture(gl.TEXTURE15, this._defaultT2D.texture);
                gl.activeTexture(gl.TEXTURE16); gl.bindTexture(gl.TEXTURE16, this._defaultT2D.texture);
                if (this.gbufferFBO.color) rc.SetUniform1i("GBufferColor0", GBUFFER_COLOR_TEXUNIT);
                if (this.gbufferFBO.depth) rc.SetUniform1i("GBufferDepth", GBUFFER_DEPTH_TEXUNIT);
                if (this.sunlightFBO.color) rc.SetUniform1i("SunShadowColorMap", SUNLIGHT_COLOR_TEXUNIT);
                if (this.sunlightFBO.depth) rc.SetUniform1i("SunShadowDepthMap", SUNLIGHT_DEPTH_TEXUNIT);
                if (this.moonlightFBO.color) rc.SetUniform1i("SunShadowColorMap", MOONLIGHT_COLOR_TEXUNIT);
                if (this.moonlightFBO.depth) rc.SetUniform1i("SunShadowDepthMap", MOONLIGHT_DEPTH_TEXUNIT);
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
    RenderScene(rc: RenderConfig, sceneName: string) {
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


    RenderDeferred(shaderName: string): void {
        let rc = this.UseRenderConfig(shaderName);
        if (!rc || !rc.usable) {
            //hflog.error("Scenegraph::RenderDeferred(): \"" + shaderName + "\" is not a render config");
            return;
        }

        let gl = this._renderingContext.gl;
        gl.disable(gl.DEPTH_TEST);
        rc.SetMatrix4f("ProjectionMatrix", Matrix4.makeOrtho2D(-1.0, 1.0, -1.0, 1.0));
        rc.SetMatrix4f("CameraMatrix", Matrix4.makeLookAt(
            Vector3.make(0.0, 0.0, 1.0),
            Vector3.make(0.0, 0.0, 0.0),
            Vector3.make(0.0, 1.0, 0.0)
        ));
        rc.SetMatrix4f("WorldMatrix", Matrix4.makeTranslation(0.0, 0.0, 0.0));
        this._deferredMesh.Render(rc, this);

        rc.Restore();
    }

    private processTextFile(data: string, name: string, path: string, assetType: SGAssetType): void {
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

    private processTextureMap(image: HTMLImageElement, name: string, assetType: SGAssetType): void {
        let gl = this._renderingContext.gl;

        let minFilter = gl.NEAREST;
        let magFilter = gl.NEAREST;

        let maxAnisotropy = 1.0;
        let ext = this._renderingContext.GetExtension("EXT_texture_filter_anisotropic")
        if (ext) {
            let maxAnisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        } else {
            hflog.debug("cannot use anisotropic filtering");
        }

        if (image.width == 6 * image.height) {
            let images: Array<ImageData> = new Array<ImageData>(6);
            Utils.SeparateCubeMapImages(image, images);
            let texture = gl.createTexture();
            if (texture) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                for (let i = 0; i < 6; i++) {
                    if (!images[i]) {
                        continue;
                    } else {
                        hflog.debug("image " + i + " w:" + images[i].width + "/h:" + images[i].height);
                    }
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                let t = new Texture(this._renderingContext, name, name, gl.TEXTURE_CUBE_MAP, texture);
                this._textures.set(name, t);
            }
        } else {
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

    private loadScene(lines: string[][], name: string, path: string): void {
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

    private loadOBJ(lines: string[][], name: string, path: string): void {
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
        let positions: Vector3[] = [];
        let normals: Vector3[] = [];
        let colors: Vector3[] = [];
        let texcoords: Vector3[] = [];
        let mesh: IndexedGeometryMesh = new IndexedGeometryMesh(this._renderingContext);

        // in case there are no mtllib's, usemtl's, o's, g's, or s's
        mesh.BeginSurface(gl.TRIANGLES);
        for (let tokens of lines) {
            if (tokens.length >= 3) {
                if (tokens[0] == "v") {
                    positions.push(Utils.TextParser.ParseVector(tokens));
                } else if (tokens[0] == "vn") {
                    normals.push(Utils.TextParser.ParseVector(tokens));
                } else if (tokens[0] == "vt") {
                    texcoords.push(Utils.TextParser.ParseVector(tokens));
                } else if (tokens[0] == "f") {
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
                } else if (tokens[0] == "usemtl") {
                    mesh.SetMtl(Utils.TextParser.ParseIdentifier(tokens));
                    mesh.BeginSurface(gl.TRIANGLES);
                } else if (tokens[0] == "o") {
                    mesh.BeginSurface(gl.TRIANGLES);
                } else if (tokens[0] == "g") {
                    mesh.BeginSurface(gl.TRIANGLES);
                } else if (tokens[0] == "s") {
                    mesh.BeginSurface(gl.TRIANGLES);
                }
            }
        }

        mesh.BuildBuffers();
        this._meshes.set(name, mesh);
    }

    private loadMTL(lines: string[][], name: string, path: string): void {
        // newmtl <name: string>
        // Kd <color: Vector3>
        // Ks <color: Vector3>
        // map_Kd <url: string>
        // map_Ks <url: string>
        // map_normal <url: string>
        let mtl = "";
        let mtllib = Utils.TextParser.MakeIdentifier(name);
        let curmtl: Material | undefined;
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
                } else if (tokens[0] == "Kd") {
                    if (curmtl) {
                        curmtl.Kd = Utils.TextParser.ParseVector(tokens);
                    }
                } else if (tokens[0] == "Ks") {
                    if (curmtl) {
                        curmtl.Ks = Utils.TextParser.ParseVector(tokens);
                    }
                } else if (tokens[0] == "Ka") {
                    if (curmtl) {
                        curmtl.Ka = Utils.TextParser.ParseVector(tokens);
                    }
                } else if (tokens[0] == "PBn2") {
                    if (curmtl) {
                        curmtl.PBn2 = parseFloat(tokens[1]);
                    }
                } else if (tokens[0] == "PBk2") {
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

    getFBO(name: string): FBO {
        let fbo = this._fbo.get(name);
        if (!fbo) return this._defaultFBO;
        return fbo;
    }
}
