import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const DAILY_REMINDER_ID = 'nova-learn-daily-reminder';
const REMINDER_HOUR = 9;
const REMINDER_MINUTE = 0;

// Asks for permission, then schedules (or replaces) the once-a-day reminder.
// Returns false if the user declined the permission prompt.
export async function scheduleDailyReminder() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return false;

  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'Your tiny lesson is ready 🔭',
      body: "Today's science fact is waiting. Keep your streak going!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: REMINDER_HOUR,
      minute: REMINDER_MINUTE,
    },
  });
  return true;
}

export async function cancelDailyReminder() {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => {});
}
