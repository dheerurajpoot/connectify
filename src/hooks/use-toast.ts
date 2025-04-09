import { useState, useCallback } from "react";

type ToastType = "default" | "success" | "error" | "destructive";

interface ToastOptions {
	title?: string;
	description?: string;
	type?: ToastType;
	duration?: number;
}

interface Toast extends ToastOptions {
	id: string;
	type: ToastType;
}

export function useToast() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const toast = useCallback(
		({
			title,
			description,
			type = "default",
			duration = 3000,
		}: ToastOptions) => {
			const id = Math.random().toString(36).substring(2, 9);
			const newToast: Toast = {
				id,
				title,
				description,
				type,
			};

			setToasts((prevToasts) => [...prevToasts, newToast]);

			if (duration > 0) {
				setTimeout(() => {
					setToasts((prevToasts) =>
						prevToasts.filter((toast) => toast.id !== id)
					);
				}, duration);
			}

			return id;
		},
		[]
	);

	const dismiss = useCallback((id: string) => {
		setToasts((prevToasts) =>
			prevToasts.filter((toast) => toast.id !== id)
		);
	}, []);

	return {
		toast,
		dismiss,
		toasts,
	};
}
