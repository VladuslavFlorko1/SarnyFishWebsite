import LocationDetail from "@/components/LocationDetail/LocationDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LocationPage({ params }: PageProps) {
  const { id } = await params;
  return <LocationDetail locationId={id} />;
}
