import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Modal, Form, DatePicker, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import style from './SemesterManagement.module.scss';
import termService from '~/services/term';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import Term from '~/entities/term';
import ColumnSetting from '../column_setting/ColumnSetting';
import Config from '~/utils/config';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { setTermSlice } from '~/redux/slices/term_slice';
import { showMessage, showMessageEror } from '~/constant';

const cls = classNames.bind(style);
const SemesterManagement = () => {
    const baseColumns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
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
    const [idUpdate, setIdUpdate] = useState(null);
    const [columnVisible, setColumnVisible] = useState<Array<any>>([]);
    const user = useAppSelector((state) => state.user.user);
    const [termNameDefault, setTermNameDefault] = useState('');
    const termState = useAppSelector((state) => state.term);
    const dispatch = useAppDispatch();


    useEffect(() => {
        termService.getTerm({ majorsId: user.majors.id }).then((result) => {
            dispatch(setTermSlice(result.data));
            setTerms(
                result.data.map((value: any) => {
                    return { ...value, key: value.id };
                }),
            );
        });
    }, [user]);

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

        console.log('valuues 1', values);
        termService
            .createTerm({ ...values })
            .then(() => {
                showMessage('Tạo học kỳ thành công', 3000);
                window.location.reload();
            })
            .catch((err) => {
                console.log('err', err);
                showMessageEror(err.response.data.error, 3000);
            });
    };

    const onFinishUpdate = async (values: any) => {

        termService
            .update(idUpdate, values)
            .then(() => {
                showMessage('Cập nhật học kỳ thành công', 5000);
                window.location.reload();
            })
            .catch((err) => {
                showMessageEror(err.response.data.error, 5000);
                console.log('err.response.data.error', err.response.data.error);
            });
    };

    const deleteTerm = (id: number) => {
        termService
            .deleteTerm(id)
            .then(() => {
                showMessage('Xóa thành công', 300);
                window.location.reload();
            })
            .catch((err) => {
                showMessageEror(err.response.data.error, 5000);
            });
    };

    const getTermEditById = async (id: number) => {
        await termService
            .getTermById(id)
            .then((result) => {
                const data = result.data;
                console.log(' getTermEditById', data);
                console.log(' name', data.name);


                if (data) {
                    setIdUpdate(data.id);
                    console.log(' data ======', data);
                    setInitData(
                        {
                            name: data.name,
                            startDate: moment(data.startDate),
                            endDate: moment(data.endDate),
                            startDateSubmitTopic: moment(data.startDateSubmitTopic),
                            endDateSubmitTopic: moment(data.endDateSubmitTopic),
                            startDateChooseTopic: moment(data.startDateChooseTopic),
                            endDateChooseTopic: moment(data.endDateChooseTopic),
                            startDateDiscussion: moment(data.startDateDiscussion),
                            endDateDiscussion: moment(data.endDateDiscussion),
                            dateDiscussion: moment(data.dateDiscussion),
                            startDateReport: moment(data.startDateReport),
                            endDateReport: moment(data.endDateReport),
                            dateReport: moment(data.dateReport),

                        });

                    setModalUpdate(true);
                }
            })
            .catch((er) => console.log('er', er));
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

    const renderModalUpdate = () => {
        console.log("initData=========   ", initData);
        console.log("modalUpdate=========   ", modalUpdate);

        return (
            <> <Modal
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
                        initialValues={modalUpdate === true ? initData : {}}
                    >



                        <Form.Item label="Tên học kỳ" rules={[{ required: true }]} name="name">
                            <Select
                                style={{ width: '50%' }}

                                onChange={handleChange}
                                optionLabelProp="label"
                                options={data}
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
    }

    return (
        <div className={cls('semester_management')}>
            <ToastContainer />
            <div className={cls('semester_func')}>
                {/* <h4 className={cls("semester_title")}>Quản lý học kì</h4> */}
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
                            <Form.Item label="Tên học kỳ" rules={[{ required: true }]} name="name">
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
                                getValueFromEvent={(onChange) => moment(onChange).format('MM/DD/YYYY')}
                                label="Ngày bắt đầu" rules={[{ required: true }]} >
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>

                            <Form.Item label="Ngày kết thúc" rules={[{ required: true }]} name="endDate">
                                <DatePicker format="MM/DD/YYYY" />
                            </Form.Item>

                            <Form.Item label=" ">
                                <Button type="primary" htmlType="submit">
                                    Lưu
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </div>
            <Table columns={columnVisible} dataSource={terms} style={{ backgroundColor: '#fff' }} />

            {renderModalUpdate()}
        </div>
    );
};

export default SemesterManagement;
