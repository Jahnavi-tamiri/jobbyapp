import {Component} from 'react'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobDetails extends Component {
  state = {
    detailsList: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.jobdetailList()
  }

  jobdetailList = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.loading})

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        detailsList: data.job_details,
        similarJobs: data.similar_jobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onSuccessview = () => {
    const {detailsList, similarJobs} = this.state
    const {
      company_logo_url,
      company_website_url,
      employment_type,
      job_description,
      skills = [],
      title,
      location,
      package_per_annum,
      life_at_company = {},
      rating,
    } = detailsList

    return (
      <div className="bg-container">
        <div className="detailcard">
          <div className="company">
            <img
              className="companyimg"
              src={company_logo_url}
              alt="job details company logo"
            />
            <div>
              <h1>{title}</h1>
              <p>{rating}</p>
            </div>
          </div>
          <div className="package">
            <div className="location">
              <p>{location}</p>
              <p>{employment_type}</p>
            </div>
            <p>{package_per_annum}</p>
          </div>
          <hr />
          <div className="description">
            <h1>Description</h1>
            <a href={company_website_url}>Visit</a>
          </div>
          <p>{job_description}</p>

          {/* Skills Section */}
          <h1>Skills</h1>
          <ul className="skills-ul" data-testid="skills-ul">
            {skills.length > 0 ? (
              skills.map(each => (
                <li key={each.name} className="skills">
                  <img
                    src={each.image_url}
                    alt={each.name}
                    className="skillimg"
                  />
                  <p>{each.name}</p>
                </li>
              ))
            ) : (
              <p>No skills available</p>
            )}
          </ul>

          <div className="life">
            <div>
              <h1>Life at Company</h1>
              <p>{life_at_company.description}</p>
            </div>
            <img src={life_at_company.image_url} alt="life at company" />
          </div>
        </div>

        {/* Similar Jobs Section */}
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-ul" data-testid="similar-jobs-ul">
          {similarJobs.length > 0 ? (
            similarJobs.map(eachjob => (
              <li key={eachjob.id} className="similar-job-item">
                <div className="company">
                  <img
                    className="companyimg"
                    src={eachjob.company_logo_url}
                    alt="similar job company logo"
                  />
                  <div>
                    <h1>{eachjob.title}</h1>
                    <p>{eachjob.rating}</p>
                    <p>{eachjob.employment_type}</p>
                    <p>{eachjob.location}</p>
                  </div>
                </div>
                <h1>Description</h1>
                <p>{eachjob.job_description}</p>
              </li>
            ))
          ) : (
            <p>No similar jobs available</p>
          )}
        </ul>
      </div>
    )
  }

  onFailureview = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="fail-view-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button className="logout" type="button" onClick={this.jobdetailList}>
        Retry
      </button>
    </div>
  )

  onLoadingview = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  apistatusResult = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onSuccessview()
      case apiStatusConstants.failure:
        return this.onFailureview()
      case apiStatusConstants.loading:
        return this.onLoadingview()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div>{this.apistatusResult()}</div>
      </div>
    )
  }
}

export default JobDetails
