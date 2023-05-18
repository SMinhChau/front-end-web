import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styled from './ListGroupOfLecturer.module.scss';
import { Avatar, Col, Radio, Result, Row, Skeleton, Typography } from 'antd';

import { useAppSelector } from '../../redux/hooks';
import assignService from '../../services/assign';
import { SnippetsOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { Link } from 'react-router-dom';

import { TypeEvalution } from '../../entities/assign';

import { AiOutlineEdit } from 'react-icons/ai';
import AssignPoint from 'src/entities/asisign_point';
import { getStatusGroup } from 'src/constant';
import AssignAdvisor from 'src/entities/assign_advisor';

const cls = classNames.bind(styled);
const { Text } = Typography;

const ListGroupOfLecturer = () => {
  const [listAssign, setListAssign] = useState<Array<AssignAdvisor>>([]);
  const [loading, setLoading] = useState(true);
  const [typeEvalution, setTypeEvalution] = useState<TypeEvalution>(TypeEvalution.ADVISOR);
  const termState = useAppSelector((state) => state.term);
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (termState.term.length > 0) {
      assignService
        .getAssignByLecturer(termState.termIndex.id, user.id, typeEvalution)
        .then((result) => {
          setLoading(false);
          console.log('getlist -> result.data', result.data);

          setListAssign(result.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log('error', error);
        });
    }
  }, [termState, typeEvalution, user.id]);

  const handlerChangeType = (props: any) => {
    setTypeEvalution(props.target.value);
  };
  const getEvalutionName = () => {
    switch (typeEvalution) {
      case 'ADVISOR':
        return 'Hướng dẫn';
      case 'REVIEWER':
        return 'Phản biện';
      case 'SESSION_HOST':
        return 'Hội đồng';
    }
  };

  const renderListGroup = useMemo(() => {
    return (
      <>
        <Skeleton loading={loading} avatar active>
          {listAssign.length > 0 ? (
            <>
              <Row gutter={[24, 24]} style={{ width: '100%' }}>
                {listAssign.map((item, index) => {
                  const renderInfoGroup = () => (
                    <>
                      <Row justify={'start'} align={'top'} style={{ width: '100%' }}>
                        {item?.groupLecturer?.name ? (
                          <>
                            <Col span={12}>
                              <Text strong className={cls('title')}>
                                Nhóm Giảng viên - {getEvalutionName()}:
                              </Text>
                            </Col>
                            <Col span={12}>
                              {item?.groupLecturer.name ? (
                                <Text className={cls('_name')}>{item?.groupLecturer?.name}</Text>
                              ) : (
                                <Text mark className={cls('no_name')}>
                                  Chưa có nhóm
                                </Text>
                              )}
                            </Col>
                          </>
                        ) : (
                          <Text mark className={cls('no_name')}>
                            Chưa có nhóm
                          </Text>
                        )}
                      </Row>
                    </>
                  );
                  return (
                    <Col span={8}>
                      <div key={index} className={cls('group')}>
                        <Avatar style={{ backgroundColor: '#87d068', marginBottom: '10px' }} icon={<SnippetsOutlined />} />
                        {renderInfoGroup()}
                        <Col span={24}>
                          <Meta
                            title={
                              <div className={cls('group_name')}>
                                <div className={cls('name_info')}>Nhóm: {item?.group.name}</div>

                                <div className={cls('member')}>Thành viên</div>

                                <Row gutter={[24, 24]}>
                                  <div className={cls('item')}>
                                    <Col span={24}>
                                      {item?.group?.members.map((i, d) => {
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
                                <div className={cls('evalaution_content')}>
                                  <Col>
                                    <div className={cls('icon_evaluation')}>{getStatusGroup(item.group.status)}</div>
                                  </Col>
                                  <Col>
                                    <Row>
                                      <AiOutlineEdit className={cls('icon_evaluation')} size={22} />
                                      <Link to={`/group-advisor-of-lecturer/${item?.group.id}`}>
                                        <Link
                                          to={`/group/evaluation-for-group/${item?.group.id}?type=${item.typeEvaluation}&assignId=${item.id}`}
                                        >
                                          <div className={cls('icon_evaluation')}>Chấm điểm</div>
                                        </Link>
                                      </Link>
                                    </Row>
                                  </Col>
                                </div>
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

              {/* {listAssign.map((item, index) => (
                  <Row gutter={[24, 24]}>
                    <Col span={8}>
                      <div className={cls('group_item')}>
                        <div className={cls('group_name')}>Nhóm: {item?.group.name}</div>
                        <div className={cls('group_more')}>
                          <div className={cls('evalaution_content')}>
                            <DoubleRightOutlined className={cls('icon_evaluation')} size={20} />
                            <Link to={`/group/evaluation-for-group/${item?.group.id}?type=${item.typeEvaluation}&assignId=${item.id}`}>
                              Chấm điểm
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ))} */}
            </>
          ) : (
            <Result status="warning" title="">
              <Text type="danger" style={{ fontSize: '18px' }}>
                Chưa có nhóm cho học kỳ này
              </Text>
            </Result>
          )}
        </Skeleton>
      </>
    );
  }, [listAssign, loading]);

  return (
    <>
      <div className={cls('list_evaluation')}>
        <h3 className={cls('title_group')}>Danh sách Nhóm sinh viên chấm điểm</h3>

        <div className={cls('type_evalution')}>
          <Radio.Group defaultValue={typeEvalution} buttonStyle="solid" onChange={handlerChangeType}>
            <Radio.Button className={cls('btn_radio')} value={TypeEvalution.ADVISOR}>
              hướng dẫn
            </Radio.Button>
            <Radio.Button className={cls('btn_radio')} value={TypeEvalution.REVIEWER}>
              Phản biện
            </Radio.Button>
            <Radio.Button className={cls('btn_radio')} value={TypeEvalution.SESSION_HOST}>
              Hội đồng
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className={cls('info')}>{renderListGroup}</div>
      </div>
    </>
  );
};
export default ListGroupOfLecturer;
