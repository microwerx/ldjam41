
namespace Brainfish {
    export class Perceptron1Output {
        I: number[] = [];
        w: number[] = [];
        O: number = 0;
        t: number = 0;

        constructor(inputCount: number) {
            this.w.length = inputCount;
            this.I.length = inputCount;
        }

        compute(): number {
            this.O = 0.0;
            for (let i = 0; i < this.w.length; i++) {
                this.O += this.I[i] * this.w[i];
            }
            return this.O > this.t ? 1 : 0;
        }
    }

    export function CreatePerceptron1(count: number): Perceptron1Output {
        return new Perceptron1Output(count);
    }

    export function CreateLogicPerceptron(w1: number, w2: number, t: number): Perceptron1Output {
        let p = CreatePerceptron1(2);
        p.w[0] = w1;
        p.w[1] = w2;
        p.t = t;
        return p;
    }

    export function CreateANDPerceptron(): Perceptron1Output {
        return CreateLogicPerceptron(1, 1, 2);
    }

    export function CreateORPerceptron(): Perceptron1Output {
        return CreateLogicPerceptron(1, 1, 1);
    }
}
