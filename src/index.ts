import {
  $query,
  $update,
  Record,
  StableBTreeMap,
  Vec,
  match,
  Result,
  nat64,
  ic,
  Opt,
} from "azle";
import { v4 as uuidv4 } from "uuid";

type Course = Record<{
  id: string;
  title: string;
  description: string;
  dateAdded: nat64;
  tags: Vec<string>;
}>;

type CoursePayload = Record<{
  title: string;
  description: string;
  tags: Vec<string>;
}>;

type Feedback = Record<{
  id: string;
  courseId: string;
  rating: number;
  message: string;
  attachmentURL: Opt<string>;
  upvotes: nat64;
  downvotes: nat64;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;

type FeedbackPayload = Record<{
  courseId: string;
  rating: number;
  message: string;
}>;

const courseStorage = new StableBTreeMap<string, Course>(0, 44, 1024);
const feedbackStorage = new StableBTreeMap<string, Feedback>(1, 45, 1024);

$update;
export function addCourse(payload: CoursePayload): Result<Course, string> {
  const course: Course = {
    id: uuidv4(),
    dateAdded: ic.time(),
    ...payload,
  };

  courseStorage.insert(course.id, course);
  return Result.Ok(course);
}

$query;
export function getAllCourses(): Result<Vec<Course>, string> {
  return Result.Ok(courseStorage.values());
}

$query;
export function getCourse(courseId: string): Result<Course, string> {
  return match(courseStorage.get(courseId), {
    Some: (message) => Result.Ok<Course, string>(message),
    None: () =>
      Result.Err<Course, string>(`a message with id=${courseId} not found`),
  });
}

$update;
export function addFeedback(
  payload: FeedbackPayload
): Result<Feedback, string> {
  const course = courseStorage.get(payload.courseId);
  if (!course) {
    return Result.Err<Feedback, string>("Course not found.");
  }

  const feedback: Feedback = {
    id: uuidv4(),
    attachmentURL: Opt.None,
    upvotes: BigInt(0),
    downvotes: BigInt(0),
    createdAt: ic.time(),
    updatedAt: Opt.None,
    ...payload,
  };

  feedbackStorage.insert(feedback.id, feedback);
  return Result.Ok(feedback);
}

$query;
export function getFeedbackForCourse(
  courseId: string
): Result<Vec<Feedback>, string> {
  const feedbacks = feedbackStorage
    .values()
    .filter((feedback) => feedback.courseId === courseId);
  return Result.Ok(feedbacks);
}

$query;
export function getFeedback(feedbackId: string): Result<Feedback, string> {
  return match(feedbackStorage.get(feedbackId), {
    Some: (message) => Result.Ok<Feedback, string>(message),
    None: () =>
      Result.Err<Feedback, string>(`a message with id=${feedbackId} not found`),
  });
}

$update;
export function upvoteFeedback(feedbackId: string): Result<Feedback, string> {
  const feedbackOpt = feedbackStorage.get(feedbackId);

  if (feedbackOpt && feedbackOpt.Some) {
    const feedback = feedbackOpt.Some;
    feedback.upvotes = feedback.upvotes + BigInt(1);
    feedbackStorage.insert(feedback.id, feedback);
    return Result.Ok(feedback);
  } else {
    return Result.Err<Feedback, string>("Feedback not found.");
  }
}

$update;
export function downvoteFeedback(feedbackId: string): Result<Feedback, string> {
  const feedbackOpt = feedbackStorage.get(feedbackId);

  if (feedbackOpt && feedbackOpt.Some) {
    const feedback = feedbackOpt.Some;
    feedback.downvotes = feedback.downvotes + BigInt(1);
    feedbackStorage.insert(feedback.id, feedback);
    return Result.Ok(feedback);
  } else {
    return Result.Err<Feedback, string>("Feedback not found.");
  }
}

// Here's the workaround for the UUID package with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
