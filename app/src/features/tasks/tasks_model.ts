export interface Task {
  id: number;
  name: string;
  description: string;
  functionName: string;
  code: string;
  complexity: number;
  createDate: Date;
  testArguments: string;
  numberOfTimesSolved: number;
  isOpen: boolean;
  tags: any[];
  isActive?: boolean;
}
export interface ExecutorResult {
    value: Value;
}

export interface Value {
    functionName:             string;
    wasLaunchedWithArguments: any[];
    theResultWasObtained:     number;
    theResultWasExpected:     number;
    status:                   boolean;
}

