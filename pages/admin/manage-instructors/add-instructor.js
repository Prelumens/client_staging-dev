import AdminRoute from "../../../components/routes/AdminRoute";
import InstructorRegForm from "../../../components/forms/InstructorRegForm";
import { useState, useEffect, useContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import Resizer from "react-image-file-resizer";
import { Context } from "../../../context";
import { useRouter } from 'next/router'

const AddInstructor = () => {
  //username prefix
  const usernamePrefix = "instructor-000"
  const [numberOfInstructor, setNumberOfInstructor] = useState()
  const [instructorId, setInstructorId] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/username-generator");
      setNumberOfInstructor(data.instructor + 1);
      console.log(data.instructor)

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    generateUsername()
  }, [numberOfInstructor, instructorId])

  const generateUsername = () => {
    setInstructorId(usernamePrefix.concat(numberOfInstructor))
    console.log(instructorId);
  }


  //state
  const [image, setImage] = useState({})
  const [preview, setPreview] = useState("");
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    gender: null,
    contact: "",
    address: ""
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

  useEffect(() => {
    document.title = "Add Instructor"
  }, []);
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
      //register instructor to db
      try {
        const { data } = await axios.post("/api/admin/register-instructor", {
          ...values,
          image
        });
      } catch (error) {
        toast.error(error.response.data)
        console.log(error.response.data)
      }

      //register instructor to chatengine.io
      try {
        const { data } = await axios.post(`/api/admin/register-instructor-to-chatengine`, {
          ...values
        })
      } catch (error) {
        console.log(error)
      }

      //when user is added in db and chat engine io
      toast.success('Instructor record added')
      router.push("/admin/manage-instructors/list-instructor");
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
      setPreview('')
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
          <div className="admin-add-instructors-banner-bg">
            <h1 className="">Add Instructor</h1>
          </div>
          <InstructorRegForm
            loading={loading}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            setValues={setValues}
            handleImage={handleImage}
            preview={preview}
            handleImageRemove={handleImageRemove}
            editPage={false}
            instructorId={instructorId}
          />
        </div>
      </div>


    </AdminRoute>
  )
}
export default AddInstructor;