import { SignupForm } from "@/components/signup-form";

export default function RegisterPage() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<div className='max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Create your account
					</h2>
				</div>
				<SignupForm />
			</div>
		</div>
	);
}
