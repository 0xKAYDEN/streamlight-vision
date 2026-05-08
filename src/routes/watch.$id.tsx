import { createFileRoute, Link } from "@tanstack/react-router";
import { VideoPlayer } from "@/components/video-player";
import { useTitle } from "@/lib/catalog-store";

export const Route = createFileRoute("/watch/$id")({
  component: WatchPage,
});

function WatchPage() {
  const { id } = Route.useParams();
  const title = useTitle(id);
  if (!title) {
    return (
      <div className="px-8 py-20 text-center">
        <h1 className="text-3xl font-semibold">Title not found</h1>
        <Link to="/browse" className="mt-4 inline-block text-brand hover:underline">
          Browse the catalog
        </Link>
      </div>
    );
  }
  return <VideoPlayer title={title} />;
}
