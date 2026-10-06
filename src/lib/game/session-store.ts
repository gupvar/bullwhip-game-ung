const STUDENT_KEY = "nighthawk-student";
const INSTRUCTOR_KEY = "nighthawk-instructor";

export interface StudentSession {
  token: string;
  roomCode: string;
  handle: string;
  teamIndex: number;
  role: string;
}

export interface InstructorSession {
  token: string;
  roomCode: string;
  pin: string;
}

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStudentSession(): StudentSession | null {
  return read<StudentSession>(STUDENT_KEY);
}

export function setStudentSession(session: StudentSession) {
  write(STUDENT_KEY, session);
}

export function clearStudentSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STUDENT_KEY);
}

export function getInstructorSession(): InstructorSession | null {
  return read<InstructorSession>(INSTRUCTOR_KEY);
}

export function setInstructorSession(session: InstructorSession) {
  write(INSTRUCTOR_KEY, session);
}

export function clearInstructorSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(INSTRUCTOR_KEY);
}
