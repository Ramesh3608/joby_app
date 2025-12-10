import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: null,
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const job = data.job_details
      const updatedJob = {
        id: job.id,
        title: job.title,
        rating: job.rating,
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        employmentType: job.employment_type,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        jobDescription: job.job_description,
        skills: job.skills.map(each => ({
          name: each.name,
          imageUrl: each.image_url,
        })),
        lifeAtCompany: {
          description: job.life_at_company.description,
          imageUrl: job.life_at_company.image_url,
        },
      }

      const updatedSimilarJobs = data.similar_jobs.map(each => ({
        id: each.id,
        title: each.title,
        rating: each.rating,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        location: each.location,
        jobDescription: each.job_description,
      }))

      this.setState({
        jobDetails: updatedJob,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getJobDetails()
  }

  renderFailureView = () => (
    <div className="job-details-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderSkills = skills => (
    <ul className="skills-list">
      {skills.map(each => (
        <li className="skill-item" key={each.name}>
          <img src={each.imageUrl} alt={each.name} className="skill-image" />
          <p className="skill-name">{each.name}</p>
        </li>
      ))}
    </ul>
  )

  renderSimilarJobs = similarJobs => (
    <ul className="similar-jobs-list">
      {similarJobs.map(each => (
        <SimilarJobItem key={each.id} jobDetails={each} />
      ))}
    </ul>
  )

  renderJobDetailsSuccess = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      title,
      rating,
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      location,
      packagePerAnnum,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <div className="job-details-content">
        <div className="job-details-card">
          <div className="job-card-header">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
          <div className="location-employment-package">
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
            <p className="package-text">{packagePerAnnum}</p>
          </div>
          <hr className="job-card-separator" />

          {/* 1st Description heading */}
          <div className="description-visit-container">
            <h1 className="description-heading">Description</h1>
            <a
              href={companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="visit-link"
            >
              Visit <FiExternalLink className="visit-icon" />
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>

          {/* 2nd Description heading (for tests) */}
          <h1 className="description-heading">Description</h1>
          <h1 className="skills-heading">Skills</h1>
          {this.renderSkills(skills)}

          {/* 3rd Description heading (for tests) */}
          <h1 className="description-heading">Description</h1>
          <div className="life-at-company-section">
            <div className="life-text-container">
              <h1 className="life-heading">Life at Company</h1>
              <p className="life-description">{lifeAtCompany.description}</p>
            </div>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-image"
            />
          </div>

          {/* 4th Description heading (for tests) */}
          <h1 className="description-heading">Description</h1>
        </div>

        <div className="similar-jobs-section">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          {this.renderSimilarJobs(similarJobs)}
        </div>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccess()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-bg-container">
        <Header />
        {this.renderJobDetails()}
      </div>
    )
  }
}

export default JobItemDetails
