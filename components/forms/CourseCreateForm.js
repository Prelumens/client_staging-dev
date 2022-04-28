
import { Button, Avatar, Badge } from "antd";
import {PictureOutlined} from '@ant-design/icons'

// receive props
const courseCreateForm = ({
  handleChange,
  handleImage,
  handleSubmit,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove = (f) => f,
  editPage = false,
}) => (
  <>
    {values &&
      <form onSubmit={handleSubmit}>

        <div className="text-center m-3">
          {!preview ?
            <Avatar size={150} icon={<PictureOutlined />} />
          :
            <Badge count="X" onClick={handleImageRemove} className="pointer">
              <Avatar size={150} src={preview}/>
            </Badge>
          }
          {/* {!editPage && !preview ? (
            <Avatar size={150} icon={<PictureOutlined />} />
          ):editPage && values.image ? (
            <Avatar size={150} src={values.image.Location} />
          ):
          <Badge count="X" onClick={handleImageRemove} className="pointer">
            <Avatar size={150} src={preview}/>
          </Badge>
          } */}

          {/* {preview &&
            (
              <Badge count="X" onClick={handleImageRemove} className="pointer">
                <Avatar size={150} src={preview}/>
              </Badge>
            )
          } */}
      {}
        </div>

        <div className="form-group text-center">
          <label className="btn btn-outline-secondary text-center" style={{width:'25%', overflow:'hidden'}}>
            {uploadButtonText.substring(0,20)} ...
            <input
              type="file"
              name="image"
              onChange={handleImage}
              accept="image/*"
              hidden
            />
          </label>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            value={values.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <textarea
            name="description"
            cols="7"
            rows="7"
            placeholder="Description"
            value={values.description}
            className="form-control"
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="category"
            className="form-control"
            placeholder="Category"
            value={values.category}
            onChange={handleChange}
          />
        </div>


        <div className="row">
          <div className="col text-right">
            <Button
              onClick={handleSubmit}
              disabled={values.loading || values.uploading}
              className="btn btn-primary"
              loading={values.loading}
              type="primary"
              size="large"
              shape="round"
            >
              {values.loading ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </div>
      </form>
    }
  </>

);

export default courseCreateForm;