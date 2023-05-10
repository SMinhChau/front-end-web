import { useState } from 'react';

import classNames from 'classnames/bind';
import style from './SemesterInfo.module.scss';

import { useAppSelector } from 'src/redux/hooks';
import Term from 'src/entities/term';
import { Card, Col, Row, Typography } from 'antd';
import { log } from 'console';
import moment from 'moment';

const cls = classNames.bind(style);
const { Text } = Typography;

const SemesterInfo = () => {
  const termState = useAppSelector((state) => state.term.termIndex);
  const user = useAppSelector((state) => state.user.user);
  const [term, setTerm] = useState<Term>();

  const _data = [
    { lable: 'Ngày bắt đầu', value: termState.startDate },
    { lable: 'Ngày kết thúc', value: termState.endDate },
    { lable: 'Bắt đầu chọn đề tài', value: termState.startDateChooseTopic },
    { lable: 'Kết thúc chọn đề tài', value: termState.endDateChooseTopic },
    { lable: 'Thời gian bắt đầu phản biện', value: termState.startDateDiscussion },
    { lable: 'Thời gian kết thúc phản biện', value: termState.endDateDiscussion },
    { lable: 'Ngày phản biện', value: termState.dateDiscussion },
    { lable: 'Thời gian bắt đầu báo cáo', value: termState.startDateReport },
    { lable: 'Thời gian kết thúc báo cáo', value: termState.endDateReport },
    { lable: 'Báo cáo hội đồng', value: termState.dateReport },
  ];

  return (
    <div className={cls('semester_management')}>
      <div className={cls('semester_func')}>
        <div className={cls('selectTerm')}>
          <Text className={cls('title_name')}>học kỳ hiện tại - </Text> <Text className={cls('title_name')}>{termState.name}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}></div>
      </div>

      <div className={cls('info')}>
        <Row gutter={[24, 24]}>
          {_data.map((item) => {
            return (
              <Col span={8}>
                <div className={cls('card_item')}>
                  <Row justify={'center'}>
                    <Col span={18}>
                      <Text className={cls('lable')}>{item.lable}</Text>
                    </Col>
                    <Col span={6}>
                      <Text className={cls('value_text')}>{moment(item.value).format('MM/DD/YYYY')}</Text>
                    </Col>
                  </Row>
                </div>
              </Col>
            );
          })}
        </Row>
        {/* <Row justify="center">
          <Col span={24}>
            <Card>
              {_data.map((item) => {
                return (
                  <Card.Grid className={cls('card_item')}>
                    <Row justify="center">
                      <Col span={16}>
                        <Text className={cls('lable')}>{item.lable}</Text>
                      </Col>
                      <Col span={8}>
                        <Text className={cls('value_text')}>{moment(item.value).format('MM/DD/YYYY')}</Text>{' '}
                      </Col>
                    </Row>
                  </Card.Grid>
                );
              })}
            </Card>
          </Col>
        </Row> */}
      </div>
    </div>
  );
};

export default SemesterInfo;
