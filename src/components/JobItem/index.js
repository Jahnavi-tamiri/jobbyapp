import {Link} from 'react-router-dom'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    company_logo_url,
    employment_type,
    job_description,
    location,
    package_per_annum,
    rating,
    title,
    id,
  } = jobDetails
  return (
    <li className="li-jobs">
      <Link to={`/jobs/${id}`} className="job-item">
        <div className="company">
          <img
            className="companyimg"
            src={company_logo_url}
            alt="company logo"
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
        <h1>Description</h1>
        <p>{job_description}</p>
      </Link>
    </li>
  )
}

export default JobItem
