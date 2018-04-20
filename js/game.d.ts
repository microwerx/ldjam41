declare class Vector2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    copy(v: Vector2): Vector2;
    clone(): Vector2;
    reset(x: number, y: number): Vector2;
    add(v: Vector2): Vector2;
    sub(v: Vector2): Vector2;
    mul(multiplicand: number): Vector2;
    div(divisor: number): Vector2;
    neg(): Vector2;
    toFloat32Array(): Float32Array;
    toVector2(): Vector2;
    toVector3(): Vector3;
    toVector4(): Vector4;
    project(): number;
    length(): number;
    lengthSquared(): number;
    norm(): Vector2;
    static make(x: number, y: number): Vector2;
    static dot(v1: Vector2, v2: Vector2): number;
    static cross(a: Vector2, b: Vector2): number;
    static normalize(v: Vector2): Vector2;
}
declare class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    copy(v: Vector3): Vector3;
    clone(): Vector3;
    reset(x?: number, y?: number, z?: number): Vector3;
    static makeFromSpherical(theta: number, phi: number): Vector3;
    static makeFromSphericalISO(rho: number, thetaInRadians: number, phiInRadians: number): Vector3;
    static makeFromSphericalMath(rho: number, thetaInRadians: number, phiInRadians: number): Vector3;
    setFromSpherical(theta: number, phi: number): Vector3;
    readonly theta: number;
    readonly phi: number;
    static make(x: number, y: number, z: number): Vector3;
    static makeUnit(x: number, y: number, z: number): Vector3;
    static distance(a: Vector3, b: Vector3): number;
    add(v: Vector3): Vector3;
    sub(v: Vector3): Vector3;
    mul(multiplicand: number): Vector3;
    div(divisor: number): Vector3;
    neg(): Vector3;
    reciprocal(): Vector3;
    pow(power: number): Vector3;
    compdiv(divisor: Vector3): Vector3;
    compmul(multiplicand: Vector3): Vector3;
    toArray(): number[];
    toFloat32Array(): Float32Array;
    toVector2(): Vector2;
    toVector4(w: number): Vector4;
    project(): Vector2;
    length(): number;
    lengthSquared(): number;
    norm(): Vector3;
    normalize(): Vector3;
    get(index: number): number;
    static dot(v1: Vector3, v2: Vector3): number;
    static cross(a: Vector3, b: Vector3): Vector3;
    static add(a: Vector3, b: Vector3): Vector3;
    static sub(a: Vector3, b: Vector3): Vector3;
    static mul(a: Vector3, b: Vector3): Vector3;
    static div(a: Vector3, b: Vector3): Vector3;
}
declare class Vector4 {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    copy(v: Vector4): Vector4;
    clone(): Vector4;
    reset(x?: number, y?: number, z?: number, w?: number): Vector4;
    add(v: Vector4): Vector4;
    sub(v: Vector4): Vector4;
    mul(multiplicand: number): Vector4;
    div(divisor: number): Vector4;
    neg(): Vector4;
    toFloat32Array(): Float32Array;
    toArray(): number[];
    toVector2(): Vector2;
    toVector3(): Vector3;
    project(): Vector3;
    length(): number;
    lengthSquared(): number;
    norm(): Vector4;
    static dot(v1: Vector4, v2: Vector4): number;
    static normalize(v: Vector4): Vector4;
    static make(x: number, y: number, z: number, w: number): Vector4;
    static makeUnit(x: number, y: number, z: number, w: number): Vector4;
}
declare class Matrix2 {
    m11: number;
    m21: number;
    m12: number;
    m22: number;
    constructor(m11: number, m21: number, m12: number, m22: number);
    static makeIdentity(): Matrix2;
    static makeZero(): Matrix2;
    static makeColMajor(m11: number, m21: number, m12: number, m22: number): Matrix2;
    static makeRowMajor(m11: number, m12: number, m21: number, m22: number): Matrix2;
    static fromRowMajorArray(v: number[]): Matrix2;
    static fromColMajorArray(v: number[]): Matrix2;
    static makeScale(x: number, y: number): Matrix2;
    static makeRotation(angleInDegrees: number, x: number, y: number, z: number): Matrix2;
    asColMajorArray(): number[];
    asRowMajorArray(): number[];
    static multiply(m1: Matrix2, m2: Matrix2): Matrix2;
    copy(m: Matrix2): Matrix2;
    concat(m: Matrix2): Matrix2;
    transform(v: Vector2): Vector2;
    asInverse(): Matrix2;
    asTranspose(): Matrix2;
}
declare class Matrix3 {
    m11: number;
    m21: number;
    m31: number;
    m12: number;
    m22: number;
    m32: number;
    m13: number;
    m23: number;
    m33: number;
    constructor(m11: number, m21: number, m31: number, m12: number, m22: number, m32: number, m13: number, m23: number, m33: number);
    static makeIdentity(): Matrix3;
    static makeZero(): Matrix3;
    static makeColMajor(m11: number, m21: number, m31: number, m12: number, m22: number, m32: number, m13: number, m23: number, m33: number): Matrix3;
    static makeRowMajor(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3;
    static fromRowMajorArray(v: number[]): Matrix3;
    static fromColMajorArray(v: number[]): Matrix3;
    static makeScale(x: number, y: number, z: number): Matrix3;
    static makeRotation(angleInDegrees: number, x: number, y: number, z: number): Matrix3;
    static makeCubeFaceMatrix(face: number): Matrix3;
    asColMajorArray(): number[];
    asRowMajorArray(): number[];
    static multiply(m1: Matrix3, m2: Matrix3): Matrix3;
    LoadIdentity(): Matrix3;
    MultMatrix(m: Matrix3): Matrix3;
    LoadColMajor(m11: number, m21: number, m31: number, m12: number, m22: number, m32: number, m13: number, m23: number, m33: number): Matrix3;
    LoadRowMajor(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3;
    toMatrix4(): Matrix4;
    copy(m: Matrix3): Matrix3;
    clone(): Matrix3;
    concat(m: Matrix3): Matrix3;
    transform(v: Vector3): Vector3;
    asInverse(): Matrix3;
    asTranspose(): Matrix3;
}
declare class Matrix4 {
    m11: number;
    m21: number;
    m31: number;
    m41: number;
    m12: number;
    m22: number;
    m32: number;
    m42: number;
    m13: number;
    m23: number;
    m33: number;
    m43: number;
    m14: number;
    m24: number;
    m34: number;
    m44: number;
    constructor(m11?: number, m21?: number, m31?: number, m41?: number, m12?: number, m22?: number, m32?: number, m42?: number, m13?: number, m23?: number, m33?: number, m43?: number, m14?: number, m24?: number, m34?: number, m44?: number);
    copy(m: Matrix4): Matrix4;
    clone(): Matrix4;
    row(i: number): Vector4;
    col(i: number): Vector4;
    row3(i: number): Vector3;
    col3(i: number): Vector3;
    diag3(): Vector3;
    LoadRowMajor(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4;
    LoadColMajor(m11: number, m21: number, m31: number, m41: number, m12: number, m22: number, m32: number, m42: number, m13: number, m23: number, m33: number, m43: number, m14: number, m24: number, m34: number, m44: number): Matrix4;
    LoadIdentity(): Matrix4;
    Translate(x: number, y: number, z: number): Matrix4;
    Rotate(angleInDegrees: number, x: number, y: number, z: number): Matrix4;
    Scale(sx: number, sy: number, sz: number): Matrix4;
    LookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4;
    Frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    Ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    Ortho2D(left: number, right: number, bottom: number, top: number): Matrix4;
    PerspectiveX(fovx: number, aspect: number, near: number, far: number): Matrix4;
    PerspectiveY(fovy: number, aspect: number, near: number, far: number): Matrix4;
    ShadowBias(): Matrix4;
    CubeFaceMatrix(face: number): Matrix4;
    static makeIdentity(): Matrix4;
    static makeZero(): Matrix4;
    static makeColMajor(m11: number, m21: number, m31: number, m41: number, m12: number, m22: number, m32: number, m42: number, m13: number, m23: number, m33: number, m43: number, m14: number, m24: number, m34: number, m44: number): Matrix4;
    static makeRowMajor(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4;
    static fromRowMajorArray(v: number[]): Matrix4;
    static fromColMajorArray(v: number[]): Matrix4;
    static makeTranslation(x: number, y: number, z: number): Matrix4;
    static makeScale(x: number, y: number, z: number): Matrix4;
    static makeRotation(angleInDegrees: number, x: number, y: number, z: number): Matrix4;
    static makeOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    static makeOrtho2D(left: number, right: number, bottom: number, top: number): Matrix4;
    static makeFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    static makePerspectiveY(fovy: number, aspect: number, near: number, far: number): Matrix4;
    static makePerspectiveX(fovx: number, aspect: number, near: number, far: number): Matrix4;
    static makeLookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4;
    static makeLookAt2(eye: Vector3, center: Vector3, up: Vector3): Matrix4;
    static makeShadowBias(): Matrix4;
    static makeCubeFaceMatrix(face: number): Matrix4;
    toColMajorArray(): number[];
    toRowMajorArray(): number[];
    static multiply3(a: Matrix4, b: Matrix4, c: Matrix4): Matrix4;
    static multiply(m1: Matrix4, m2: Matrix4): Matrix4;
    LoadMatrix(m: Matrix4): Matrix4;
    MultMatrix(m: Matrix4): Matrix4;
    transform(v: Vector4): Vector4;
    asInverse(): Matrix4;
    asTranspose(): Matrix4;
}
declare namespace GTE {
    function oscillate(t: number, frequency?: number, phase?: number, amplitude?: number, offset?: number): number;
    function oscillateBetween(t: number, frequency?: number, phase?: number, lowerLimit?: number, upperLimit?: number): number;
    function clamp(x: number, a: number, b: number): number;
    function lerp(a: number, b: number, x: number): number;
    function smoothstep(a: number, b: number, x: number): number;
    function smootherstep(a: number, b: number, x: number): number;
    function distancePointLine2(point: Vector2, linePoint1: Vector2, linePoint2: Vector2): number;
    function gaussian(x: number, center: number, sigma: number): number;
    function min3(a: number, b: number, c: number): number;
    function max3(a: number, b: number, c: number): number;
}
declare class Hatchetfish {
    private _logElementId;
    private _logElement;
    private _numLines;
    constructor(logElementId?: string);
    logElement: string;
    clear(): void;
    private writeToLog(prefix, message, ...optionalParams);
    log(message: string, ...optionalParams: any[]): void;
    info(message: string, ...optionalParams: any[]): void;
    error(message: string, ...optionalParams: any[]): void;
    warn(message: string, ...optionalParams: any[]): void;
    debug(message: string, ...optionalParams: any[]): void;
}
declare var hflog: Hatchetfish;
declare class Toadfish {
    private _context;
    private _soundVolume;
    private _sounds;
    private _buffers;
    private _curbuffer;
    constructor();
    setSound(name: string, ab: AudioBuffer): void;
    setVolume(amount: number): void;
    playSound(name: string): void;
    queueSound(name: string, url: string): void;
}
declare class RenderingContext {
    width: number;
    height: number;
    private enabledExtensions;
    private divElement_;
    private canvasElement_;
    gl: WebGLRenderingContext;
    aspectRatio: number;
    private _visible;
    constructor(width?: number, height?: number);
    EnableExtensions(names: string[]): boolean;
    GetExtension(name: string): any;
    readonly canvas: HTMLCanvasElement;
    readonly hidden: boolean;
    focus(): void;
    hide(): void;
    show(): void;
}
declare class RenderConfig {
    private _context;
    private _vertShaderSource;
    private _fragShaderSource;
    private _isCompiled;
    private _isLinked;
    private _vertShader;
    private _fragShader;
    private _program;
    private _vertShaderInfoLog;
    private _fragShaderInfoLog;
    private _vertShaderCompileStatus;
    private _fragShaderCompileStatus;
    private _programInfoLog;
    private _programLinkStatus;
    uniforms: Map<string, WebGLUniformLocation | null>;
    uniformInfo: Map<string, WebGLActiveInfo | null>;
    useDepthTest: boolean;
    depthTest: number;
    depthMask: boolean;
    usesFBO: boolean;
    renderShadowMap: boolean;
    renderGBuffer: boolean;
    constructor(_context: RenderingContext, _vertShaderSource: string, _fragShaderSource: string);
    readonly usable: boolean;
    IsCompiledAndLinked(): boolean;
    Use(): void;
    Restore(): void;
    SetMatrix4f(uniformName: string, m: Matrix4): void;
    SetUniform1i(uniformName: string, x: number): void;
    SetUniform1f(uniformName: string, x: number): void;
    SetUniform2f(uniformName: string, v: Vector2): void;
    SetUniform3f(uniformName: string, v: Vector3): void;
    SetUniform4f(uniformName: string, v: Vector4): void;
    GetAttribLocation(name: string): number;
    GetUniformLocation(name: string): WebGLUniformLocation | null;
    Reset(vertShaderSource: string, fragShaderSource: string): boolean;
    private updateActiveUniforms();
}
declare class Camera {
    _transform: Matrix4;
    private _center;
    private _eye;
    private _angleOfView;
    private _aspectRatio;
    private _znear;
    private _zfar;
    projection: Matrix4;
    pretransform: Matrix4;
    posttransform: Matrix4;
    constructor();
    readonly transform: Matrix4;
    aspectRatio: number;
    angleOfView: number;
    zfar: number;
    znear: number;
    readonly position: Vector3;
    readonly right: Vector3;
    readonly left: Vector3;
    readonly up: Vector3;
    readonly down: Vector3;
    readonly forward: Vector3;
    readonly backward: Vector3;
    eye: Vector3;
    center: Vector3;
    moveTo(position: Vector3): void;
    move(delta: Vector3): Vector3;
    turn(delta: Vector3): void;
    setOrbit(azimuthInDegrees: number, pitchInDegrees: number, distance: number): Matrix4;
    setLookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4;
}
declare class Surface {
    readonly mode: number;
    readonly offset: number;
    mtllib: string;
    mtl: string;
    count: number;
    constructor(mode: number, offset: number, mtllib: string, mtl: string);
    Add(): void;
}
declare class Vertex {
    position: Vector3;
    normal: Vector3;
    color: Vector3;
    texcoord: Vector3;
    constructor(position?: Vector3, normal?: Vector3, color?: Vector3, texcoord?: Vector3);
    asFloat32Array(): Float32Array;
    asArray(): Array<number>;
}
declare class Material {
    name: string;
    Kd: Vector3;
    Ka: Vector3;
    Ks: Vector3;
    map_Kd_mix: number;
    map_Kd: string;
    map_Ks_mix: number;
    map_Ks: string;
    map_normal_mix: number;
    map_normal: string;
    PBKsm: number;
    PBKdm: number;
    PBn2: number;
    PBk2: number;
    minFilter: number;
    magFilter: number;
    constructor(name: string);
}
declare class FBO {
    private _renderingContext;
    readonly depth: boolean;
    readonly color: boolean;
    readonly width: number;
    readonly height: number;
    readonly colorType: number;
    private _fbo;
    private _colorTexture;
    private _depthTexture;
    private _colorType;
    private _complete;
    private _colorUnit;
    private _depthUnit;
    private _savedViewport;
    clearColor: Vector3;
    private _powerOfTwoDimensions;
    readonly complete: boolean;
    readonly dimensions: Vector2;
    constructor(_renderingContext: RenderingContext, depth: boolean, color: boolean, width: number, height: number, colorType: number);
    make(): void;
    use(clearScreen?: boolean, disableColorWrites?: boolean): void;
    restore(): void;
    bindTextures(colorUnit?: number, depthUnit?: number): void;
    unbindTextures(): void;
}
declare class DirectionalLight {
    private _direction;
    private _center;
    private _eye;
    private _distance;
    private _zfar;
    private _znear;
    private _E0;
    private _transform;
    private _isOrbit;
    private _zoom;
    private _offset;
    constructor();
    distance: number;
    direction: Vector3;
    center: Vector3;
    dirto: Vector3;
    E0: Vector3;
    setOrbit(azimuthInDegrees: number, pitchInDegrees: number, distance: number): Matrix4;
    readonly lightMatrix: Matrix4;
    readonly projectionMatrix: Matrix4;
}
declare namespace Colors {
    const Black: Vector3;
    const White: Vector3;
    const Gray66: Vector3;
    const Gray33: Vector3;
    const Red: Vector3;
    const Orange: Vector3;
    const Yellow: Vector3;
    const Green: Vector3;
    const Cyan: Vector3;
    const Blue: Vector3;
    const Indigo: Vector3;
    const Violet: Vector3;
    const Magenta: Vector3;
    const Brown: Vector3;
    const SkyBlue: Vector3;
    const DarkRed: Vector3;
    const DarkCyan: Vector3;
    const DarkGreen: Vector3;
    const DarkMagenta: Vector3;
    const DarkBlue: Vector3;
    const DarkYellow: Vector3;
    const LightRed: Vector3;
    const LightCyan: Vector3;
    const LightGreen: Vector3;
    const LightMagenta: Vector3;
    const LightBlue: Vector3;
    const LightYellow: Vector3;
    const ArneOrange: Vector3;
    const ArneYellow: Vector3;
    const ArneDarkGreen: Vector3;
    const ArneGreen: Vector3;
    const ArneSlimeGreen: Vector3;
    const ArneNightBlue: Vector3;
    const ArneSeaBlue: Vector3;
    const ArneSkyBlue: Vector3;
    const ArneCloudBlue: Vector3;
    const ArneDarkBlue: Vector3;
    const ArneDarkGray: Vector3;
    const ArneLightGray: Vector3;
    const ArneDarkRed: Vector3;
    const ArneRose: Vector3;
    const ArneTaupe: Vector3;
    const ArneGold: Vector3;
    const ArneTangerine: Vector3;
    const ArneHoney: Vector3;
    const ArneMossyGreen: Vector3;
    const ArneDarkCyan: Vector3;
    const ArneCyan: Vector3;
    const ArneBlue: Vector3;
    const ArneIndigo: Vector3;
    const ArnePink: Vector3;
    const ArneSkin: Vector3;
    const ArneBlack: Vector3;
}
declare class IndexedGeometryMesh {
    private _renderingContext;
    vertices: number[];
    indices: number[];
    surfaces: Surface[];
    private _mtllib;
    private _mtl;
    private _vertex;
    private _dirty;
    private _vbo;
    private _ibo;
    private _vboData;
    private _iboData;
    constructor(_renderingContext: RenderingContext);
    Reset(): void;
    SetMtllib(mtllib: string): void;
    SetMtl(mtl: string): void;
    BeginSurface(mode: number): void;
    AddIndex(i: number): void;
    readonly currentIndexCount: number;
    SetNormal(n: Vector3): void;
    SetColor(c: Vector3): void;
    SetTexCoord(t: Vector3): void;
    AddVertex(v: Vector3): void;
    BuildBuffers(): void;
    Render(rc: RenderConfig, sg: Scenegraph): void;
}
declare class MatrixStack {
    private _matrix;
    constructor();
    Push(): void;
    Pop(): void;
    toColMajorArray(): Array<number>;
    toRowMajorArray(): Array<number>;
    readonly empty: boolean;
    readonly length: number;
    readonly m: Matrix4;
}
declare namespace Utils {
    function GetURLResource(url: string): string;
    function GetURLPath(url: string): string;
    function IsExtension(sourceString: string, extensionWithDot: string): boolean;
    function GetExtension(sourceString: string): string;
    class TextFileLoader {
        private callbackfn;
        private _loaded;
        private _failed;
        data: string;
        name: string;
        readonly loaded: boolean;
        readonly failed: boolean;
        constructor(url: string, callbackfn: (data: string, name: string, parameter: number) => void, parameter?: number);
    }
    class ImageFileLoader {
        private callbackfn;
        private _loaded;
        private _failed;
        image: HTMLImageElement;
        name: string;
        readonly loaded: boolean;
        readonly failed: boolean;
        constructor(url: string, callbackfn: (data: HTMLImageElement, name: string, parameter: number) => void, parameter?: number);
    }
    function niceTimestamp(timestamp: number): string;
    function niceFramesPerSecond(t0: number, t1: number): string;
    function niceDuration(t0: number, t1: number): string;
    function round3(x: number): number;
    function round3str(x: number): string;
    function niceVector(v: Vector3): string;
    function niceNumber(x: number, digits: number): string;
    function niceMatrix4(m: Matrix4): string;
    function SeparateCubeMapImages(image: HTMLImageElement, images: null[] | ImageData[]): void;
    class TextParser {
        readonly lines: Array<string[]>;
        constructor(data: string);
        static MakeIdentifier(token: string): string;
        static ParseIdentifier(tokens: string[]): string;
        static ParseFloat(tokens: string[]): number;
        static ParseVector(tokens: string[]): Vector3;
        static ParseArray(tokens: string[]): number[];
        static ParseMatrix(tokens: string[]): Matrix4;
        static ParseFaceIndices(_token: string): Array<number>;
        static ParseFace(tokens: string[]): number[];
    }
    class ShaderLoader {
        vertShaderUrl: string;
        fragShaderUrl: string;
        private callbackfn;
        private vertLoaded;
        private fragLoaded;
        private vertFailed;
        private fragFailed;
        vertShaderSource: string;
        fragShaderSource: string;
        readonly failed: boolean;
        readonly loaded: boolean;
        constructor(vertShaderUrl: string, fragShaderUrl: string, callbackfn: (vertShaderSource: string, fragShaderSource: string) => void);
    }
    class GLTypeInfo {
        type: number;
        baseType: number;
        components: number;
        sizeOfType: number;
        constructor(type: number, baseType: number, components: number, sizeOfType: number);
        CreateArray(size: number): Float32Array | Int32Array | Int16Array | Uint32Array | Uint16Array | Uint8ClampedArray | null;
    }
    var WebGLTypeInfo: Map<number, GLTypeInfo>;
}
declare class Texture {
    private _renderingContext;
    name: string;
    url: string;
    target: number;
    texture: WebGLTexture;
    id: string;
    constructor(_renderingContext: RenderingContext, name: string, url: string, target: number, texture: WebGLTexture);
    makeDefaultTexture(): void;
}
declare class ScenegraphNode {
    name: string;
    parent: string;
    geometryGroup: string;
    private _transform;
    private _pretransform;
    private _posttransform;
    private _worldMatrix;
    newlyCreated: boolean;
    constructor(name?: string, parent?: string, geometryGroup?: string);
    transform: Matrix4;
    pretransform: Matrix4;
    posttransform: Matrix4;
    readonly worldTransform: Matrix4;
    readonly position: Vector3;
    distance(otherNode: ScenegraphNode): number;
    dirto(otherNode: ScenegraphNode): Vector3;
    private _calcWorldMatrix();
}
declare enum SGAssetType {
    Scene = 0,
    GeometryGroup = 1,
    MaterialLibrary = 2,
    ShaderProgram = 3,
    Image = 4,
    Text = 5,
}
declare class Scenegraph {
    private _renderingContext;
    private textfiles;
    private imagefiles;
    private shaderSrcFiles;
    private _defaultT2D;
    private _defaultTCube;
    private _defaultFBO;
    private _fbo;
    private _deferredMesh;
    private _renderConfigs;
    private _textures;
    private _materials;
    private _sceneResources;
    private _nodes;
    private _meshes;
    private _tempNode;
    textFiles: Map<string, string[][]>;
    camera: Camera;
    sunlight: DirectionalLight;
    moonlight: DirectionalLight;
    private _defaultRenderConfig;
    readonly moonlightFBO: FBO;
    readonly sunlightFBO: FBO;
    readonly gbufferFBO: FBO;
    constructor(_renderingContext: RenderingContext);
    readonly loaded: boolean;
    readonly failed: boolean;
    readonly percentLoaded: number;
    Load(url: string): void;
    AddRenderConfig(name: string, vertshaderUrl: string, fragshaderUrl: string): void;
    UseRenderConfig(name: string): RenderConfig | null;
    GetMaterial(mtllib: string, mtl: string): Material | null;
    UseMaterial(rc: RenderConfig, mtllib: string, mtl: string): void;
    RenderMesh(name: string, rc: RenderConfig): void;
    UseTexture(textureName: string, unit: number, enable?: boolean): boolean;
    HasNode(parentName: string, objectName: string): ScenegraphNode | null;
    GetNode(parentName: string, objectName: string): ScenegraphNode;
    AddNode(newNode: ScenegraphNode): ScenegraphNode;
    ClearNodes(): void;
    GetMesh(meshName: string): IndexedGeometryMesh | null;
    SetGlobalParameters(rc: RenderConfig): void;
    Restore(): void;
    RenderScene(rc: RenderConfig, sceneName: string): void;
    RenderDeferred(shaderName: string): void;
    private processTextFile(data, name, path, assetType);
    private processTextureMap(image, name, assetType);
    private loadScene(lines, name, path);
    private loadOBJ(lines, name, path);
    private loadMTL(lines, name, path);
    getFBO(name: string): FBO;
}
declare class Sprite {
    index: number;
    x: number;
    y: number;
    offset: Vector2;
    position: Vector2;
    velocity: Vector2;
    random: number;
    timealive: number;
    enabled: boolean;
    alive: number;
    active: boolean;
    constructor(index: number);
    reset(x: number, y: number): void;
    update(dt: number): void;
    static Distance(sprite1: Sprite, sprite2: Sprite): number;
    static Collide(sprite1: Sprite, sprite2: Sprite, d: number): boolean;
}
declare class GraphicsComponent {
    XOR: LibXOR;
    readonly width: number;
    readonly height: number;
    private divElement_;
    private canvasElement_;
    context: CanvasRenderingContext2D;
    OAM: Sprite[];
    sprites: HTMLImageElement;
    spriteImages: ImageData[];
    private _spritesLoaded;
    private _fontPixelHeight;
    private _fontPixelHeightOver2;
    private _fontPixelSlantAdjust;
    private _tiles;
    private _tileOffsets;
    private _cols;
    private _rows;
    private _layers;
    private _layerstride;
    private _stride;
    resizeTiles(cols: number, rows: number, layers: number): void;
    setTile(col: number, row: number, layer: number, tile: number): void;
    drawTiles(): void;
    constructor(XOR: LibXOR, width: number, height: number);
    readonly spritesLoaded: boolean;
    readonly fontHeight: number;
    setFont(fontName: string, pixelHeight: number): void;
    clearScreen(color?: string | null): void;
    loadSprites(url: string): void;
    resize(src: ImageData, dstw: number, dsth: number): ImageData;
    extractSprites(): void;
    setText(color: string, alignment: string): void;
    putText(text: string, x: number, y: number): void;
    putTextAligned(text: string, color: string, xloc: number, yloc: number, xo: number, yo: number): void;
    drawSprite(index: number, x: number, y: number): void;
    drawSprites(): void;
    readonly canvas: HTMLCanvasElement;
    readonly hidden: boolean;
    focus(): void;
    hide(): void;
    show(): void;
}
declare const KEY_BUTTON0 = 0;
declare const KEY_BUTTON1 = 1;
declare const KEY_BUTTON2 = 2;
declare const KEY_BUTTON3 = 3;
declare const KEY_BACK = 8;
declare const KEY_FORWARD = 9;
declare const KEY_SELECT = 8;
declare const KEY_START = 9;
declare const KEY_LEFT = 14;
declare const KEY_RIGHT = 15;
declare const KEY_UP = 12;
declare const KEY_DOWN = 13;
declare class InputComponent {
    buttons: number;
    wasdFormat: boolean;
    lastClick: Vector3;
    gamepadStick1: Vector3;
    gamepadStick2: Vector3;
    gamepadDpad: Vector3;
    gamepadButtons: number[];
    gamepadLB: number;
    gamepadRB: number;
    gamepadLT: number;
    gamepadRT: number;
    gamepadStart: number;
    gamepadSelect: number;
    gamepadIndex: number;
    constructor();
    update(): void;
    onmousedown(e: MouseEvent, v: Vector3): void;
    onmouseup(e: MouseEvent, v: Vector3): void;
    setkey(which: number, state: boolean): void;
    getkey(which: number): boolean;
    onkeychange(e: KeyboardEvent, state: boolean): void;
}
declare class MusicComponent {
    musicElements: HTMLAudioElement[];
    currentPiece: number;
    lastPiece: number;
    private promises;
    constructor();
    load(url: string): void;
    play(which: number): boolean;
    update(tInSeconds: number): void;
    ended(index: number): boolean;
    stop(index: number): void;
    mute(index: number): void;
    fadeOut(index: number, amount: number): number;
    fadeIn(index: number, amount: number): number;
    setVolume(index: number, volume: number): void;
    getVolume(index: number): number;
}
declare class TimerComponent {
    dt: number;
    t0: number;
    t1: number;
    timers: Map<string, number>;
    constructor();
    update(tInSeconds: number): void;
    start(name: string, length: number): void;
    ended(name: string): boolean;
    timeleft(name: string): number;
}
declare class LibXOR {
    readonly width: number;
    readonly height: number;
    Graphics: GraphicsComponent;
    Input: InputComponent;
    Music: MusicComponent;
    Timers: TimerComponent;
    Sounds: Toadfish;
    Fluxions: RenderingContext;
    Scenegraph: Scenegraph;
    constructor(width?: number, height?: number);
    update(tInSeconds: number): void;
    readonly dt: number;
    readonly t1: number;
    readonly t0: number;
}
declare class State {
    name: string;
    alt: string;
    delayTime: number;
    queueSound: string;
    queueMusic: string;
    constructor(name: string, alt?: string, delayTime?: number, queueSound?: string, queueMusic?: string);
}
declare class StateMachine {
    states: State[];
    private _t1;
    constructor();
    update(tInSeconds: number): void;
    push(name: string, alt: string, delayTime: number): void;
    pop(): void;
    readonly topName: string;
    readonly topAlt: string;
    readonly topTime: number;
}
declare class Game {
    XOR: LibXOR;
    series: string;
    title: string;
    author: string;
    askToQuit: boolean;
    gameover: boolean;
    gamelevel: number;
    score: number;
    states: StateMachine;
    constructor();
    focus(): void;
    run(): void;
    mainloop(t: number): void;
    load(): void;
    changelevel(which: number): void;
    statePause(): boolean;
    stateMainMenu(): boolean;
    checkGameModeAskToQuit(): boolean;
    stateAskToQuit(): boolean;
    getTimeredKey(key: number, delay?: number): boolean;
    update(tInSeconds: number): void;
    display(): void;
    draw3d(): void;
    draw2d(): void;
    draw2doverlay(): void;
    setInstructions(): void;
}
declare function swapZQSD(): void;
declare let game: Game;
declare namespace Brainfish {
    class Perceptron1Output {
        I: number[];
        w: number[];
        O: number;
        t: number;
        constructor(inputCount: number);
        compute(): number;
    }
    function CreatePerceptron1(count: number): Perceptron1Output;
    function CreateLogicPerceptron(w1: number, w2: number, t: number): Perceptron1Output;
    function CreateANDPerceptron(): Perceptron1Output;
    function CreateORPerceptron(): Perceptron1Output;
}
