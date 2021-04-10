import StepType from './stepType'

type Step = {
  id: string;
  type: StepType;
  name?: string;
  duration: number;
  isNew: boolean;
}

export default Step
