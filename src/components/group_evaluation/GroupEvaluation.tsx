import classNames from 'classnames/bind';
import styled from './GroupEvaluation.module.scss';
import { Col, Row, Tabs, TabsProps } from "antd";
import TabPane from 'antd/es/tabs/TabPane';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GroupStudent from '~/entities/group_student';
import studentService from '~/services/student';
const cls = classNames.bind(styled);


const GroupEvaluation = () => {

    const [inforGroup, setInfoGroup] = useState<GroupStudent>();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const onChange = (key: string) => {
        console.log(key);
    };

    useEffect(() => {
        const idGroup = id;

        studentService
            .getGroupStudentByID(Number(idGroup))
            .then((result) => {
                console.log('getGroupStudentByID', result?.data);
                setLoading(false)
                setInfoGroup(result.data);


            })
            .catch((errr) => console.log('erre', errr));
    }, []);



    return (
        <div className={cls('content')}>

            <Row justify={'space-between'}>
                <Col span={8}></Col>
                <Col span={16}>
                    <Tabs
                        defaultActiveKey="1"
                        onChange={onChange}
                        style={{ display: "flex", justifyContent: "space-between" }}
                    >
                        <TabPane tab={<p className={cls('name_tab')}>Điểm hướng dẫn</p>} key="1" style={{ width: "50%" }}>
                            Content of Tab Pane 1
                        </TabPane>
                        <TabPane tab={<p className={cls('name_tab')}>Điểm phản biện</p>} key="2">
                            Content of Tab Pane 2
                        </TabPane>
                        <TabPane tab={<p className={cls('name_tab')}>Điểm hội đồng</p>} key="3">
                            Content of Tab Pane 2
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
    )
}
export default GroupEvaluation;