import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { logger } from '../lib/logger';
import { supabase, userService } from '../lib/supabase';

export default function Settings() {
	const { user, loading } = useAuth();
	const { isDarkMode, toggleDarkMode } = useDarkMode();

	const [displayName, setDisplayName] = useState('');
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [emailNotifications, setEmailNotifications] = useState(false);

	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [displayNameAvailable, setDisplayNameAvailable] = useState<boolean | null>(null);

	useEffect(() => {
		if (!user) return;
		setDisplayName(user.user_metadata?.display_name ?? '');
		setFullName(user.user_metadata?.full_name ?? '');
		setEmail(user.email ?? '');
		const notif = user.user_metadata?.email_notifications;
		setEmailNotifications(notif === true || notif === 'true');
	}, [user]);

	const checkDisplayName = async (name: string) => {
		if (!user) return;
		if (!name || name === user.user_metadata?.display_name) {
			setDisplayNameAvailable(null);
			return;
		}
		try {
			const ok = await userService.checkDisplayNameAvailability(name, user.id);
			setDisplayNameAvailable(ok);
		} catch (err: any) {
			logger.error('checkDisplayName failed', err);
			setDisplayNameAvailable(null);
		}
	};

	const saveProfile = async () => {
		if (!user) return;
		setSaving(true);
		setMessage(null);
		setError(null);

		try {
			// If display name changed, use the helper which checks availability and updates both auth metadata and users table
			if (displayName && displayName !== user.user_metadata?.display_name) {
				await userService.updateDisplayName(user.id, displayName);
			}

			// Update other metadata (full name, email_notifications)
			const metadataUpdate: Record<string, any> = {};
			if (fullName && fullName !== user.user_metadata?.full_name) metadataUpdate.full_name = fullName;
			metadataUpdate.email_notifications = emailNotifications ? 'true' : 'false';

			if (Object.keys(metadataUpdate).length > 0) {
				const { error: metaErr } = await supabase.auth.updateUser({ data: metadataUpdate });
				if (metaErr) throw metaErr;

				// Keep a lightweight users table in sync (upsert)
			const { error: upsertErr } = await supabase.from('users').upsert({ id: user.id, full_name: fullName, email_notifications: emailNotifications });
				if (upsertErr) throw upsertErr;
			}

			// Email change (handled separately to allow confirmation flows)
			if (email && email !== user.email) {
				const { error: emailErr } = await supabase.auth.updateUser({ email });
				if (emailErr) throw emailErr;
			}

			// Password change
			if (newPassword) {
				const { error: pwErr } = await supabase.auth.updateUser({ password: newPassword });
				if (pwErr) throw pwErr;
			}

			setMessage('Profile updated successfully.');
		} catch (err: any) {
			logger.error('Failed to save profile', err);
			setError(err.message || String(err));
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return <div className="p-6">Loading...</div>;
	}

	if (!user) {
		return (
			<div className="p-6">
				<h2 className="text-xl font-semibold mb-2">Settings</h2>
				<p className="text-sm text-gray-600">Please sign in to edit your settings.</p>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-3xl">
			<h1 className="text-2xl font-bold mb-4">Settings</h1>

			{message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>}
			{error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

			<section className="mb-6">
				<h3 className="font-medium mb-2">Profile</h3>
				<label className="block mb-2">
					<div className="text-sm text-gray-700">Display name</div>
					<input
						value={displayName}
						onChange={(e) => { setDisplayName(e.target.value); setDisplayNameAvailable(null); }}
						onBlur={() => checkDisplayName(displayName)}
						className="mt-1 w-full rounded border px-3 py-2"
					/>
					{displayNameAvailable === false && (
						<div className="text-red-600 text-sm mt-1">That display name is already taken.</div>
					)}
					{displayNameAvailable === true && (
						<div className="text-green-600 text-sm mt-1">Display name is available.</div>
					)}
				</label>

				<label className="block mb-2">
					<div className="text-sm text-gray-700">Full name</div>
					<input
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						className="mt-1 w-full rounded border px-3 py-2"
					/>
				</label>
			</section>

			<section className="mb-6">
				<h3 className="font-medium mb-2">Account</h3>
				<label className="block mb-2">
					<div className="text-sm text-gray-700">Email</div>
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="mt-1 w-full rounded border px-3 py-2"
					/>
					<div className="text-xs text-gray-500 mt-1">Changing your email may require confirmation.</div>
				</label>

				<label className="block mb-2">
					<div className="text-sm text-gray-700">New password</div>
					<input
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className="mt-1 w-full rounded border px-3 py-2"
					/>
					<div className="text-xs text-gray-500 mt-1">Leave blank to keep your current password.</div>
				</label>
			</section>

			<section className="mb-6">
				<h3 className="font-medium mb-2">Preferences</h3>
				<label className="flex items-center space-x-3 mb-3">
					<input
						type="checkbox"
						checked={emailNotifications}
						onChange={(e) => setEmailNotifications(e.target.checked)}
						className="h-4 w-4"
					/>
					<span className="text-sm">Receive email notifications</span>
				</label>

				<label className="flex items-center justify-between bg-gray-50 p-3 rounded">
					<div>
						<div className="text-sm font-medium">Appearance</div>
						<div className="text-xs text-gray-500">Toggle dark mode for the editor and UI.</div>
					</div>
					<button
						onClick={toggleDarkMode}
						className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
						aria-pressed={isDarkMode}
					>
						{isDarkMode ? 'Dark' : 'Light'}
					</button>
				</label>
			</section>

			<div className="flex items-center space-x-3">
				<button
					className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
					onClick={saveProfile}
					disabled={saving || displayNameAvailable === false}
				>
					{saving ? 'Saving...' : 'Save changes'}
				</button>
				<button
					className="px-4 py-2 border rounded"
					onClick={() => {
						// reset to current user values
						setDisplayName(user.user_metadata?.display_name ?? '');
						setFullName(user.user_metadata?.full_name ?? '');
						setEmail(user.email ?? '');
						setNewPassword('');
						setEmailNotifications(user.user_metadata?.email_notifications === 'true' || user.user_metadata?.email_notifications === true);
						setMessage(null);
						setError(null);
					}}
				>
					Reset
				</button>
			</div>
		</div>
	);
}