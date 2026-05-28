import { VerifyRequired } from "@/components/VerifyRequired";

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return <VerifyRequired>{children}</VerifyRequired>;
}
