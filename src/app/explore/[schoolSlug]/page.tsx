"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Redirect() {
    const params = useParams();
    const router = useRouter();
    useEffect(() => {
        router.replace(`/courses/${params.schoolSlug}`);
    }, [params.schoolSlug, router]);
    return null;
}
