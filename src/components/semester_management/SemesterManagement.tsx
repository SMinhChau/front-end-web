import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Modal, Form, DatePicker, Select, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import style from './SemesterManagement.module.scss';
import termService from '../../services/term';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import Term from '../../entities/term';
import ColumnSetting from '../column_setting/ColumnSetting';
import Config from '../../utils/config';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setTermSlice } from '../../redux/slices/term_slice';
import { showMessage, showMessageEror } from '../../constant';

const cls = classNames.bind(style);
const SemesterManagement = () => {
    const baseColumns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: 100,
        },
        {
            title: 'Bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },
        {
            title: 'Kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },
        {
            title: 'Bắt đầu submit đề tài',
            dataIndex: 'startDateSubmitTopic',
            key: 'startDateSubmitTopic',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },
        {
            title: 'Kết thúc submit đề tài',
            dataIndex: 'endDateSubmitTopic',
            key: 'enendDateSubmitTopicdDate',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },
        {
            title: 'Bắt đầu chọn đề tài',
            dataIndex: 'startDateChooseTopic',
            key: 'startDateChooseTopic',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },
        {
            title: 'Kết thúc chọn đề tài',
            dataIndex: 'endDateChooseTopic',
            key: 'endDateChooseTopic',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },
        {
            title: 'Thời gian bắt đầu Phản biện',
            dataIndex: 'startDateDiscussion',
            key: 'startDateDiscussion',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },
        {
            title: 'Thời gian kết thúc Phản biện',
            dataIndex: 'endDateDiscussion',
            key: 'endDateDiscussion',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },

        {
            title: 'Ngày phản biện',
            dataIndex: 'dateDiscussion',
            key: 'dateDiscussion',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },
        {
            title: 'Thời gian bắt đầu Báo cáo',
            dataIndex: 'startDateReport',
            key: 'startDateReport',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },
        {
            title: 'Thời gian kết thúc Báo cáo',
            dataIndex: 'endDateReport',
            key: 'endDateReport',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },

        {
            title: 'Ngày báo cáo',
            dataIndex: 'dateReport',
            key: 'dateReport',
            render: (t: Date) => moment(t).format('MM/DD/YYYY'),
        },
        {
            title: 'Xóa',
            dataIndex: 'id',
            render: (id: any) => (
                <Button onClick={() => deleteTerm(id)}>
                    <DeleteOutlined style={{ color: 'red' }} />
                </Button>
            ),
        },
        {
            title: 'Sửa',
            dataIndex: 'id',
            render: (id: any) => (
                <Button
                    onClick={() => {
                        getTermEditById(id);
                    }}
                >
                    <EditOutlined style={{ color: '#30a3f1' }} />
                </Button>
            ),
        },
    ];
    const [terms, setTerms] = useState<Array<Term>>([]);
    const [open, setOpen] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);

    const [initData, setInitData] = useState({});
    const [idUpdate, setIdUpdate] = useState<number | null>(null);
    const [columnVisible, setColumnVisible] = useState<Array<any>>([]);
    const user = useAppSelector((state) => state.user.user);
    const termState = useAppSelector((state) => state.term);
    const dispatch = useAppDispatch();


    useEffect(() => {
        getListOfTerm()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);


    const getListOfTerm = () => {
        termService.getTerm({ majorsId: user.majors.id }).then((result) => {
            dispatch(setTermSlice(result.data));
            setTerms(
                result.data.map((value: any) => {
                    return { ...value, key: value.id };
                }),
            );
        });
    }

    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };
    const handleCancelUpdate = () => {
        setModalUpdate(false);
    };

    const onFinish = async (values: any) => {
        let nameDefault = '';
        const startDateDefaul = moment(values.startDate).year();
        nameDefault = values.name + ' ' + `${startDateDefaul}`;
        values = {
            ...values,
            name: nameDefault,
            majorsId: user.majors.id,
            startDate: values.startDate.format('MM/DD/YYYY'),
            endDate: values.endDate.format('MM/DD/YYYY'),

            startDateSubmitTopic: values.startDate.add(1, 'months').format('MM/DD/YYYY'),
            endDateSubmitTopic: values.startDate.add(1, 'months').format('MM/DD/YYYY'),

            startDateChooseTopic: values.startDate.add(1, 'months').add(1, 'weeks').format('MM/DD/YYYY'),
            endDateChooseTopic: values.startDate.add(1, 'months').add(2, 'weeks').format('MM/DD/YYYY'),

            startDateDiscussion: values.startDate.add(5, 'months').format('MM/DD/YYYY'),
            endDateDiscussion: values.startDate.add(5, 'months').add(1, 'weeks').format('MM/DD/YYYY'),
            dateDiscussion: values.startDate.add(5, 'months').add(1, 'weeks').format('MM/DD/YYYY'),

            startDateReport: values.startDate.add(6, 'months').format('MM/DD/YYYY'),
            endDateReport: values.startDate.add(6, 'months').add(1, 'weeks').format('MM/DD/YYYY'),
            dateReport: values.startDate.add(6, 'months').add(1, 'weeks').format('MM/DD/YYYY'),
        };

        termService
            .createTerm({ ...values })
            .then(() => {
                showMessage('Tạo học kỳ thành công', 3000);
                setOpen(false);
                getListOfTerm()
            })
            .catch((err) => {
                console.log('err', err);
                showMessageEror(err.response.data.error, 3000);
            });
    };

    const onFinishUpdate = (values: any) => {

        values = {
            ...values,
            name: values.name,
            majorsId: user.majors.id,
            startDate: values.startDate.format('MM/DD/YYYY'),
            endDate: values.endDate.format('MM/DD/YYYY'),

            startDateSubmitTopic: values.startDateSubmitTopic.format('MM/DD/YYYY'),
            endDateSubmitTopic: values.endDateSubmitTopic.format('MM/DD/YYYY'),

            startDateChooseTopic: values.startDateChooseTopic.format('MM/DD/YYYY'),
            endDateChooseTopic: values.endDateChooseTopic.format('MM/DD/YYYY'),

            startDateDiscussion: values.startDateDiscussion.format('MM/DD/YYYY'),
            endDateDiscussion: values.endDateDiscussion.format('MM/DD/YYYY'),
            dateDiscussion: values.dateDiscussion.format('MM/DD/YYYY'),

            startDateReport: values.startDateReport.format('MM/DD/YYYY'),
            endDateReport: values.endDateReport.format('MM/DD/YYYY'),
            dateReport: values.dateReport.format('MM/DD/YYYY'),
        };


        termService
            .update(idUpdate, { majorsId: user.majors.id, ...values })
            .then(() => {
                getListOfTerm()
                showMessage('Cập nhật học kỳ thành công', 3000);
                setModalUpdate(false);

            })
            .catch((err) => {
                showMessageEror(err.response.data.error, 3000);
                setModalUpdate(false);
            });
    };

    const deleteTerm = (id: number) => {
        termService
            .deleteTerm(id)
            .then(() => {
                showMessage('Xóa thành công', 3000);
                getListOfTerm()
            })
            .catch((err) => {
                showMessageEror(err.response.data.error, 3000);
            });
    };

    const getTermEditById = async (id: number) => {
        const _term = terms.filter(v => v.id === id)[0];

        setIdUpdate(_term.id)
        setInitData({
            name: _term.name,
            startDate: moment(_term.startDate),
            endDate: moment(_term.endDate),
            startDateSubmitTopic: moment(_term.startDateSubmitTopic),
            endDateSubmitTopic: moment(_term.endDateSubmitTopic),
            startDateChooseTopic: moment(_term.startDateChooseTopic),
            endDateChooseTopic: moment(_term.endDateChooseTopic),
            startDateDiscussion: moment(_term.startDateDiscussion),
            endDateDiscussion: moment(_term.endDateDiscussion),
            dateDiscussion: moment(_term.dateDiscussion),
            startDateReport: moment(_term.startDateReport),
            endDateReport: moment(_term.endDateReport),
            dateReport: moment(_term.dateReport),

        })
        setModalUpdate(true);
    };


    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };
    const data = [
        {
            value: 'Học Kỳ 1',
            label: 'Học Kỳ 1',
        },
        {
            value: 'Học Kỳ 2',
            label: 'Học Kỳ 2',
        },
    ];

    const renderModalUpdate = useMemo(() => {
        return (
            <> <Modal
                destroyOnClose
                open={modalUpdate}
                title="Chỉnh sửa học kỳ"
                onCancel={handleCancelUpdate}
                footer={[
                    <Button key="back" onClick={handleCancelUpdate}>
                        Hủy
                    </Button>,
                ]}
                style={{ maxWidth: 1000 }}
            >
                <div className={cls('form_content')}>
                    <Form
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                        style={{ maxWidth: 600 }}
                        layout="horizontal"
                        onFinish={onFinishUpdate}
                        initialValues={initData}
                    >
                        <Form.Item label="Tên học kỳ" rules={[{ required: true }]} name="name">
                            <Select
                                disabled
                                style={{ width: '50%' }}
                                onChange={handleChange}
                                options={terms.map(value => {
                                    return {
                                        value: value.name,
                                        label: value.name,
                                    }
                                })}
                            />
                        </Form.Item>

                        <Form.Item label="Ngày bắt đầu" rules={[{ required: true }]} name="startDate">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>

                        <Form.Item label="Ngày kết thúc" rules={[{ required: true }]} name="endDate">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>

                        <Form.Item label="Bắt đầu submit đề tài" rules={[{ required: true }]} name="startDateSubmitTopic">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>
                        <Form.Item label="Kết thúc submit đề tài" rules={[{ required: true }]} name="endDateSubmitTopic">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>

                        <Form.Item label="Bắt đầu chọn đề tài" rules={[{ required: true }]} name="startDateChooseTopic">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>
                        <Form.Item label="Kết thúc chọn đề tài" rules={[{ required: true }]} name="endDateChooseTopic">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>

                        <Form.Item label="Thời gian bắt đầu phản biện" rules={[{ required: true }]} name="startDateDiscussion">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>
                        <Form.Item label="Thời gian kết thúc phản biện" rules={[{ required: true }]} name="endDateDiscussion">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>
                        <Form.Item label="Ngày phản biện" rules={[{ required: true }]} name="dateDiscussion">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>

                        <Form.Item label="Thời gian bắt đầu báo cáo" rules={[{ required: true }]} name="startDateReport">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>
                        <Form.Item label="Thời gian kết thúc báo cáo" rules={[{ required: true }]} name="endDateReport">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>
                        <Form.Item label="Báo cáo hội đồng" rules={[{ required: true }]} name="dateReport">
                            <DatePicker format="MM/DD/YYYY" />
                        </Form.Item>

                        <Form.Item label=" ">
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal></>
        )
    }, [initData, modalUpdate, onFinishUpdate, terms])

    return (
        <div className={cls('semester_management')}>
            <ToastContainer />
            <div className={cls('semester_func')}>
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    size="large"
                    style={{
                        marginBottom: '10px',
                        animation: 'none',
                        color: 'rgb(80, 72, 229)',
                        fontWeight: '600',
                    }}
                    onClick={showModal}
                >
                    Tạo
                </Button>
                <ColumnSetting setColumnVisible={setColumnVisible} columns={baseColumns} cacheKey={Config.SEMESTER_CACHE_KEY} />
                <Modal
                    destroyOnClose
                    open={open}
                    title="Tạo học kỳ"
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Hủy
                        </Button>,
                    ]}
                    style={{ maxWidth: 1000 }}
                >
                    <div className={cls('form_content')}>
                        <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} style={{ maxWidth: 600 }} layout="horizontal" onFinish={onFinish}>
                            <Form.Item label="Tên học kỳ" rules={[{ required: true, message: 'Vui lòng chọn tên' }]} name="name">
                                <Select
                                    style={{ width: '50%' }}
                                    placeholder={'Tên học kỳ'}
                                    onChange={handleChange}
                                    optionLabelProp="label"
                                    options={data}
                                />
                            </Form.Item>

                            <Form.Item
                                name="startDate"
                                // getValueFromEvent={(onChange) => moment(onChange).format('MM/DD/YYYY')}
                                label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]} >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>

                            <Form.Item label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]} name="endDate">
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>

                            <Row justify={'end'}>
                                <Form.Item

                                    label="">
                                    <Button type="primary" htmlType="submit">
                                        Tạo
                                    </Button>
                                </Form.Item>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
            <Table columns={baseColumns} dataSource={terms} style={{ backgroundColor: '#fff' }} scroll={{ x: 1300 }} />

            {renderModalUpdate}
        </div>
    );
};

export default SemesterManagement;
