import UserProfilePage from "@/components/UserProfilePage/UserProfilePage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;
  return <UserProfilePage userId={id} />;
}
