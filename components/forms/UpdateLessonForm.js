import { Button, Progress, message, Row, Col, Upload, Space, Avatar, List, Modal, Badge } from "antd";
import { DeleteOutlined,ToTopOutlined } from '@ant-design/icons'
import ReactPlayer from 'react-player'
import axios from "axios";

const UpdateLessonForm = ({
    current,
    setCurrent,
    handleUpdateLesson,
    uploading,
    uploadVideoButtonText,
    handleVideo,
    progress,
    handleUpload,
    fileList,
    setFileList,
    handleVideoRemove
}) => {
    const formProps = {
        onChange(info) {
            info.fileList.forEach(function (file, index) {
                let reader = new FileReader();
                reader.onload = (e) => {
                file.base64 = e.target.result.split(',')[1];
                };
                reader.readAsDataURL(file.originFileObj);
            });
            console.log('status', info.file.status)
          if (info.file.status === "done") {
            message.success(`${info.file.name} attached`)
            setFileList(info.fileList)
            console.log('DONE',info.file, info.fileList);
          } else if (info.file.status === "error") {
            message.error(`${info.file.name} file attachment failed.`);
          }
        },
      };

      const handleWikiDelete = (index) => {
        const deleteItem = () => {
            let allWikis = current.wikis;
            const removed = allWikis.splice(index, 1);
            setCurrent({ ...current, wikis: allWikis});
        }
        Modal.confirm({
            title: 'Are you sure you want to delete?',
            onOk: () => {
            deleteItem()
            }
        })

      };
    return (
        <div className="container pt-3">
        <form onSubmit={handleUpdateLesson}>
            <Row gutter={[36,16]}>
            <Col span={12}>
                <input
                    type="text"
                    className="form-control square"
                    onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                    value={current.title}
                    placeholder="Title"
                    autoFocus
                    required
                />

                <textarea
                    className="form-control mt-3"
                    cols="5"
                    rows="3"
                    placeholder="Content"
                    onChange={(e) => setCurrent({ ...current, content: e.target.value })}
                    value={current.content}
                ></textarea>

                <div>
                    {!uploading && current.video && current.video.Location && (
                            <div className="pt-3 d-flex justify-content-center">
                                <Badge count={"X"} onClick={handleVideoRemove} className="pointer">
                                    <ReactPlayer
                                        url={current.video.Location}
                                        width="410px"
                                        height="240px"
                                        controls
                                    />
                                </Badge>
                            </div>

                    )}

                    <label className="btn btn-dark btn-block text-left mt-3">
                        {uploadVideoButtonText}
                        <input onChange={handleVideo} type="file" accept="video/*" hidden />
                    </label>
                </div>

                {progress > 0 && (
                    <Progress
                        className="d-flex justify-content-center pt-2"
                        percent={progress}
                        steps={10}
                    />
                )}
            </Col>
            <Col span={12}>
                <div className='wiki'>
                    <Space align='center' className='mb-4'>
                        <h6 className='m-0'>Additional Resources</h6>
                        <small className='text-muted'>Additional document content</small>
                    </Space>
                    <Upload
                    {...formProps}
                    accept=".doc,.docx,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    >
                        <Button
                            type="dashed"
                            block
                            icon={<ToTopOutlined />}
                        >
                            Select Files
                        </Button>
                    </Upload>
                </div>
                {current.wikis?.length !==0 &&
                    <List
                        itemLayout="horizontal"
                        dataSource={current.wikis}
                        size='small'
                        renderItem={(item, index) => (
                            <a
                            // href={item.Location}
                            >
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar size="small">{index + 1}</Avatar>}
                                        title={item.name}
                                    >
                                    </List.Item.Meta>
                                    <DeleteOutlined
                                        onClick={() => handleWikiDelete(index)}
                                        className="text-danger float-right"
                                    />
                                </List.Item>
                            </a>
                        )}
                        >
                    </List>

                }
                <Button
                    onClick={handleUpload}
                    className="col mt-3"
                    type="secondary"
                    size="small"
                >
                    Upload Files
                </Button>
            </Col>
        </Row>
        <Button
            onClick={handleUpdateLesson}
            className="col mt-3"
            size="large"
            type="primary"
            loading={uploading}
            shape="round"
        >
            Save
        </Button>
            </form>
        </div>
    );
};

export default UpdateLessonForm;
