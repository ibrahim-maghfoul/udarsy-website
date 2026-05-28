"use client";

import Link from "next/link";
import "./hero.css";
import ArticlesGuides from "./ArticlesGuides";

export default function DesignLab() {
  return (
    <main className="lab-root">
      <div className="lab-chip">
        <span className="lab-chip__label">Design Lab</span>
        <span className="lab-chip__sep" />
        <Link href="/" className="lab-chip__link">
          ← site
        </Link>
      </div>

      <ArticlesGuides />
    </main>
  );
}