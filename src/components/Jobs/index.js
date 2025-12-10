import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobCard from '../JobCard'
import {employmentTypesList, salaryRangesList} from '../../utils/filterData'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileStatus: apiStatusConstants.initial,
    profileDetails: {},
    jobsStatus: apiStatusConstants.initial,
    jobsList: [],
    searchInput: '',
    employmentType: [],
    minimumPackage: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getProfileDetails = async () => {
    this.setState({profileStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profile = data.profile_details
      const updatedProfile = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      this.setState({
        profileDetails: updatedProfile,
        profileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsStatus: apiStatusConstants.inProgress})
    const {searchInput, employmentType, minimumPackage} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const employmentTypeParam = employmentType.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeParam}&minimum_package=${minimumPackage}&search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobs = data.jobs.map(each => ({
        id: each.id,
        title: each.title,
        rating: each.rating,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        jobDescription: each.job_description,
      }))
      this.setState({
        jobsList: updatedJobs,
        jobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsStatus: apiStatusConstants.failure})
    }
  }

  retryProfile = () => {
    this.getProfileDetails()
  }

  retryJobs = () => {
    this.getJobs()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobs()
  }

  onChangeEmploymentType = event => {
    const {employmentType} = this.state
    const {value, checked} = event.target
    let updatedList = employmentType
    if (checked) {
      updatedList = [...employmentType, value]
    } else {
      updatedList = employmentType.filter(each => each !== value)
    }
    this.setState({employmentType: updatedList}, this.getJobs)
  }

  onChangeMinimumPackage = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobs)
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSuccess = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.retryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderProfileSection = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderProfileSuccess()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  renderJobsSuccess = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image"
          />
          <h1 className="no-jobs-heading">No Jobs Found</h1>
          <p className="no-jobs-description">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(eachJob => (
          <JobCard key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    )
  }

  renderJobsFailure = () => (
    <div className="jobs-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.retryJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsSection = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderJobsSuccess()
      case apiStatusConstants.failure:
        return this.renderJobsFailure()
      default:
        return null
    }
  }

  renderEmploymentTypes = () => (
    <ul className="filters-list">
      {employmentTypesList.map(each => (
        <li className="filter-item" key={each.employmentTypeId}>
          <input
            type="checkbox"
            id={each.employmentTypeId}
            value={each.employmentTypeId}
            onChange={this.onChangeEmploymentType}
            className="checkbox-input"
          />
          <label htmlFor={each.employmentTypeId} className="filter-label">
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderSalaryRanges = () => (
    <ul className="filters-list">
      {salaryRangesList.map(each => (
        <li className="filter-item" key={each.salaryRangeId}>
          <input
            type="radio"
            id={each.salaryRangeId}
            name="salary"
            value={each.salaryRangeId}
            onChange={this.onChangeMinimumPackage}
            className="radio-input"
          />
          <label htmlFor={each.salaryRangeId} className="filter-label">
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-container">
        <input
          type="search"
          className="search-input"
          value={searchInput}
          onChange={this.onChangeSearchInput}
          placeholder="Search"
        />
        <button
          type="button"
          className="search-button"
          data-testid="searchButton"
          onClick={this.onClickSearch}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="jobs-body">
          <div className="left-section">
            {this.renderProfileSection()}
            <hr className="separator" />
            <h1 className="filter-heading">Type of Employment</h1>
            {this.renderEmploymentTypes()}
            <hr className="separator" />
            <h1 className="filter-heading">Salary Range</h1>
            {this.renderSalaryRanges()}
          </div>
          <div className="right-section">
            {this.renderSearchInput()}
            {this.renderJobsSection()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
