import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    title,
    rating,
    companyLogoUrl,
    employmentType,
    location,
    jobDescription,
  } = jobDetails

  return (
    <li className="similar-job-card">
      <div className="job-card-header">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="job-company-logo"
        />
        <div className="title-rating">
          <h1 className="job-title">{title}</h1>
          <div className="rating-container">
            <AiFillStar className="star-icon" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="description-heading">Description</h1>
      <p className="job-description">{jobDescription}</p>
      <div className="location-employment">
        <div className="location-container">
          <MdLocationOn className="location-icon" />
          <p className="location-text">{location}</p>
        </div>
        <div className="employment-container">
          <BsBriefcaseFill className="employment-icon" />
          <p className="employment-text">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
