import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Admin Settings
				</h1>
				<p className='text-muted-foreground'>
					Manage platform settings and configurations
				</p>
			</div>

			<Tabs defaultValue='general'>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='general'>General</TabsTrigger>
					<TabsTrigger value='security'>Security</TabsTrigger>
					<TabsTrigger value='appearance'>Appearance</TabsTrigger>
					<TabsTrigger value='advanced'>Advanced</TabsTrigger>
				</TabsList>
				<TabsContent value='general' className='mt-6 space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>Platform Information</CardTitle>
							<CardDescription>
								Basic information about your platform
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid gap-2'>
								<Label htmlFor='platform-name'>
									Platform Name
								</Label>
								<Input
									id='platform-name'
									defaultValue='Connectify'
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='platform-description'>
									Platform Description
								</Label>
								<Textarea
									id='platform-description'
									defaultValue='Connect with friends and the world around you on Connectify.'
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='support-email'>
									Support Email
								</Label>
								<Input
									id='support-email'
									type='email'
									defaultValue='support@connectify.app'
								/>
							</div>
						</CardContent>
						<CardFooter>
							<Button>Save Changes</Button>
						</CardFooter>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Content Settings</CardTitle>
							<CardDescription>
								Configure content-related settings
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label htmlFor='content-moderation'>
										Content Moderation
									</Label>
									<p className='text-sm text-muted-foreground'>
										Automatically review content for policy
										violations
									</p>
								</div>
								<Switch
									id='content-moderation'
									defaultChecked
								/>
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label htmlFor='user-verification'>
										User Verification
									</Label>
									<p className='text-sm text-muted-foreground'>
										Require email verification before users
										can post content
									</p>
								</div>
								<Switch id='user-verification' defaultChecked />
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label htmlFor='comments'>Comments</Label>
									<p className='text-sm text-muted-foreground'>
										Allow users to comment on posts
									</p>
								</div>
								<Switch id='comments' defaultChecked />
							</div>
						</CardContent>
						<CardFooter>
							<Button>Save Changes</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value='security' className='mt-6 space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>Security Settings</CardTitle>
							<CardDescription>
								Configure security-related settings
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label htmlFor='two-factor'>
										Two-Factor Authentication
									</Label>
									<p className='text-sm text-muted-foreground'>
										Require two-factor authentication for
										admin accounts
									</p>
								</div>
								<Switch id='two-factor' defaultChecked />
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label htmlFor='login-attempts'>
										Failed Login Attempts
									</Label>
									<p className='text-sm text-muted-foreground'>
										Maximum number of failed login attempts
										before account lockout
									</p>
								</div>
								<Select defaultValue='5'>
									<SelectTrigger className='w-20'>
										<SelectValue placeholder='Select' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='3'>3</SelectItem>
										<SelectItem value='5'>5</SelectItem>
										<SelectItem value='10'>10</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label htmlFor='session-timeout'>
										Session Timeout
									</Label>
									<p className='text-sm text-muted-foreground'>
										Automatically log out admins after
										period of inactivity
									</p>
								</div>
								<Select defaultValue='30'>
									<SelectTrigger className='w-24'>
										<SelectValue placeholder='Select' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='15'>
											15 minutes
										</SelectItem>
										<SelectItem value='30'>
											30 minutes
										</SelectItem>
										<SelectItem value='60'>
											1 hour
										</SelectItem>
										<SelectItem value='120'>
											2 hours
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
						<CardFooter>
							<Button>Save Changes</Button>
						</CardFooter>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>API Access</CardTitle>
							<CardDescription>
								Manage API keys and access
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid gap-2'>
								<Label htmlFor='api-key'>API Key</Label>
								<div className='flex gap-2'>
									<Input
										id='api-key'
										defaultValue='sk_live_51NcGjQLkj2Ndk3MlJkl...'
										type='password'
									/>
									<Button variant='outline'>
										Regenerate
									</Button>
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label htmlFor='api-access'>
										API Access
									</Label>
									<p className='text-sm text-muted-foreground'>
										Enable API access for third-party
										integrations
									</p>
								</div>
								<Switch id='api-access' defaultChecked />
							</div>
						</CardContent>
						<CardFooter>
							<Button>Save Changes</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value='appearance' className='mt-6 space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>Theme Settings</CardTitle>
							<CardDescription>
								Customize the appearance of your platform
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid gap-2'>
								<Label>Theme Mode</Label>
								<div className='flex gap-4'>
									<div className='flex items-center space-x-2'>
										<input
											type='radio'
											id='light'
											name='theme'
											className='h-4 w-4'
											defaultChecked
										/>
										<Label htmlFor='light'>Light</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											type='radio'
											id='dark'
											name='theme'
											className='h-4 w-4'
										/>
										<Label htmlFor='dark'>Dark</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											type='radio'
											id='system'
											name='theme'
											className='h-4 w-4'
										/>
										<Label htmlFor='system'>System</Label>
									</div>
								</div>
							</div>
							<Separator />
							<div className='grid gap-2'>
								<Label>Primary Color</Label>
								<div className='flex gap-4'>
									{[
										"#0ea5e9",
										"#8b5cf6",
										"#10b981",
										"#f59e0b",
										"#ef4444",
									].map((color) => (
										<div
											key={color}
											className='h-8 w-8 cursor-pointer rounded-full border-2 border-muted'
											style={{ backgroundColor: color }}
										/>
									))}
								</div>
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label htmlFor='custom-css'>
										Custom CSS
									</Label>
									<p className='text-sm text-muted-foreground'>
										Apply custom CSS to your platform
									</p>
								</div>
								<Switch id='custom-css' />
							</div>
						</CardContent>
						<CardFooter>
							<Button>Save Changes</Button>
						</CardFooter>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Logo & Branding</CardTitle>
							<CardDescription>
								Customize your platform's branding
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid gap-2'>
								<Label>Logo</Label>
								<div className='flex items-center gap-4'>
									<div className='h-16 w-16 rounded-md border-2 border-dashed border-muted bg-muted flex items-center justify-center'>
										<span className='text-xs text-muted-foreground'>
											Logo
										</span>
									</div>
									<Button variant='outline'>
										Upload New
									</Button>
								</div>
							</div>
							<Separator />
							<div className='grid gap-2'>
								<Label>Favicon</Label>
								<div className='flex items-center gap-4'>
									<div className='h-8 w-8 rounded-md border-2 border-dashed border-muted bg-muted flex items-center justify-center'>
										<span className='text-xs text-muted-foreground'>
											Icon
										</span>
									</div>
									<Button variant='outline'>
										Upload New
									</Button>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button>Save Changes</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value='advanced' className='mt-6 space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>Advanced Settings</CardTitle>
							<CardDescription>
								Configure advanced platform settings
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label htmlFor='maintenance-mode'>
										Maintenance Mode
									</Label>
									<p className='text-sm text-muted-foreground'>
										Put the platform in maintenance mode
										(only admins can access)
									</p>
								</div>
								<Switch id='maintenance-mode' />
							</div>
							<Separator />
							<div className='flex items-center justify-between'>
								<div className='space-y-0.5'>
									<Label htmlFor='debug-mode'>
										Debug Mode
									</Label>
									<p className='text-sm text-muted-foreground'>
										Enable detailed error messages and
										logging
									</p>
								</div>
								<Switch id='debug-mode' />
							</div>
							<Separator />
							<div className='grid gap-2'>
								<Label htmlFor='cache-ttl'>
									Cache TTL (seconds)
								</Label>
								<Input
									id='cache-ttl'
									type='number'
									defaultValue='3600'
								/>
							</div>
						</CardContent>
						<CardFooter>
							<Button>Save Changes</Button>
						</CardFooter>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Database Management</CardTitle>
							<CardDescription>
								Manage database operations
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid gap-2'>
								<Button variant='outline'>
									Backup Database
								</Button>
							</div>
							<div className='grid gap-2'>
								<Button variant='outline'>Clear Cache</Button>
							</div>
							<div className='grid gap-2'>
								<Button variant='destructive'>
									Reset Database
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
