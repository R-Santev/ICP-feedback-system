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
  Principal,
} from "azle";
import { v4 as uuidv4 } from "uuid";

type Course = Record<{
  id: string;
  title: string;
  description: string;
  dateAdded: nat64;
  tags: Vec<string>;
  createdBy: Principal; // Add creator's principal
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
  createdBy: Principal; // Add creator's principal
}>;

type FeedbackPayload = Record<{
  courseId: string;
  rating: number;
  message: string;
}>;

const courseStorage = new StableBTreeMap<string, Course>(0, 44, 1024);
const feedbackStorage = new StableBTreeMap<string, Feedback>(1, 45, 1024);

globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return array;
  },
};

$update;
export function addCourse(payload: CoursePayload): Result<Course, string> {
  const caller = ic.provisional_create_canister({ controller: ic.caller() });
  const course: Course = {
    id: uuidv4(),
    dateAdded: ic.time(),
    createdBy: caller,
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
    Some: (course) => Result.Ok<Course, string>(course),
    None: () =>
      Result.Err<Course, string>(`Course with id=${courseId} not found`),
  });
}

$update;
export function addFeedback(
  payload: FeedbackPayload
): Result<Feedback, string> {
  const caller = ic.provisional_create_canister({ controller: ic.caller() });
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
    createdBy: caller,
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
    Some: (feedback) => Result.Ok<Feedback, string>(feedback),
    None: () =>
      Result.Err<Feedback, string>(`Feedback with id=${feedbackId} not found`),
  });
}

$update;
export function upvoteFeedback(feedbackId: string): Result<Feedback, string> {
  const caller = ic.provisional_create_canister({ controller: ic.caller() });
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
  const caller = ic.provisional_create_canister({ controller: ic.caller() });
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
    const array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
