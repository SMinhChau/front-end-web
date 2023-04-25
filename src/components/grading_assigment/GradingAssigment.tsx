import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './GradingAssigment.module.scss';
import { Avatar, Badge, Card, Col, Descriptions, Row, Select, Skeleton, Space } from 'antd';
import { Link } from 'react-router-dom';
import Term from '~/entities/term';
import termService from '~/services/term';
import { useAppSelector } from '~/redux/hooks';
import studentService from '~/services/student';
import GroupStudent from '~/entities/group_student';
import { FileDoneOutlined, GroupOutlined, SnippetsOutlined, UserOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';

const cls = classNames.bind(style);

const GradingAssigment = () => {
  const { user } = useAppSelector((state) => state.user);

  const [listGroup, setListGroup] = useState<Array<GroupStudent>>([]);
  const [loading, setLoading] = useState(true);
  const termState = useAppSelector((state) => state.term);

  useEffect(() => {
    if (termState.term.length > 0) {
      studentService
        .getGroupStudents(termState.termSelected)
        .then((result) => {
          setLoading(false);
          setListGroup(result?.data);
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }, [termState]);

  return (
    <div className={cls('grading_assigment')}>
      <div className={cls('filter_term')}></div>

      <h3 className={cls('title_group')}>Danh sách nhóm Sinh Viên</h3>
      <Card title={''} className={cls('list_group')}>
        <Skeleton loading={loading} avatar active></Skeleton>
        {listGroup.map((item, index) => (
          <Card.Grid key={index} className={cls('group')} hoverable>
            <div>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<SnippetsOutlined />} />

              <GroupOutlined size={30} className={cls('icon')} />
            </div>

            <Row justify={'space-between'} align={'stretch'}>
              <Col span={18}>

                <Meta
                  title={
                    <div className={cls('group_name')}>
                      <Descriptions column={2} title={<div className={cls('name_info')}>Nhóm: {item?.name}</div>}>
                        <Descriptions.Item label="Thành viên">
                          <div className={cls('item')}>
                            {item?.members.map((i, d) => {
                              return <Space key={d}>{i?.student?.name}</Space>;
                            })}
                          </div>
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  }
                  description={''}
                />
              </Col>
              <Col span={6} >
                <div className={cls('group_more')}>

                  <Link to={'/group/' + item?.id}> Chi tiết...</Link>

                </div>
              </Col>

            </Row>
          </Card.Grid>
        ))}
      </Card>
    </div>
  );
};

export default GradingAssigment;
