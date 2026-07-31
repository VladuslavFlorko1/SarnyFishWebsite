import EditLocationForm from "@/components/EditLocationForm/EditLocationForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLocationPage({ params }: PageProps) {
  const { id } = await params;
  return <EditLocationForm locationId={id} />;
}
