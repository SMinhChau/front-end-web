import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import style from './GradingAssigment.module.scss';
import { Avatar, Col, Result, Row, Skeleton, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import studentService from '../../services/student';

import { GroupOutlined, SnippetsOutlined, UserOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';

import Topic from 'src/entities/topic';

const cls = classNames.bind(style);
const { Text } = Typography;

interface InfoAll {
  id: number;
  name: string;
  term: {
    id: number;
  };
  topic: Topic;
  members: [
    {
      id: number;
      student: {
        id: number;
        username: string;
        avatar: string;
        phoneNumber: string;
        email: string;
        name: string;
        gender: string;
        createdAt: string;
        updatedAt: string;
        majors: {
          id: number;
        };
        typeTraining: string;
        schoolYear: string;
      };
      group: {
        id: number;
      };
    },
  ];
  groupReview: string;
  groupHost: string;
}
const GradingAssigmentDemo = () => {
  const { user } = useAppSelector((state) => state.user);
  const [listGroup, setListGroup] = useState<Array<InfoAll>>([]);
  const [loading, setLoading] = useState(true);
  const termState = useAppSelector((state) => state.term);

  useEffect(() => {
    if (termState.term.length > 0) {
      getDataFromApi();
    }
  }, [termState]);

  const getDataFromApi = () => {
    studentService
      .getGroupStudents(termState.termIndex.id)
      .then((result) => {
        setLoading(false);

        const promises = result.data.map((item: any) => {
          let groupR = '';
          let groupH = '';

          return Promise.all([
            studentService
              .getGroupLecturerOfStudentByType(Number(item.id), termState.termIndex.id, 'REVIEWER')
              .then((result) => {
                groupR = result?.data?.[0].groupLecturer.name;
              })
              .catch((error) => console.log('error REVIEWER', error)),
            studentService
              .getGroupLecturerOfStudentByType(Number(item.id), termState.termIndex.id, 'SESSION_HOST')
              .then((result) => {
                groupH = result?.data?.[0].groupLecturer.name;
              })
              .catch((error) => console.log('error SESSION_HOST', error)),
          ]).then(() => ({ ...item, groupReview: groupR, groupHost: groupH }));
        });

        Promise.all(promises)
          .then((results) => setListGroup(results))
          .catch((error) => console.log('error', error));
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const renderInfoGroup = useMemo(() => {
    return (
      <>
        <Skeleton loading={loading} avatar active>
          {listGroup.length > 0 ? (
            <>
              <Row gutter={[24, 24]} style={{ width: '100%' }}>
                {listGroup.map((item, index) => {
                  const renderInfoGroup = () => (
                    <>
                      <Row justify={'start'} align={'top'}>
                        <Col span={12}>
                          <Text strong className={cls('title')}>
                            Nhóm hội đồng phản biện
                          </Text>
                        </Col>
                        <Col span={10} offset={1}>
                          {item?.groupReview ? (
                            <Text className={cls('_name')}>{item?.groupReview}</Text>
                          ) : (
                            <Text mark className={cls('no_name')}>
                              Chưa có nhóm
                            </Text>
                          )}
                        </Col>
                      </Row>
                      <Row justify={'start'} align={'top'} style={{ paddingTop: '10px' }}>
                        <Col span={12}>
                          <Text strong className={cls('title')}>
                            Nhóm hội đồng hướng dẫn
                          </Text>
                        </Col>
                        <Col span={10} offset={1}>
                          {item?.groupHost ? (
                            <Text className={cls('_name')}>{item?.groupHost}</Text>
                          ) : (
                            <Text mark className={cls('no_name')}>
                              Chưa có nhóm
                            </Text>
                          )}
                        </Col>
                      </Row>
                    </>
                  );

                  const getNameGroup = () => (
                    <>
                      <Row justify={'end'} style={{ width: '100%' }}>
                        <div className={cls('group_more_more')}>
                          <Link to={'/group/' + item?.id}> Chi tiết...</Link>
                        </div>
                      </Row>
                    </>
                  );
                  return (
                    <Col span={8}>
                      <div key={index} className={cls('group')}>
                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<SnippetsOutlined />} />
                        <div className={cls('lecturer_info')}>{renderInfoGroup()}</div>
                        {getNameGroup()}
                        <Col span={24}>
                          <Meta
                            title={
                              <div className={cls('group_name')}>
                                <div className={cls('name_info')}>Nhóm: {item?.name}</div>

                                <div className={cls('member')}>Thành viên</div>

                                <Row gutter={[24, 24]}>
                                  <div className={cls('item')}>
                                    <Col span={24}>
                                      {item?.members.map((i, d) => {
                                        console.log('members.map', i);

                                        return (
                                          <div key={d} className={cls('item_name')}>
                                            <Text className={cls('_item')}>{i?.student?.name}</Text>
                                          </div>
                                        );
                                      })}
                                    </Col>
                                  </div>
                                </Row>
                              </div>
                            }
                            description={''}
                          />
                        </Col>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </>
          ) : (
            <>
              <Result status="warning" title={''}>
                <Text type="danger" style={{ fontSize: '18px' }}>
                  Chưa có nhóm cho học kỳ này
                </Text>
              </Result>
            </>
          )}
        </Skeleton>
      </>
    );
  }, [listGroup, loading]);

  return (
    <div className={cls('grading_assigment')}>
      <div className={cls('top')}>
        <h3 className={cls('title_group')}>Danh sách nhóm Sinh Viên</h3>
      </div>
      <div title={''} className={cls('list_group')}>
        {renderInfoGroup}
      </div>
    </div>
  );
};

export default GradingAssigmentDemo;
