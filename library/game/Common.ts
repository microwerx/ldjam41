/// <reference path="../gte/GTE.ts" />

const PLAYER = 0;
const THINCAMEL = 1;
const NORMALCAMEL = 2;
const FATCAMEL = 3;
const ARROW = 4;
const RICESACK = 5;
const RICEBOWL = 6;
const GRAVESTONE = 7;
const HEART = 8;
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

function CreateSprites(): [number, number][] {
    let sprites:[number, number][] = new Array(MAX_SPRITES);
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
    sprites[HEART] = [21, 21];
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
