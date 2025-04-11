"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function AdminCreateNotification() {
	const [notificationType, setNotificationType] = useState("announcement");
	const [deliveryType, setDeliveryType] = useState("immediate");
	const [date, setDate] = useState<Date>();

	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<Label htmlFor='title'>Notification Title</Label>
				<Input id='title' placeholder='Enter notification title' />
			</div>

			<div className='space-y-2'>
				<Label htmlFor='content'>Notification Content</Label>
				<Textarea
					id='content'
					placeholder='Enter notification content'
					rows={4}
				/>
			</div>

			<div className='space-y-2'>
				<Label>Notification Type</Label>
				<RadioGroup
					defaultValue='announcement'
					value={notificationType}
					onValueChange={setNotificationType}>
					<div className='flex flex-col space-y-2'>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem
								value='announcement'
								id='announcement'
							/>
							<Label htmlFor='announcement'>Announcement</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem value='update' id='update' />
							<Label htmlFor='update'>Feature Update</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem value='alert' id='alert' />
							<Label htmlFor='alert'>Alert</Label>
						</div>
					</div>
				</RadioGroup>
			</div>

			<div className='space-y-2'>
				<Label>Recipients</Label>
				<Select defaultValue='all'>
					<SelectTrigger>
						<SelectValue placeholder='Select recipients' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Users</SelectItem>
						<SelectItem value='active'>Active Users</SelectItem>
						<SelectItem value='new'>
							New Users (last 30 days)
						</SelectItem>
						<SelectItem value='inactive'>Inactive Users</SelectItem>
						<SelectItem value='verified'>Verified Users</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className='space-y-2'>
				<Label>Delivery</Label>
				<RadioGroup
					defaultValue='immediate'
					value={deliveryType}
					onValueChange={setDeliveryType}>
					<div className='flex flex-col space-y-2'>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem value='immediate' id='immediate' />
							<Label htmlFor='immediate'>Send Immediately</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem value='scheduled' id='scheduled' />
							<Label htmlFor='scheduled'>
								Schedule for Later
							</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<RadioGroupItem value='draft' id='draft' />
							<Label htmlFor='draft'>Save as Draft</Label>
						</div>
					</div>
				</RadioGroup>
			</div>

			{deliveryType === "scheduled" && (
				<div className='space-y-2'>
					<Label>Schedule Date and Time</Label>
					<div className='flex gap-2'>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant='outline'
									className='w-full justify-start text-left font-normal'>
									<CalendarIcon className='mr-2 h-4 w-4' />
									{date ? (
										format(date, "PPP")
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0'>
								<Calendar
									mode='single'
									selected={date}
									onSelect={setDate}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						<Select defaultValue='12'>
							<SelectTrigger className='w-24'>
								<SelectValue placeholder='Time' />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: 24 }).map((_, i) => (
									<SelectItem key={i} value={i.toString()}>
										{i.toString().padStart(2, "0")}:00
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			)}

			<div className='flex gap-2'>
				<Button variant='outline'>Cancel</Button>
				<Button>
					{deliveryType === "immediate"
						? "Send Notification"
						: deliveryType === "scheduled"
						? "Schedule Notification"
						: "Save Draft"}
				</Button>
			</div>
		</div>
	);
}
