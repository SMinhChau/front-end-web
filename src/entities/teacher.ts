interface Teacher{
    id: any;
    username: string;
    avatar: string;
    name: string;
    email: string;
    phoneNumber: string;
    gender: string;
    role: "admin" | "Lecturer" | "teacher-v2";
    majors: {
        id: number;
    };
    degree: string;
}
export default Teacher