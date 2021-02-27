import Step from './step.d'

type Workout = {
  name: string;
  steps: Array<Step>;
  createdAt: Date;
  updatedAt: Date;
}

export default Workout
