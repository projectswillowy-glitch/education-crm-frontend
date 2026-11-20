'use server';

import { NotificationType } from '@/types/models';
import { revalidatePath } from 'next/cache';
import { backendFetch } from '@/lib/api-client';

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType = NotificationType.GENERAL,
  link?: string
) {
  try {
    return { success: true };
  } catch (error) {
    console.error('Failed to create notification:', error);
    return { success: false, error };
  }
}

export async function getNotifications() {
  try {
    return await backendFetch('/api/v1/workflows/notification/getNotifications', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
}

export async function markAsRead(id: string) {
  try {
    const res = await backendFetch('/api/v1/workflows/notification/markAsRead', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });

    revalidatePath('/dashboard');
    return res;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return { success: false, error };
  }
}

export async function markAllAsRead() {
  try {
    const res = await backendFetch('/api/v1/workflows/notification/markAllAsRead', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    revalidatePath('/dashboard');
    return res;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return { success: false, error };
  }
}
