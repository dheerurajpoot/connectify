import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditProfileForm from "./EditProfileForm";

export default async function EditProfilePage() {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		redirect("/auth/login");
	}

	return (
		<div className='container max-w-2xl py-8 mx-auto'>
			<h1 className='text-2xl font-bold mb-6'>Edit Profile</h1>
			<EditProfileForm user={session.user} />
		</div>
	);
}
