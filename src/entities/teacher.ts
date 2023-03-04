interface Teacher {
    id: any;
    username: string;
    avatar: string;
    name: string;
    email: string;
    phoneNumber: string;
    gender: string;
    role: "admin" | "headLecturer" | "Lecturer";
    majors: {
        id: number;
    };
    degree: string;
}
export default Teacher;
