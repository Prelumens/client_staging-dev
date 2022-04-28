import { Modal, Calendar, Badge, } from 'antd';
import moment from "moment";

const CalendarModal = ({
    visible,
    setVisible,
    active,
    completeds
}) => {
  function getListData(value) {
    let listData=[];
    active.forEach(item => {
      if(moment(value.toISOString()).format('L') == moment(item.deadline).format('L') ){
        listData.push({ type: moment().isAfter(item.deadline) ? 'error':'processing', content: item.title})
      }
    });
    completeds?.forEach(item => {
      if(moment(value.toISOString()).format('L') == moment(item.submissionDate).format('L') ){
        listData.push({ type: 'success', content: item.title})
      }
    });
    return listData || [];
  }

  function dateCellRender(value) {
    const listData = getListData(value);
    return (
      <ul className="events m-0 p-0">
        {listData.map(item => (
            <Badge key={item.content} status={item.type} text={<small>{item.content}</small>} />
        ))}
      </ul>
    );
  }
    return (
        <>
            <Modal
                style={{top:'20px'}}
                title="Calendar"
                visible={visible}
                onCancel={()=> setVisible(false)}
                footer={false}
                width={1000}
                closable
            >
                <Calendar dateCellRender={dateCellRender}/>
            </Modal>
        </>
    );
};

export default CalendarModal;