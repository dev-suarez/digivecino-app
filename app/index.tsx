import { Redirect } from 'expo-router';

// Redirect to the home tab screen
export default function Index() {
  return <Redirect href="/(tabs)" />;
}