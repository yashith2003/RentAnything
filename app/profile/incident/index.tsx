import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { TabSwitcher } from '@/components/shared/TabSwitcher';
import { Spacing, getTailwindSpacing } from '@/constants/spacing';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IncidentRequestContent from './incidentRequest';
import MyIncidentContent from './myIncident';

export default function IncidentMainScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Incident Requests');

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <StatusBar style="dark" />

      <ScreenHeader title="Incident" containerStyle="mb-2" />

      <TabSwitcher 
        tabs={['Incident Requests', 'My Incidents']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        containerStyle={`px-${getTailwindSpacing(Spacing.pageHorizontal)} mb-6`}
      />

      <View className={`flex-1 px-${getTailwindSpacing(Spacing.pageHorizontal)}`}>
           {activeTab === 'Incident Requests' ? <IncidentRequestContent /> : <MyIncidentContent />}
      </View>
    </SafeAreaView>
  );
}
