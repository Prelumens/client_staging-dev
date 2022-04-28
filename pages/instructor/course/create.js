import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Card, message } from "antd";

const CourseCreate = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    category: "",
    uploading: false,
    loading: false,
  });

  const [image, setImage] = useState({})
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image")

  useEffect(() => {
    document.title = "Create Course"
  }, [])
  // router
  const router = useRouter();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    //show image preview
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

  const handleImageRemove = async () => {
    console.log('REMOVE IMAGE')
    try {
      setValues({ ...values, loading: true })
      // const res = await axios.post('/api/course/remove-image', { image })
      setImage({})
      setPreview('')
      setUploadButtonText('Upload Image')
      setValues({ ...values, loading: false })
    } catch (err) {
      console.log(err)
      setValues({ ...values, loading: false })
      toast('Image remove failed. Try later')
    }
  }

  const handleSubmit = async (e) => {
    setValues({ ...values, loading: true })
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
          const { data } = await axios.post("/api/course", {
            ...values,
            image,
          });
          toast("Great! Now you can start adding lessons");
          router.push("/instructor/list-course");
        } catch (err) {
          toast(err.response.data);
        }
      }
    }
  };

  return (
    <InstructorRoute>
      <div className="layout-default layout-student-dashboard content">
          <div className="instructor-add-course-banner-bg">
            <h1 className="">Add Course</h1>
          </div>
          <Card className="circlebox mb-3 header-solid h-full">
            {/* use CourseCreateForm component and pass props */}
            <CourseCreateForm
              handleSubmit={handleSubmit}
              handleImage={handleImage}
              handleChange={handleChange}
              values={values}
              setValues={setValues}
              preview={preview}
              uploadButtonText={uploadButtonText}
              handleImageRemove={handleImageRemove}
            />
          </Card>
      </div>

    </InstructorRoute>
  );
};

export default CourseCreate;
