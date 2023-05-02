import classNames from 'classnames/bind';
import style from './GroupEvaluation.module.scss';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState, useMemo } from 'react';
import { Button, Col, Descriptions, Divider, InputNumber, Row, Skeleton, Spin, Table, Typography } from 'antd';
import groupService from '~/services/group';
import { useAppSelector } from '~/redux/hooks';
import { EditOutlined } from '@ant-design/icons';
import transcriptService from '~/services/transcript';
import Teacher from '~/entities/teacher';
import { useParams, useSearchParams } from 'react-router-dom';
import Student from '~/pages/student/Student';
import { showMessage, showMessageEror } from '~/constant';
import studentService from '~/services/student';
import TranscriptSumMary from '~/entities/transcript';

const cls = classNames.bind(style);
const { Text } = Typography;
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
    id: number;
    name: string;
    gradeMax: number;
    description: string;
    type: string;
    term: {
        id: number;
    };
    grade: number;
}
interface Student {
    id: 4;
    majors: {
        id: 1;
    };
    username: string;
    avatar: string;
    phoneNumber: string;
    email: string;
    name: string;
}
interface GroupStudent {
    id: number;
    name: string;
    term: {
        id: number;
    };
    topic: {
        id: number;
    };
    members: {
        id: number;
        student: Student;
        group: {
            id: number;
        };
    }[];
}
interface Grade {
    idEvaluation: number;
    grade: number;
    gradeMax: number;
}
interface GroupLecturerTable extends GroupLecturer {
    key: number;
}

