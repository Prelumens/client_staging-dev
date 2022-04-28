import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar, Modal, Card, Space, Tooltip, message} from "antd";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";
import UpdateWikiForm from "../../../../components/forms/UpdateWikiForm";

const { Item } = List;

const CourseEdit = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    uploading: false,
    category: "",
    loading: false,
    lessons: [],
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  //state for lessons update
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState({})
  const [uploadVideoButtonText, setUploadVideoButtonText] = useState('Upload Video')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [fileList, setFileList] = useState([]);
  const [uploaded, setUploaded] = useState([]);

  // router
  const router = useRouter();
  const { slug } = router.query;

  //request to backend
  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    document.title="Update Course"
  }, []);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    console.log('loadCourse',data);
    if (data) setValues(data.course);
    if (data && data.course.image){
      setImage(data.course.image)
      setPreview(data.course.image.Location)
    };
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    //show image preview
    if(window.URL.createObjectURL(file))
    setPreview(window.URL.createObjectURL(file))
    //show file name
    setUploadButtonText(file.name)
    setValues({ ...values, loading: false })

    //resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post('/api/s3/upload', {
          image: uri,
          folder: 'course'
        });
        console.log('IMAGE UPLOADED', data)
        //set image in the state, set loading to false
        setImage(data)
        setValues({ ...values, loading: false })
      } catch (err) {
        console.log(err)
        setValues({ ...values, loading: false })
        toast('Image upload failed. Try later')
      }
    })
  };

  //   OPTIONAL
  const handleImageRemove = async () => {
    try {
      // console.log(values);
      setValues({ ...values, loading: true });
      // const res = await axios.post("/api/course/remove-image", { image });
      setImage({});
      setPreview("");
      setUploadButtonText("Upload Image");
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast("Image upload failed. Try later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fail=false;
    message
    .loading('Action in progress..', 1)
    .then(() =>action())
    .then(()=>setValues({ ...values, loading: false }))

    const action= async () => {
      if(!values.name){
        message.error("Course name is required.")
        fail = true;
      }
      if(!values.description){
        message.error("Course description is required.")
        fail = true;
      }
      if(!values.category){
        message.error("Course category is required.")
        fail = true;
      }
      if(!image.Location){
        message.error("Please upload course image.")
        fail = true;
      }
      if(!fail){
        try {
          // console.log(values);
          const { data } = await axios.put(`/api/course/${slug}`, {
            ...values,
            image,
          });
          toast("Course updated!");
          router.push(`/instructor/course/view/${data.updatedSlug}`);
        } catch (err) {
          toast(err.response.data);
        }
      }
  }};

  const handleDrag = (e, index) => {
    // console.log("ON DRAG => ", index);
    //save index in dataTransfer object
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    // console.log("ON DROP => ", index);

    const movingItemIndex = e.dataTransfer.getData("itemIndex"); //item index being drag
    const targetItemIndex = index; //item index where to drop over
    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex]; // clicked/dragged item to re-order
    allLessons.splice(movingItemIndex, 1); // remove 1 item from the given index
    allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index

    setValues({ ...values, lessons: [...allLessons] });
    // save the new lessons order in db
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });
    // console.log("LESSONS REARRANGED RES => ", data);
    toast("Lessons rearranged successfully");
  };

  const handleDelete = async (index) => {
    const deleteItem = async () => {
      let allLessons = values.lessons;
      const removed = allLessons.splice(index, 1);
      // console.log("removed", removed[0]._id);
      setValues({ ...values, lessons: allLessons });
      // send request to server
      const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
      console.log("LESSON DELETED =>", data);
    }
    Modal.confirm({
        title: 'Are you sure you want to delete this lesson?',
        onOk: () => {
          deleteItem()
        }
    })

  };

  const handleUpload = async () => {
    try {
        const { data } = await axios.post(`/api/s3/upload-file`,
        {
            fileList,
            folder: 'course/lesson'
        });
        setUploaded(data)
        data.forEach(item => {
          current.wikis.push(item)
        });
        toast("Files uploaded successfully!")
        console.log('data',data)
    } catch (error) {
      console.log(error)
    }
};

  const handleVideo = async (e) => {
    // remove previous
    // if (current.video && current.video.Location) {
    //   const res = await axios.post(
    //     `/api/course/video-remove/${values.instructor._id}`,
    //     current.video
    //   );
    //   console.log("REMOVED ===> ", res);
    // }
    // upload a new video
    const file = e.target.files[0];
    console.log(file);
    setUploadButtonText(file.name);
    setUploading(true);
    // send video as form data
    const videoData = new FormData();
    videoData.append("video", file);
    videoData.append("courseId", values._id);
    // save progress bar and send video as form data to backend
    const { data } = await axios.post(
      `/api/s3/video-upload/${values.instructor._id}`,
      videoData, {
      onUploadProgress: (e) => {
          setProgress(Math.round((100 * e.loaded) / e.total));
      },
  });
    // once response is received
    console.log(data);
    setCurrent({ ...current, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
      e.preventDefault();
      let fail = false;
      if(fileList.length > 0 && uploaded.length === 0){
          message.error("Please upload the attached files.")
          fail = true;
      }
      if (!current.title) {
          message.error("Lesson title is required.")
          fail = true;
      }
      if (!current.content) {
          message.error("Lesson content is required.")
          fail = true;
      }
      if (!fail) {
      let { data } = await axios.put(
        `/api/course/lesson/${slug}/${current._id}`,
        current
      );
      // console.log("LESSON UPDATED AND SAVED ===> ", data);
      setUploadButtonText("Upload video");
      //close modal after submit
      setVisible(false);
      setFileList([])
      // update lessons ui
      if (data.ok) {
        let arr = values.lessons;
        const index = arr.findIndex((el) => el._id === current._id);
        arr[index] = current;
        setValues({ ...values, lessons: arr });
        toast("Lesson updated");
      }
    }
  };

  const handleVideoRemove = async () => {
    // console.log('Handle remove video');
    try {
        setUploading(true)
        // const { data } = await axios.post(
        //     `/api/course/video-remove/${course.instructor._id}`, values.video
        // )
        // console.log(data);
        setCurrent({ ...current, video: {} });
        setUploading(false)
        toast("Video removed successfully.");
    } catch (err) {
        console.log(err);
        setUploading(false);
        toast.error("Video remove failed");
    }
}

  return (
    <InstructorRoute>
      <div className="layout-default layout-student-dashboard content">
        <Card className="circlebox mb-3 header-solid h-full">
          <div className="instructor-add-course-banner-bg">
            <h1 className="">Update Course</h1>

          </div>
          <div className="pt-3 pb-3">
            <CourseCreateForm
              handleSubmit={handleSubmit}
              handleImage={handleImage}
              handleChange={handleChange}
              values={values}
              setValues={setValues}
              preview={preview}
              uploadButtonText={uploadButtonText}
              handleImageRemove={handleImageRemove}
              editPage={true}
            />
          </div>
          <hr />

          <div className="row pb-5">
            <div className="col lesson-list">
              <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
              <List
                onDragOver={(e) => e.preventDefault()}
                itemLayout="horizontal"
                dataSource={values && values.lessons}
                renderItem={(item, index) => (
                  <Item
                    draggable
                    onDragStart={(e) => handleDrag(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <Item.Meta
                      className="instructor-lessons"
                      onClick={() => {
                        setVisible(true)
                        setCurrent(item)
                      }}
                      avatar={<Avatar>{index + 1}</Avatar>}
                      title={item.title}
                    ></Item.Meta>

                    <DeleteOutlined
                      onClick={() => handleDelete(index)}
                      className="text-danger float-right"
                    />
                  </Item>
                )}
              ></List>
            </div>
          </div>

        </Card>
      </div>

      <Modal
        title="👨🏻‍🏫 Update Lesson"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={1000}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          handleVideo={handleVideo}
          handleVideoRemove={handleVideoRemove}
          handleUpdateLesson={handleUpdateLesson}
          uploadVideoButtonText={uploadVideoButtonText}
          setFileList={setFileList}
          fileList={fileList}
          progress={progress}
          uploading={uploading}
          handleUpload={handleUpload}
          slug={slug}
        />
      </Modal>

    </InstructorRoute>
  );
};

export default CourseEdit;