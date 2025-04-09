"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { registerUser } from "@/app/actions/auth-actions";
import { useToast } from "../hooks/use-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export function SignupForm() {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			username: "",
			email: "",
			password: "",
			terms: false,
		},
	});

	const onSubmit = async (values: any) => {
		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("firstName", values.firstName);
			formData.append("lastName", values.lastName);
			formData.append("username", values.username);
			formData.append("email", values.email);
			formData.append("password", values.password);
			formData.append("terms", values.terms ? "true" : "false");

			const result = await registerUser(formData);

			if (result?.error) {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			}
			toast({
				title: "Success",
				description: "Account created successfully",
			});
			router.push("/auth/login");
		} catch (error) {
			console.log("error", error);
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<div className='grid grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='firstName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input
										placeholder='John'
										required
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='lastName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input
										placeholder='Doe'
										required
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									placeholder='johndoe'
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type='email'
									placeholder='john.doe@example.com'
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Create a password'
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='flex items-center space-x-2'>
					<FormField
						control={form.control}
						name='terms'
						render={({ field }) => (
							<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										required
									/>
								</FormControl>
								<label
									htmlFor='terms'
									className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
									I agree to the{" "}
									<a href='/terms' className='underline'>
										Terms of Service
									</a>{" "}
									and{" "}
									<a href='/privacy' className='underline'>
										Privacy Policy
									</a>
								</label>
							</FormItem>
						)}
					/>
				</div>
				<Button type='submit' className='w-full' disabled={isLoading}>
					{isLoading ? "Creating account..." : "Create account"}
				</Button>
			</form>
		</Form>
	);
}
