import classNames from "classnames/bind";
import style from "./GroupEvaluation.module.scss";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import Term from "~/entities/term";
import {
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    InputNumber,
    Modal,
    Row,
    Select,
    Skeleton,
    Space,
    Spin,
    Table,
} from "antd";
import termService from "~/services/term";
import groupService from "~/services/group";
import { useAppSelector } from "~/redux/hooks";
import {
    EditOutlined,
} from "@ant-design/icons";
import lecturerService from "~/services/lecturer";
import transcriptService from "~/services/transcript";
import Teacher from "~/entities/teacher";
import { useParams, useSearchParams } from "react-router-dom";
import Input from "antd/es/input/Input";
import Student from "~/pages/student/Student";


const cls = classNames.bind(style);
interface GroupLecturer {
    id: number;
    name: string;
    members: {
        id: number;
        lecturer: Teacher;
        groupLecturer: number;
    }[];
}
interface Transcript {
    id: number,
    name: string,
    gradeMax: number,
    description: string,
    type: string,
    term: {
        id: number
    },
    grade: number
}
interface Student {
    id: 4,
    majors: {
        id: 1
    },
    username: string,
    avatar: string,
    phoneNumber: string,
    email: string,
    name: string,
}
interface GroupStudent {

    id: number;
    name: string;
    term: {
        id: number;
    },
    topic: {
        id: number;
    }
    members: {
        id: number,
        student: Student,
        group: {
            id: number
        }
    }[]

}
interface Grade {
    idEvaluation: number,
    grade: number
    gradeMax: number,
}
interface GroupLecturerTable extends GroupLecturer {
    key: number;
}

