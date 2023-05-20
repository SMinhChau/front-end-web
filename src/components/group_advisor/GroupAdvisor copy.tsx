import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styled from './GroupAdvisor.module.scss';
import { Avatar, Col, Radio, Result, Row, Skeleton, Typography } from 'antd';

import { useAppSelector } from '../../redux/hooks';
import assignService from '../../services/assign';
import { SnippetsOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { Link } from 'react-router-dom';

import { TypeEvalution } from '../../entities/assign';

import { AiOutlineEdit } from 'react-icons/ai';

import AssignAdvisor from 'src/entities/assign_advisor';
import { getStatusGroup } from 'src/constant';

const cls = classNames.bind(styled);
const { Text } = Typography;

const GroupAdvisor = () => {
  const [listAssign, setListAssign] = useState<Array<AssignAdvisor>>([]);
  const [loading, setLoading] = useState(true);
  const [typeEvalution, setTypeEvalution] = useState<TypeEvalution>(TypeEvalution.ADVISOR);
  const termState = useAppSelector((state) => state.term);
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (termState.term.length > 0) {
      assignService
        .getAssignByTypeAdvisor(user.id, { typeEvaluation: 'ADVISOR' })
        .then((result) => {
          setLoading(false);
          console.log('getlist -> result.data', result.data);
          setListAssign(result.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log('getlist -> error', error);
        });
    }
  }, [termState, typeEvalution, user.id]);

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
                                Nhóm hội đồng - {getEvalutionName()}:
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
                                        <div className={cls('icon_evaluation')}>Xem chi tiết</div>
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
        <h3 className={cls('title_group')}>Danh sách Nhóm sinh Hướng Dẫn</h3>

        {/* <div className={cls('type_evalution')}>
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
        </div> */}
        <div className={cls('info')}>{renderListGroup}</div>
      </div>
    </>
  );
};
export default GroupAdvisor;
