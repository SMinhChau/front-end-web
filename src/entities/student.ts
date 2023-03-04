interface Student {
    id: number;
    username: string;
    createdAt?: Date;
    email?: string;
    gender?: string | number | boolean;
    majors: {
        id: number;
    };
    name?: string;
    phoneNumber?: string;
    schoolYear?: string;
    typeTraining?: string;
    updatedAt?: Date;
}
export default Student;

