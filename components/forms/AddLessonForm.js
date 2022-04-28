import { Button, Progress, Tooltip, Space, Input, message, Upload, Divider, Row, Col } from 'antd'
import { CloseCircleFilled,ToTopOutlined } from '@ant-design/icons'

const { TextArea } = Input;
// receive props from parent
const AddLessonForm = ({
    values,
    setValues,
    handleAddLesson,
    uploading,
    uploadButtonText,
    handleVideo,
    progress,
    handleVideoRemove,
    handleUpload,
    fileList,
    setFileList
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

    return <div className="container pt-3">

        <form onSubmit={handleAddLesson}>
        <Row gutter={[24,24]}>
            <Col span={12}>
                <input
                    type="text"
                    className="form-control square"
                    onChange={(e) => setValues({ ...values, title: e.target.value })}
                    value={values.title}
                    placeholder="Title"
                    autoFocus
                    required
                />

                <textarea
                    className="form-control mt-3"
                    cols="7"
                    rows="7"
                    placeholder="Content"
                    value={values.content}
                    onChange={(e) => setValues({ ...values, content: e.target.value })}
                ></textarea>

                <div className="d-flex justify-content-center">
                    <label className="btn btn-dark btn-block text-left mt-3">
                        {uploadButtonText}
                        <input onChange={handleVideo} type="file" accept="video/*" hidden />
                    </label>
                    {!uploading && values.video.Location && (
                        <Tooltip title="Remove">
                            <span onClick={handleVideoRemove} className="pt-1 pl-3">
                                <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
                            </span>
                        </Tooltip>
                    )}
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
                        <h6 className='m-0'>Wikis</h6>
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
                <Button
                    onClick={handleUpload}
                    className="col mt-3"
                    style={{backgroundColor:'#343a40', color:'#fff'}}
                    size="small"
                >
                    Upload Files
                </Button>
            </Col>
        </Row>
            <Button
                onClick={handleAddLesson}
                className="col mt-3"
                loading={uploading}
                type="primary"
                size="large"
                shape="round"
            >
                Add Lesson
            </Button>
        </form>
    </div>
}

export default AddLessonForm;