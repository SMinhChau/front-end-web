import { TypeEvalution } from './assign';
import Student from './student';
import Teacher from './teacher';

export default interface AssignAdvisor {
  id: number;
  typeEvaluation: TypeEvalution;

  group: {
    id: number;
    name: string;
    term: {
      id: number;
    };
    status: string;
    topic: {
      id: number;
    };

    members: [
      {
        id: number;
        student: Student;
        group: {
          id: number;
        };
      },
    ];
  };

  groupLecturer: {
    id: number;
    name: string;
    members: [Teacher];
  };
}
