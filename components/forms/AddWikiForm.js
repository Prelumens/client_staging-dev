import { Input, Space, Upload, Button, message } from 'antd';
import { ToTopOutlined } from '@ant-design/icons'

// receive props from parent
const AddWikiForm = ({
    wiki,
    setWiki,
    handleUpload,
    handleAddWiki,
    fileList,
    setFileList
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
                <Input placeholder="Untitled Wiki" onChange={(e) => setWiki({ ...wiki, title: e.target.value })}/>
                <TextArea rows={4} placeholder="Wiki Description" onChange={(e) => setWiki({ ...wiki, description: e.target.value })}/>
                <Upload {...formProps} maxCount={1}>
                    <Button
                        type="dashed"
                        block
                        icon={<ToTopOutlined />}
                    >
                        Upload File
                    </Button>
                </Upload>
                <Button type='primary' block onClick={()=>handleAddWiki()}>
                    Add Wiki
                </Button>
            </Space>
        </div>
    )
}

export default AddWikiForm;