interface ListAvg {
    grade: number;
}
const GroupEvaluation = () => {
    const [grades, setGrades] = useState<Array<Grade>>([]);
    const [group, setGroup] = useState<GroupStudent>();
    const [transcripts, setTranscripts] = useState<Transcript[]>();
    const [searchParams, setSearchParams] = useSearchParams();

    const userState = useAppSelector((state) => state.user).user;
    const [loadingInfoGroup, setLoadingInfoGroup] = useState(false);
    const [loadingTranscript, setLoadingTranscript] = useState(false);
    const [studentTranscript, setStudentTranscript] = useState<Student | null>();

    const [studentIdSelect, setStudentIdSelect] = useState<number | null>(null);
    const param: any = useParams();
    const termState = useAppSelector((state) => state.term);

    const [listAvgGrader, setListAvgGrader] = useState<Array<ListAvg>>([]);
    const [avgGrader, setAvgGrader] = useState(0);
    const [transcriptsSummary, setTranscriptsSummary] = useState<TranscriptSumMary>();
    const [avgSummary, setAvgSummary] = useState<number | null>(null);

    useEffect(() => {
        groupService
            .getGroupById(param.id)
            .then((response) => {
                setGroup(response.data);
                setLoadingInfoGroup(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const getTranscriptsSummaryBhyStudentId = (_id: number) => {
        studentService
            .getTranscriptsSummary(_id, termState.termIndex.id)
            .then((result) => {
                console.log('getTranscriptsSummary -> result', result.data);
                setTranscriptsSummary(result.data);
            })
            .catch((er) => console.log('er', er));
    };

    useEffect(() => {
        switch (searchParams.get('type')) {
            case 'ADVISOR':
                return setAvgSummary(Number(transcriptsSummary?.ADVISOR.avgGrader))
            case 'REVIEWER':
                return setAvgSummary(Number(transcriptsSummary?.REVIEWER.avgGrader))
            case 'SESSION_HOST':
                return setAvgSummary(Number(transcriptsSummary?.SESSION_HOST.avgGrader))
        }
    }, [transcriptsSummary, listAvgGrader])

    useEffect(() => {
        let sum = 0;
        listAvgGrader.forEach((i) => {
            sum += i.grade;
            setAvgGrader(sum);
        });
    }, [listAvgGrader]);



    const loadTranscriptStudent = (id: any) => {
        setTranscripts([]);
        setStudentTranscript(null);
        setLoadingTranscript(true);
        setGrades([]);
        setStudentIdSelect(id);
        getTranscriptsSummaryBhyStudentId(id);
        transcriptService
            .getTranscripts(param.id, userState?.id, id, searchParams.get('type')!)
            .then((result) => {
                setTranscripts(result?.data);
                setGrades(
                    result?.data.map((e: any) => {
                        return {
                            idEvaluation: e.id,
                            grade: e.grade,
                            gradeMax: e.gradeMax,
                        };
                    }),
                );
                setListAvgGrader(
                    result?.data.map((i: any) => {
                        return { grade: i.grade };
                    }),
                );

                const member = group?.members.find((e) => e.student.id == id);
                setStudentTranscript(member?.student);

                setLoadingTranscript(false);
            })

            .catch((error) => {
                showMessageEror(error.response.data.error, 5000);
                setLoadingTranscript(false);
            });
    };
    const getGradeById = (id: number) => {
        return grades.find((e: Grade) => e?.idEvaluation === id);
    };

    const handlerChangeGrade = (id: number, grade: number) => {
        grades.find((e: Grade) => {
            if (e.idEvaluation === id) {
                e.grade = grade;
            }
        });
    };
    const getEvalutionName = () => {
        switch (searchParams.get('type')) {
            case 'ADVISOR':
                return 'Giáo viên hướng dẫn';
            case 'REVIEWER':
                return 'Phản biện';
            case 'SESSION_HOST':
                return 'Hội đồng';
        }
    };

    const handlerSubmitTranscript = () => {
        if (grades.length == 0 || !studentIdSelect) {
            return;
        }
        setLoadingTranscript(true);

        const data = {
            assignId: Number(searchParams.get('assignId')),
            studentId: studentIdSelect,
            transcripts: grades,
        };


        transcriptService
            .postTranscripts(data)
            .then((result) => {
                getTranscriptsSummaryBhyStudentId(studentIdSelect)
                showMessage('Chấm điểm thành công', 3000);
                setLoadingTranscript(false);
                setListAvgGrader(
                    result?.data.map((i: any) => {
                        return { grade: i.grade };
                    }),
                );
            })
            .catch((error) => {
                showMessageEror(JSON.stringify(error.response.data.error) || 'Chấm điểm thất bại', 5000);
                setLoadingTranscript(false);
            });
    };
    const columns = [
        {
            title: 'Tên tiêu chí',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Điểm tối đa',
            dataIndex: 'gradeMax',
            key: 'gradeMax',
        },
        {
            title: 'Điểm',
            dataIndex: 'id',
            render: (id: any) => {
                const grade = getGradeById(id);
                return (
                    <InputNumber
                        step="0.25"
                        min={0}
                        max={grade?.gradeMax || 1}
                        onChange={(e: any) => handlerChangeGrade(id, e)}
                        defaultValue={grade?.grade}
                        style={{ width: 70 }}
                        id={id}
                    />
                );
            },
        },
    ];

    const columnsLecturer = [
        {
            title: 'Mã SV',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Tên SV',
            dataIndex: 'name',
            key: 'name',
        },
        // {
        //     title: "Trạng thái",
        //     dataIndex: "status",
        //     render: () => (
        //         <CheckSquareFilled style={{ color: "#73d13d" }} />
        //     ),
        // },
        {
            title: 'Chấm điểm',
            dataIndex: 'id',
            render: (id: any) => (
                <Button onClick={() => loadTranscriptStudent(id)}>
                    <EditOutlined style={{ color: 'red' }} />
                </Button>
            ),
        },
    ];

    const getPointAvg = useMemo(() => {
        return (
            <Text mark strong type="danger" className={cls('title_point_avg')}>
                {avgGrader}
            </Text>
        );
    }, [avgGrader]);

    const renderAvgSumTranscript = useMemo(() => {
        return (
            <>
                {avgGrader !== null ?
                    <>
                        <Col style={{ marginRight: '10px' }}>
                            <Text strong type="danger" className={cls('title_point')} >
                                Điểm trung bình:
                            </Text>
                        </Col>
                        <Col>
                            <Text strong type="danger" className={cls('title_point')}>
                                {avgSummary}
                            </Text>
                        </Col></> : null
                }
            </>
        );
    }, [avgSummary, transcriptsSummary, listAvgGrader]);




    return (
        <div className={cls('group_evaluation')}>
            <ToastContainer />
            <Row className={cls('row')}>
                <Col span={9} className={cls('group-col')}>
                    <Row justify={'space-between'} style={{ height: '100%' }}>
                        <Col span={24}>
                            <div className={cls('info_item_des')}>
                                <Descriptions title={<h3 className={cls('title_info')}>Thông tin nhóm</h3>}></Descriptions>
                                <Skeleton loading={!loadingInfoGroup} active paragraph={{ rows: 5 }}>
                                    <Descriptions title={<></>}>
                                        <Descriptions.Item label={<p className={cls('title_info_group')}>Tên nhóm</p>} span={1}>
                                            <h4 className={cls('name_group')}>{group?.name}</h4>
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Divider plain> Danh sách sinh viên</Divider>

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

                <Col span={15} style={{ backgroundColor: '#ffff' }} className={cls('transcript-col')}>
                    <Spin spinning={loadingTranscript}>
                        <Descriptions title={<h3 className={cls('title_info')}>Bảng điểm - {getEvalutionName()}</h3>}></Descriptions>
                        <Descriptions title={<></>}>
                            <Descriptions.Item label={<p className={cls('title_info_student')}>MSSV</p>} span={1}>
                                <h4 className={cls('name_group')}>{studentTranscript?.username}</h4>
                            </Descriptions.Item>
                            <Descriptions.Item label={<p className={cls('title_info_student')}>Tên SV</p>} span={1}>
                                <h4 className={cls('name_group')}>{studentTranscript?.name}</h4>
                            </Descriptions.Item>
                            <Descriptions.Item label={<p className={cls('title_info_student')}>Email</p>} span={1}>
                                <h4 className={cls('name_group')}>{studentTranscript?.email}</h4>
                            </Descriptions.Item>
                        </Descriptions>
                        <Divider plain> Danh sách Tiêu chí</Divider>
                        <div className={cls('group_content')}>
                            <Table dataSource={transcripts} columns={columns} pagination={false} />
                        </div>

                        {studentIdSelect && (
                            <>
                                <Row
                                    justify={'start'}
                                    style={{
                                        marginTop: '20px',
                                    }}
                                >
                                    <Col span={7} offset={11}>
                                        <Text mark strong type="danger" className={cls('title_point')}>
                                            Tổng điểm:
                                        </Text>
                                    </Col>
                                    <Col>{getPointAvg}</Col>
                                </Row>

                                <div className={cls('submit-grade')}>
                                    <Row justify={'space-between'} style={{ width: '100%' }} align={'middle'}>
                                        <div className={cls('avg_content')}>

                                            {renderAvgSumTranscript}

                                        </div>
                                        <Col>
                                            <Button type="primary" size="large" onClick={handlerSubmitTranscript}>
                                                Chấm điểm
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </>
                        )}
                    </Spin>
                </Col>
            </Row>
        </div>
    );
};

export default GroupEvaluation;
