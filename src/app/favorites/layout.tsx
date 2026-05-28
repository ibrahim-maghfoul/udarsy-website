import { VerifyRequired } from "@/components/VerifyRequired";

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return <VerifyRequired>{children}</VerifyRequired>;
}
