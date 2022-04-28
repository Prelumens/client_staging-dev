import AdminRoute from "../../../components/routes/AdminRoute";
import RegistrationForm from "../../../components/forms/RegistrationForm";
import { useState, useEffect, useContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import Resizer from "react-image-file-resizer";
import { Context } from "../../../context";
import { useRouter } from 'next/router'
import { message } from 'antd'
const AddStudent = () => {
  //username prefix
  const usernamePrefix = "student-000"
  const [numberOfStudent, setNumberOfStudent] = useState()
  const [studentId, setStudentId] = useState("")

  useEffect(() => {
    document.title = "Add Student"
  }, []);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/username-generator");
      setNumberOfStudent(data.student + 1);
      console.log(data.student)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    generateUsername()
  }, [numberOfStudent, studentId])


  const generateUsername = () => {
    setStudentId(usernamePrefix.concat(numberOfStudent))
    console.log(studentId);
  }

  //state
  const [image, setImage] = useState({})
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false)
  const [uploadButtonText, setUploadButtonText] = useState("")
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    studentNum: "",
    birthDate: "",
    gender: "",
    guardian: "",
    contact: "",
    address: "",
    level: ""
  });
  //state
  const { state: { user } } = useContext(Context);
  //router
  const router = useRouter();
  //allow no access to register page once logged in
  useEffect(() => {
    if (user && user.role.includes("Instructor"))
      router.push("/")
    else if (user && user.role.includes("Subscriber"))
      router.push("/")
  }, [user]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    setLoading(true)
    try {
      // register the user to database
      try {
        const { data } = await axios.post("/api/admin/register-student", {
          ...values,
          username: studentId,
          image
        });
      } catch (error) {
        toast.error(error.response.data)
        console.log(error)
        setLoading(false)
        return
      }

      // register the user to chatengine.io
      try {
        const { data } = await axios.post(`/api/admin/register-student-to-chatengine`, {
          ...values,
          username: studentId,
        })
      } catch (error) {
        console.log(error)
      }

      //register the guardian to chatengine io
      try {
        const { data } = await axios.post(`/api/admin/register-guardian-to-chatengine`, {
          ...values,
          username: studentId,
        })
      } catch (error) {

      }

      // when a user successfully registered to db and chatengine
      toast.success('Student record added')
      router.push("/admin/manage-students/list-student");

    } catch (err) {
      toast.error(err.response.data)
      console.log(err);
    }
    setLoading(false)
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
          folder: 'users'
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
      // const res = await axios.post('/api/admin/remove-image', { image })
      setImage({})
      setPreview("")
      setUploadButtonText('Upload Image')
      setValues({ ...values, loading: false })
    } catch (err) {
      console.log(err)
      setValues({ ...values, loading: false })
      toast('Image upload failed. Try later')
    }
  }
  return (
    <AdminRoute>
      <div className="layout-default layout-student-dashboard">
        <div className="content">
          <div className="admin-add-students-banner-bg">
            <h1 className="">Add Student</h1>
          </div>
          <RegistrationForm
            image={image}
            loading={loading}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setUploadButtonText={setUploadButtonText}
            values={values}
            setValues={setValues}
            handleImage={handleImage}
            preview={preview}
            handleImageRemove={handleImageRemove}
            editPage={false}
            studentId={studentId}
          />
        </div>
      </div>
    </AdminRoute>
  )
}
export default AddStudent;