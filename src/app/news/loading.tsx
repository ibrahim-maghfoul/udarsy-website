import NewsCardSkeleton from '@/components/NewsCardSkeleton';
import { Tag } from 'lucide-react';

const SKELETON_COUNT = 9;

export default function NewsLoading() {
    return (
        <div className="min-h-screen pt-8 md:pt-24 lg:pt-36 pb-32 px-[clamp(16px,5vw,48px)]">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Pill placeholder */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 text-green text-sm font-bold">
                        <Tag size={14} />
                        <span className="w-28 h-4 rounded bg-green/20 inline-block" />
                    </div>
                </div>

                {/* Category tabs placeholder */}
                <div className="flex items-center justify-center">
                    <div className="flex items-center bg-white rounded-[22px] p-1.5 shadow-lg shadow-black/[0.05] border border-green/10 gap-0.5">
                        {[80, 70, 90, 75].map((w, i) => (
                            <div
                                key={i}
                                className="news-shimmer rounded-[16px] h-10"
                                style={{ width: w }}
                            />
                        ))}
                    </div>
                </div>

                {/* Skeleton grid */}
                <div className="flex flex-wrap justify-center gap-8 gap-y-14 sm:gap-y-8">
                    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                        <NewsCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
