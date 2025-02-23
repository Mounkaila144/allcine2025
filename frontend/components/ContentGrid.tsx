// src/components/ContentGrid.tsx

import { Content } from "@/lib/redux/api/contentsApi";
import ContentCard from "./ContentCard";

interface ContentGridProps {
    sortedContents: Content[];
    onOpenModal: (content: Content) => void;
    showLikes?: boolean;
}

const ContentGrid = ({
                         sortedContents,
                         onOpenModal,
                         showLikes = false
                     }: ContentGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {sortedContents.map((item) => (
                <ContentCard
                    key={item.id}
                    item={item}
                    onOpenModal={onOpenModal}
                    showLikes={showLikes}
                />
            ))}
        </div>
    );
};

export default ContentGrid;