export abstract class AbstractCalculator<TInput, TOutput> {
  run(data: TInput, quantity?: number): TOutput {
    const result = this.calculate(data, quantity);

    return result;
  }

  protected abstract calculate(data: TInput, quantity?: number): TOutput;
}
