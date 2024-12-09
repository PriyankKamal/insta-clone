import React, { useContext, useState } from 'react'
import "./CreatePost.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCircleUser } from '@fortawesome/free-regular-svg-icons'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../store/Auth'


const CreatePost = () => {

  const [caption, setCaption] = useState("")
  const [photo, setPhoto] = useState(null)
  const { token } = useContext(AuthContext)


  const handleFileChange = (event) => {
    setPhoto(event.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append("file", photo)
    data.append("upload_preset", "insta-clone")
    data.append("cloud_name", "priyank-cloud")


    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/priyank-cloud/image/upload", {
        method: "POST",
        body: data
      })
      const resData = await res.json()
      console.log(resData.url);

      try {
        const response = await fetch("http://localhost:2000/createpost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            caption,
            photo: resData.url
          })
        })
        const createPostData = await response.json()
        console.log(createPostData);

        if (response.ok) {
          alert("post created")
        }

      } catch (error) {
        console.log("sending createpost error in client", error);
      }

    } catch (error) {
      console.log("image uploading error", error);

    }
  }

  return (
    <>
      <div className="create-post">
        <div className="post-center">
          <form action="" onSubmit={handleSubmit}>
            <div className="post-heading d-flex justify-content-between align-item center">
              <div></div>
              <h4 className='text-center post-h4'>Create new post</h4>
              <input className='float-end mt-1' type="submit" value="Share" />

            </div>
            <div className="post-whole">
              <div className="post-left d-flex align-item-center flex-column justify-content-center ">
                <img src="../images/bg1.png" alt="" />
                <h4>Drag photos and videos here</h4>
                <input type="file" name="" onChange={handleFileChange} />

                {/* <img src="" alt=" not founfd image" /> */}

              </div>
              <div className="post-right">
                <div className="post-box">
                  <FontAwesomeIcon className='post-user' icon={faCircleUser} style={{ color: "#bfbebb", }} />
                  <p>priyank_kamal</p>
                </div>
                <textarea value={caption} name="" id="" cols="30" rows="10" placeholder='Write a caption...' onChange={(e) => { setCaption(e.target.value) }}></textarea>
                {/* <input className='float-end' type="submit" value="Submit"/> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreatePost