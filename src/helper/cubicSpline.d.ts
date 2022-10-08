declare module "cubic-spline" {
  declare class Spline {
    constructor(x: number[], y: number[]);
    at(t: number): number;
  }

  export default Spline;
}
