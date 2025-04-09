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
import { loginUser } from "@/app/actions/auth-actions";
import { useToast } from "../hooks/use-toast";
import { useForm } from "react-hook-form";

export function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			remember: false,
		},
	});

	const onSubmit = async (values: any) => {
		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("email", values.email);
			formData.append("password", values.password);
			formData.append("remember", values.remember ? "true" : "false");

			const result = await loginUser(formData);

			if (result?.error) {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			}
		} catch (error) {
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
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type='email'
									placeholder='Enter your email'
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
									placeholder='Enter your password'
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-2'>
						<FormField
							control={form.control}
							name='remember'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<label
										htmlFor='remember'
										className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
										Remember me
									</label>
								</FormItem>
							)}
						/>
					</div>
					<a
						href='/auth/reset-password'
						className='text-sm font-medium underline'>
						Forgot password?
					</a>
				</div>
				<Button type='submit' className='w-full' disabled={isLoading}>
					{isLoading ? "Logging in..." : "Log in"}
				</Button>
			</form>
		</Form>
	);
}
