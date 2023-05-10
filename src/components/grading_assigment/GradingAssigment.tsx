import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import style from './GradingAssigment.module.scss';
import { Avatar, Badge, Button, Card, Col, Descriptions, Result, Row, Select, Skeleton, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import studentService from '../../services/student';
import GroupStudent from '../../entities/group_student';
import { FileDoneOutlined, GroupOutlined, SnippetsOutlined, UserOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { isEntityName } from 'typescript';

const cls = classNames.bind(style);
const { Text } = Typography;

interface GroupAssign {
  id: number;
  typeEvaluation: string;
  groupLecturer: {
    id: number;
    name: string;
  };
}
const GradingAssigment = () => {
  const { user } = useAppSelector((state) => state.user);

  const [listGroup, setListGroup] = useState<Array<GroupStudent>>([]);
  const [loading, setLoading] = useState(true);
  const termState = useAppSelector((state) => state.term);

  const [groupAssignReview, setGroupAssignRieview] = useState<Array<GroupAssign>>([]);
  const [groupAssignSessionHost, setGroupAssignSessionHost] = useState<Array<GroupAssign>>([]);

  useEffect(() => {
    if (termState.term.length > 0) {
      studentService
        .getGroupStudents(termState.termIndex.id)
        .then((result) => {
          setLoading(false);
          setListGroup(result?.data);
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }, [termState]);

  const GetGroupLectureForGroup = (idGroup: number) => {
    studentService
      .getGroupLecturerOfStudentByType(Number(idGroup), termState.termIndex.id, 'REVIEWER')
      .then((resutl) => {
        console.log('getGroupLecturerOfStudentByType R', resutl.data);

        setGroupAssignRieview(resutl?.data);
      })
      .catch((error) => console.log('error REVIEWER', error));

    studentService
      .getGroupLecturerOfStudentByType(Number(idGroup), termState.termIndex.id, 'SESSION_HOST')
      .then((resutl) => {
        console.log('getGroupLecturerOfStudentByType H', resutl.data);
        setGroupAssignSessionHost(resutl?.data);
      })
      .catch((error) => console.log('error SESSION_HOST', error));
  };

  const renderInfoGroupOfStudent = useMemo(() => {
    return <></>;
  }, []);

  const renderInfoGroup = useMemo(() => {
    console.log('groupAssignReview', groupAssignReview);
    console.log('groupAssignSessionHost', groupAssignSessionHost);

    return (
      <>
        {listGroup.length === 0 && (
          <Result status="warning" title={<div style={{ fontSize: '16px', color: '#264653' }}>Chưa có nhóm cho học kỳ này</div>} />
        )}
        {listGroup.map((item, index) => {
          GetGroupLectureForGroup(item.id);
          return (
            <>
              <Card.Grid key={index} className={cls('group')} hoverable>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<SnippetsOutlined />} />
                <GroupOutlined size={16} className={cls('icon')} />
                <div className={cls('lecturer_info')}>
                  <Row justify={'start'} align={'top'}>
                    <Col span={12}>
                      <Text strong className={cls('title')}>
                        Nhóm Giảng viên phản biện
                      </Text>
                    </Col>
                    <Col span={10} offset={1}>
                      <Text mark className={cls('no_name')}>
                        {groupAssignReview?.length > 0 ? groupAssignReview?.[0].groupLecturer?.name : 'Chưa có nhóm'}
                      </Text>
                    </Col>
                  </Row>

                  <Row justify={'start'} align={'top'}>
                    <Col span={12}>
                      <Text strong className={cls('title')}>
                        Nhóm Giảng viên hướng dẫn
                      </Text>
                    </Col>
                    <Col span={10} offset={1}>
                      <Text mark className={cls('no_name')}>
                        {groupAssignSessionHost?.length > 0 ? groupAssignSessionHost?.[0].groupLecturer?.name : 'Chưa có nhóm'}
                      </Text>
                    </Col>
                  </Row>
                </div>

                <Row justify={'space-between'} align={'stretch'}>
                  <Row justify={'end'} style={{ width: '100%' }}>
                    <div className={cls('group_more')}>
                      <Link to={'/group/' + item?.id}> Chi tiết...</Link>
                    </div>
                  </Row>
                  <Col span={24}>
                    <Meta
                      title={
                        <div className={cls('group_name')}>
                          <Descriptions column={2} title={<div className={cls('name_info')}>Nhóm: {item?.name}</div>}>
                            <Descriptions.Item label={<div className={cls('member')}>Thành viên</div>}>
                              <div className={cls('item')}>
                                {item?.members.map((i, d) => {
                                  return (
                                    <Space key={d}>
                                      <Text className={cls('_item')}>{i?.student?.name}</Text>
                                    </Space>
                                  );
                                })}
                              </div>
                            </Descriptions.Item>
                          </Descriptions>
                        </div>
                      }
                      description={''}
                    />
                  </Col>
                </Row>
              </Card.Grid>
            </>
          );
        })}
      </>
    );
  }, [listGroup, groupAssignReview.length, groupAssignSessionHost.length]);

  return (
    <div className={cls('grading_assigment')}>
      <div className={cls('filter_term')}></div>

      <h3 className={cls('title_group')}>Danh sách nhóm Sinh Viên</h3>

      <Skeleton loading={loading} avatar active>
        <Card title={''} className={cls('list_group')}>
          {renderInfoGroup}
        </Card>
      </Skeleton>
    </div>
  );
};

export default GradingAssigment;
