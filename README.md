# Canister Documentation: Course Feedback System

## Overview

The Course Feedback System is designed to allow users to leave feedback on courses. Each course and feedback entry has a unique ID, and feedback can be upvoted or downvoted by users.

## Data Structures:

### 1. Course

- **id**: A unique identifier for the course.
- **title**: The title of the course.
- **description**: A detailed description of the course.
- **dateAdded**: The date and time the course was added.
- **tags**: A list of tags associated with the course for categorization and search purposes.

### 2. Feedback

- **id**: A unique identifier for the feedback.
- **courseId**: The ID of the course the feedback is associated with.
- **userId**: The identifier of the user leaving the feedback.
- **rating**: A numeric rating given to the course.
- **message**: A textual description of the feedback.
- **attachmentURL**: Optional URL for any attachments.
- **upvotes**: The number of upvotes the feedback has received.
- **downvotes**: The number of downvotes the feedback has received.
- **createdAt**: The date and time the feedback was created.
- **updatedAt**: The date and time the feedback was last updated.

## Functions:

### Courses:

1. **addCourse(title, description, tags)**

   - Adds a new course to the system.
   - Returns the created course or an error message.

2. **getAllCourses()**

   - Retrieves all courses from the system.
   - Returns a list of courses.

3. **getCourse(courseId)**
   - Fetches a specific course based on its `courseId`.
   - Returns the requested course or an error if not found.

### Feedback:

1. **addFeedback(courseId, userId, rating, message)**

   - Adds feedback to a specific course.
   - Returns the created feedback or an error message.

2. **getFeedback(feedbackId)**

   - Fetches a specific feedback based on its `feedbackId`.
   - Returns the requested feedback or an error if not found.

3. **getFeedbackForCourse(courseId)**

   - Fetches all feedback for a specific course.
   - Returns a list of feedback entries or an error if the course is not found.

4. **upvoteFeedback(feedbackId)**

   - Increases the upvote count of a specific feedback by 1.
   - Returns the updated feedback or an error if not found.

5. **downvoteFeedback(feedbackId)**
   - Increases the downvote count of a specific feedback by 1.
   - Returns the updated feedback or an error if not found.

## Notes:

- This canister uses the `StableBTreeMap` data structure for efficient storage and retrieval of courses and feedback.
- Unique identifiers for courses and feedback are generated using the `uuid` package.
- The system expects proper handling on the client side to manage user identities for feedback.

## Execution

### Steps to Test

1. **Clone the Repository**

2. **Navigate to the Project Directory**

3. **Install Dependencies**

```bash
npm install
```

4. **Start the ICP Blockchain Locally & Deploy the Canister**

```bash
dfx start --background --clean
dfx deploy
```

### Canister Methods & Usage

You can make calls to the canister and its methods. Here are some primary methods available:

- `addCourse`: Adds a new course.
- `getAllCourses`: Retrieves all courses.
- `getCourse`: Fetches details of a specific course.
- `addFeedback`: Adds feedback to a specific course.
- `getFeedback`: Fetches a specific feedback by ID.
- `getFeedbackForCourse`: Gets all feedback for a specific course.
- `upvoteFeedback`: Increases the upvote count for a specific feedback.
- `downvoteFeedback`: Increases the downvote count for a specific feedback.

#### Example CLI Commands:

1. **Add a Course**

```bash
dfx canister call course_feedback addCourse '(record { "title" = "Introduction to Mathematics"; "description" = "A beginner course on basic mathematical concepts."; "tags" = vec { "math"; "beginner"; "theory" } })'
```

2. **Get All Courses**

```bash
dfx canister call course_feedback getAllCourses '()'
```

3. **Get a Specific Course**

```bash
dfx canister call course_feedback getCourse '("2dee4f5d-0055-4143-ad64-265b1af1bde4")'
```

4. **Add Feedback**

```bash
dfx canister call course_feedback addFeedback '(record { "courseId" = "2dee4f5d-0055-4143-ad64-265b1af1bde4"; "userId" = "some_user_id"; "rating" = 5.0; "message" = "This course was excellent!" })'
```

5. **Get a Specific Feedback**

```bash
dfx canister call course_feedback getFeedback '("067de5b2-ab8e-46ac-98a8-12a6133addbe")'
```

6. **Get All Feedback for a Course**

```bash
dfx canister call course_feedback getFeedbackForCourse '("2dee4f5d-0055-4143-ad64-265b1af1bde4")'
```

7. **Upvote a Feedback**

```bash
dfx canister call course_feedback upvoteFeedback '("067de5b2-ab8e-46ac-98a8-12a6133addbe")'
```

8. **Downvote a Feedback**

```bash
dfx canister call course_feedback downvoteFeedback '("067de5b2-ab8e-46ac-98a8-12a6133addbe")'
```
