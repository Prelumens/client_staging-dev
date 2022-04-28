import { Input, Space, Upload, Button, message, Row, Col } from 'antd';
import { ToTopOutlined, DeleteOutlined } from '@ant-design/icons'

// receive props from parent
const UpdateWikiForm = ({
    wiki,
    setWiki,
    handleUpload,
    handleAddWiki,
    fileList,
    setFileList,
    current,
    setCurrent,
    handleUpdateWiki,
    uploading,
    uploadVideoButtonText,
    handleVideo,
    progress,
}) => {
    const { TextArea } = Input;
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
          if (info.file.status === "uploading") {
            message.success(`Uploading`);
          }
          if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`)
            setFileList(info.fileList)
            handleUpload(fileList)
            console.log('DONE',info.file, info.fileList);
          } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
    return(
        <div className='wiki'>
            <Space direction="vertical" style={{width:'100%'}}>
                <Input placeholder="Untitled Wiki"
                    onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                    value={current.title}
                    autoFocus
                />
                <TextArea
                rows={4}
                placeholder="Wiki Description"
                onChange={(e) => setCurrent({ ...current, description: e.target.value })}
                value={current.description}
                />
                <Row>
                    <Col span={22}>
                        <a href={current.file?.Location}>{current.file?.Key}</a>
                    </Col>
                    {current.file?.Location &&
                        <Col span={2} className="text-right">
                            <DeleteOutlined
                            onClick={() => setCurrent({ ...current, file: {} })}
                            className="text-danger text-right"
                            />
                        </Col>
                    }
                </Row>
                <Upload {...formProps} maxCount={1}>
                    <Button
                        type="dashed"
                        block
                        icon={<ToTopOutlined />}
                    >
                        Upload File
                    </Button>
                </Upload>
                <Button type='primary' block onClick={()=>handleUpdateWiki()}>
                    Save Wiki
                </Button>
            </Space>
        </div>
    )
}

export default UpdateWikiForm;