const GroupEvaluation = () => {
    const [term, setTerm] = useState<Array<Term>>([]);
    const [grades, setGrades] = useState<
        Array<Grade>
    >([]);
    const [group, setGroup] = useState<GroupStudent>();
    const [transcripts, setTranscripts] = useState<Transcript[]>();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAppSelector((state) => state.user);
    const userState = useAppSelector((state) => state.user).user;
    const [loadingInfoGroup, setLoadingInfoGroup] = useState(false);
    const [loadingTranscript, setLoadingTranscript] = useState(false);
    const [studentTranscript, setStudentTranscript] = useState<Student | null>();

    const [studentIdSelect, setStudentIdSelect] = useState<number | null>(null);
    const param: any = useParams()

    useEffect(() => {
        termService
            .getTerm({ majorsId: user.majors.id })
            .then((response) => {
                setTerm(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    useEffect(() => {
        groupService
            .getGroupById(param.id)
            .then((response) => {
                setGroup(response.data);
                setLoadingInfoGroup(true)

            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    const loadTranscriptStudent = (id: any) => {
        setTranscripts([])
        setStudentTranscript(null)
        setLoadingTranscript(true)
        setGrades([])
        setStudentIdSelect(id)
        transcriptService
            .getTranscripts(param.id, userState?.id, id, searchParams.get("type")!)
            .then((result) => {
                setTranscripts(result?.data)
                setGrades(result?.data.map((e: any) => {
                    return {
                        idEvaluation: e.id,
                        grade: e.grade,
                        gradeMax: e.gradeMax
                    }
                }))
                const member = group?.members.find(e => e.student.id == id)
                setStudentTranscript(member?.student)
                setLoadingTranscript(false)
            })

            .catch((error) => {
                toast.info(error.response.data.error, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoadingTranscript(false)
            });
    };
    const getGradeById = (id: number) => {
        return grades.find((e: Grade) => e?.idEvaluation === id);
    }
    const handlerChangeGrade = (id: number, grade: number) => {
        grades.find((e: Grade) => {
            if (e.idEvaluation === id) {
                e.grade = grade
            }
        });
    }
    const getEvalutionName = () => {
        switch (searchParams.get("type")) {
            case "ADVISOR": return "Giáo viên hướng dẫn"
            case "REVIEWER": return "Phản biện"
            case "SESSION_HOST": return "Hội đồng"

        }
    }
    const handlerSubmitTranscript = () => {
        if (grades.length == 0 || !studentIdSelect) {
            return
        }
        setLoadingTranscript(true)

        const data = {
            assignId: Number(searchParams.get("assignId")),
            studentId: studentIdSelect,
            transcripts: grades

        }
        transcriptService
            .postTranscripts(data)
            .then((result) => {
                toast.info("Chấm điểm thành công", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })

            .catch((error) => {
                toast.info(JSON.stringify(error.response.data.error) || "Chấm điểm thất bại", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoadingTranscript(false)
            });

    }
    const columns = [
        {
            title: "Tên tiêu chí",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Điểm tối đa",
            dataIndex: "gradeMax",
            key: "gradeMax",
        },
        {
            title: "Điểm",
            dataIndex: "id",
            render: (id: any) => {
                const grade = getGradeById(id)
                return (
                    < InputNumber step="0.25" min={0} max={grade?.gradeMax || 1} onChange={(e: any) => handlerChangeGrade(id, e)
                    } defaultValue={grade?.grade} style={{ width: 70 }} id={id} />
                )
            }
        },
    ];

    const columnsLecturer = [
        {
            title: "Mã SV",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Tên SV",
            dataIndex: "name",
            key: "name",
        },
        // {
        //     title: "Trạng thái",
        //     dataIndex: "status",
        //     render: () => (
        //         <CheckSquareFilled style={{ color: "#73d13d" }} />
        //     ),
        // },
        {
            title: "Chấm điểm",
            dataIndex: "id",
            render: (id: any) => (
                <Button onClick={() => loadTranscriptStudent(id)}>
                    <EditOutlined style={{ color: "red" }} />
                </Button>
            ),
        },
    ];
    return (
        <div className={cls("group_evaluation")}>
            <ToastContainer />
            <Row className={cls("row")}>
                <Col span={9} className={cls("group-col")} >
                    <Row justify={"space-between"} style={{ height: "100%" }}>
                        <Col span={24} >
                            <div className={cls("info_item_des")} >
                                <Descriptions
                                    title={<h3 className={cls("title_info")}>Thông tin nhóm</h3>}
                                ></Descriptions>
                                <Skeleton loading={!loadingInfoGroup} active paragraph={{ rows: 5 }} >
                                    <Descriptions title={<></>}>

                                        <Descriptions.Item
                                            label={<p className={cls("title_info_group")}>Tên nhóm</p>}
                                            span={1}
                                        >
                                            <h4 className={cls("name_group")}>{group?.name}</h4>
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Divider plain>     Danh sách sinh viên</Divider>


                                    <Table
                                        dataSource={group?.members.map((value) => {
                                            return {
                                                id: value?.student?.id,
                                                username: value?.student?.username,
                                                name: value?.student?.name,
                                            };
                                        })}
                                        columns={columnsLecturer}
                                        pagination={false}
                                    />
                                </Skeleton>
                            </div>
                        </Col>

                    </Row>
                </Col>
                <Col span={15} style={{ backgroundColor: "#ffff" }} className={cls("transcript-col")}>
                    <Spin spinning={loadingTranscript}>
                        <Descriptions
                            title={<h3 className={cls("title_info")}>Bảng điểm - {getEvalutionName()}</h3>}
                        ></Descriptions>
                        <Descriptions title={<></>}>
                            <Descriptions.Item
                                label={<p className={cls("title_info_student")}>MSSV</p>}
                                span={1}
                            >
                                <h4 className={cls("name_group")}>{studentTranscript?.username}</h4>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<p className={cls("title_info_student")}>Tên SV</p>}
                                span={1}
                            >
                                <h4 className={cls("name_group")}>{studentTranscript?.name}</h4>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<p className={cls("title_info_student")}>Email</p>}
                                span={1}
                            >
                                <h4 className={cls("name_group")}>{studentTranscript?.email}</h4>
                            </Descriptions.Item>

                        </Descriptions>
                        <Divider plain>     Danh sách Tiêu chí</Divider>
                        <div className={cls("group_content")}>
                            <Table dataSource={transcripts} columns={columns} pagination={false} />
                        </div>
                        <div className={cls("submit-grade")}>
                            <Button type="primary" size="large" onClick={handlerSubmitTranscript}>Chấm điểm</Button>
                        </div>
                    </Spin>
                </Col>
            </Row >
        </div >
    );
};

export default GroupEvaluation;
