// Page wrapper for /courses/subject/[subjectId]. The view reads its subjectId
// from useParams() so we pass nothing.
import { SubjectLessonsView } from "./SubjectLessonsView";

export default function Page() {
    return <SubjectLessonsView />;
}
