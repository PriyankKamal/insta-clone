import React from 'react'
import "./Posts.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
const Posts = () => {
    return ( 
        <>
            <div className="container ">
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-4 col-md-4 col-sm-2 col-xs-2">
                        <div className="post-card mt-4 ">
                            <div className="post-header d-flex align-items-center gap-2 ">
                                <img src="https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                                <h4 className='mb-0 fs-6 fw-bolder'>Priyank</h4>
                            </div>
  
                                <img src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                                <FontAwesomeIcon className='post-fa-heart' icon={faHeart} style={{"--fa-primary-color": "#ff5a3d", "--fa-secondary-color": "#e22503",}} />
                                <p className='mb-0 post-content'>1 Likes</p>
                                <p className='mb-0 post-content'>This is amazing</p>
                            
                            <div className="post-footer">

                            </div>
                        </div>
                        {/* <div className="post-card ">
                            <div className="post-header"></div>
                            <div className="img"></div>
                            <div className="post-footer"></div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    ) 
}

export default Posts