// Page wrapper for /courses/subject/[subjectId]. The view reads its subjectId
// from useParams() so we pass nothing.
import { SubjectLessonsView } from "../../../explore/subject/[subjectId]/SubjectLessonsView";

export default function Page() {
    return <SubjectLessonsView />;
}
