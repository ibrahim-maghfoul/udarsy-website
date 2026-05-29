import LessonPageClient from "./LessonPageClient";

// Metadata + JSON-LD live in this route's layout.tsx (parent segment).
// Keeping the page lean avoids the duplicate generateMetadata override the previous
// page.tsx version caused (its title fell back to the bare lesson title without
// the breadcrumb/Course schema the layout already emits).
export default function LessonPage() {
  return <LessonPageClient />;
}
