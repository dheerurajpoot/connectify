import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerificationRequests } from "@/components/admin/verification-requests";
import { VerifiedUsers } from "@/components/admin/verified-users";

export default function VerificationPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Verification Management
				</h1>
				<p className='text-muted-foreground'>
					Review and manage verification requests and verified
					accounts
				</p>
			</div>

			<Tabs defaultValue='requests'>
				<TabsList>
					<TabsTrigger value='requests'>Pending Requests</TabsTrigger>
					<TabsTrigger value='verified'>Verified Users</TabsTrigger>
				</TabsList>
				<TabsContent value='requests' className='mt-6'>
					<VerificationRequests />
				</TabsContent>
				<TabsContent value='verified' className='mt-6'>
					<VerifiedUsers />
				</TabsContent>
			</Tabs>
		</div>
	);
}
