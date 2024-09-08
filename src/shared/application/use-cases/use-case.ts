export interface UseCaseInterface <Input, Output> {
  execute(input: Input): Promise<Output> | Output;
}
