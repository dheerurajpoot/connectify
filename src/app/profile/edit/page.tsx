import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditProfileForm from "./EditProfileForm";
import { getUserById } from "@/lib/db";
import { IUser } from "@/models";

export default async function EditProfilePage() {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		redirect("/auth/login");
	}

	const userDoc = (await getUserById(session.user.id)) as IUser & {
		_id: { toString: () => string };
	};
	if (!userDoc) {
		redirect("/auth/login");
	}

	// Convert MongoDB document to plain object
	const user = {
		_id: userDoc._id.toString(),
		name: userDoc.name,
		email: userDoc.email,
		username: userDoc.username,
		bio: userDoc.bio,
		location: userDoc.location,
		website: userDoc.website,
		avatar: userDoc.avatar,
	};

	return (
		<div className='container max-w-2xl py-8 mx-auto'>
			<h1 className='text-2xl font-bold mb-6'>Edit Profile</h1>
			<EditProfileForm user={user} />
		</div>
	);
}
