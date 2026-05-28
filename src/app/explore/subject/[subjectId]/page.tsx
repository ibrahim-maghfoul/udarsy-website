// Next 16 PageProps wrapper. Logic lives in SubjectLessonsView, which is
// also re-used by the /courses/[...path] catch-all route.
import { SubjectLessonsView } from "./SubjectLessonsView";

export default function Page() {
    return <SubjectLessonsView />;
}
