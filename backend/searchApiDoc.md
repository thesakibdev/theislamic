# Job Search API

## Overview
This project sets up an Express server with MongoDB using Mongoose to manage job postings and search functionalities.

---

## Setup

### 1. Install Dependencies
Run the following command to install required dependencies:
```bash
npm install
```

### 2. Start the Server
To run the server in development mode, use:
```bash
npm run dev
```

---

## Database Schema
The `Job` schema defines the structure for job postings:
```javascript
const mongoose = require('mongoose');
const slugify = require('slugify');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, text: true },
  company: {
    name: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    companySize: { type: String, trim: true, enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] },
    companyType: { type: String, trim: true, enum: ['Public', 'Private', 'Government', 'Non-Profit'] },
    companyLogo: { type: String }
  },
  jobType: { type: String, required: true, trim: true, enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Freelance'] },
  jobCategory: { type: String, required: true, trim: true },
  jobFunction: { type: String, required: true, trim: true },
  industry: { type: String, required: true, trim: true },
  experience: {
    minYears: { type: Number, trim: true, default: 0 },
    maxYears: { type: Number, trim: true, default: Infinity }
  },
  salary: {
    currency: { type: String, trim: true, default: 'USD' },
    min: { type: Number, trim: true, default: 0 },
    max: { type: Number, trim: true, default: Infinity }
  },
  location: {
    country: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    zipCode: { type: String, trim: true }
  },
  workingHours: { type: String, trim: true, enum: ['Full-time', 'Part-time', 'Flexible'] },
  remoteOption: { type: String, trim: true, enum: ['Remote', 'On-site', 'Hybrid'] },
  description: { type: String, required: true, trim: true },
  responsibilities: [{ type: String, trim: true }],
  qualifications: [{ type: String, trim: true }],
  benefits: [{ type: String, trim: true }],
  skills: [{ type: String, trim: true }],
  status: { type: String, enum: ['Active', 'Inactive', 'Closed'], default: 'Active' },
  applyMethod: { type: String, required: true, trim: true, enum: ['quickApply', 'url'] },
  applyURL: { type: String, trim: true },
  isFeatured: { type: Boolean, default: false },
  applicationDeadline: { type: Date },
  postingDate: { type: Date, default: Date.now },
  slug: { type: String, unique: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer' }
}, { timestamps: true });

// Middleware to generate the slug before saving the job document
jobSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true, strict: true, trim: true }) + `-${this.location.city.toLowerCase().replace(/\s+/g, '-')}`;
  next();
});

jobSchema.index({ title: 'text', jobCategory: 'text', jobFunction: 'text', industry: 'text', location: 'text', skills: 'text' });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
```

---

## Search Functionality
The `searchJobs` function allows job filtering based on various criteria:
```javascript
const searchJobs = async (query, filters) => {
  const searchQuery = { $text: { $search: query }, ...filters };
  if (filters.location) searchQuery['location.city'] = { $regex: filters.location, $options: 'i' };
  if (filters.skills?.length > 0) searchQuery.skills = { $in: filters.skills };
  return await Job.find(searchQuery);
};
```

---

## API Endpoints
### 1. Search Jobs
```http
GET /search
```
#### Query Parameters:
| Parameter       | Type   | Description |
|---------------|--------|------------|
| q             | string | Search query (e.g., job title, skills) |
| location      | string | City name (optional) |
| jobCategory   | string | Job category filter (optional) |
| jobFunction   | string | Job function filter (optional) |
| industry      | string | Industry filter (optional) |
| jobType       | string | Job type (Full-time, Part-time, etc.) |
| remoteOption  | string | Work location (Remote, On-site, Hybrid) |
| minSalary     | number | Minimum salary (optional) |
| maxSalary     | number | Maximum salary (optional) |
| minExperience | number | Minimum experience in years (optional) |
| maxExperience | number | Maximum experience in years (optional) |
| skills        | string | Comma-separated skills (optional) |
| page          | number | Pagination - page number (default: 1) |
| limit         | number | Pagination - results per page (default: 10) |

#### Example Request:
```bash
curl "http://localhost:3000/search?q=developer&location=New+York&minSalary=50000&maxSalary=120000&skills=JavaScript,Node.js&page=1&limit=10"
```

#### Example Response:
```json
{
  "jobs": [...],
  "currentPage": 1,
  "totalPages": 5,
  "totalJobs": 50
}
```

---

## Testing the API
Use tools like **Postman** or **cURL** to test the API.

#### Start the Server:
```bash
npm run dev
```

#### Test Search Endpoint with Postman or cURL:
```bash
curl "http://localhost:3000/search?q=developer&location=New+York&minSalary=50000&maxSalary=120000&skills=JavaScript,Node.js&page=1&limit=10"
```

---

## Conclusion
This Express-based job search API provides robust job search functionality with filtering options for job type, salary, location, and skills. It is optimized for text search using MongoDB indexes.

