import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { OfflineStorage } from '@/lib/offline';
import { Diagnosis } from '@/lib/supabase';
import { AppHeader } from '@/components/ui/AppHeader';
import { tokens } from '@/constants/tokens';
import { CROP_IMAGES } from '@/lib/supabase';

interface HistoryItem {
  id: string;
  cropType: string;
  cropIcon: string;
  diagnosis: Diagnosis[];
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function HistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const diagnosisCache = await OfflineStorage.getDiagnosisCache();
    const pendingScans = await OfflineStorage.getPendingScans();

    const completedItems: HistoryItem[] = Object.entries(diagnosisCache).map(
      ([id, data]) => {
        const pending = pendingScans.find((s) => s.id === id);
        return {
          id,
          cropType: pending?.cropType || 'Crop',
          cropIcon: '', // Not used anymore
          diagnosis: data.diagnosis,
          createdAt: new Date(data.timestamp).toLocaleDateString(),
          status: 'completed' as const,
        };
      }
    );

    const pendingItems: HistoryItem[] = pendingScans.map((scan) => ({
      id: scan.id,
      cropType: scan.cropType,
      cropIcon: '', // Not used anymore
      diagnosis: [],
      createdAt: new Date(scan.timestamp).toLocaleDateString(),
      status: 'pending' as const,
    }));

    const allHistory = [...pendingItems, ...completedItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setHistory(allHistory);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'Mild':
        return colors.success;
      case 'Moderate':
        return colors.warning;
      case 'Severe':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const topDiagnosis = item.diagnosis[0];
    const severityColor = getSeverityColor(topDiagnosis?.severity);
    
    const getCardBackground = (severity?: string) => {
      const s = severity?.toLowerCase();
      if (s === 'severe') {
        return tokens.colors.error98;
      }
      return tokens.colors.neutral98;
    };

    const cardBg = getCardBackground(topDiagnosis?.severity);

    return (
      <TouchableOpacity
        style={[styles.historyCard, { backgroundColor: cardBg }]}
        onPress={() => {
          if (item.status === 'completed' && item.diagnosis.length > 0) {
            router.push({
              pathname: '/result',
              params: {
                diagnosis: JSON.stringify(item.diagnosis),
                cropType: item.cropType,
                image: '',
              },
            });
          }
        }}
        activeOpacity={item.status === 'completed' ? 0.7 : 1}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cropInfo}>
            <View style={[styles.imageContainer, { backgroundColor: tokens.colors.primary50 }]}>
              <Image 
                source={CROP_IMAGES[item.cropType.toLowerCase()] || { uri: 'https://via.placeholder.com/40' }} 
                style={styles.cropImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={[styles.cropName, { color: colors.text }]}>
                {item.cropType.charAt(0).toUpperCase() + item.cropType.slice(1)}
              </Text>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {item.createdAt}
              </Text>
            </View>
          </View>
          {item.status === 'pending' && (
            <View style={[styles.statusBadge, { backgroundColor: colors.warning + '20' }]}>
              <Text style={[styles.statusText, { color: colors.warning }]}>Pending</Text>
            </View>
          )}
          {item.status === 'completed' && topDiagnosis && (
            <View
              style={[styles.severityBadge, { backgroundColor: severityColor + '20' }]}
            >
              <Text style={[styles.severityText, { color: severityColor }]}>
                {topDiagnosis.severity}
              </Text>
            </View>
          )}
        </View>

        {item.status === 'completed' && topDiagnosis && (
          <View style={styles.diagnosisInfo}>
            <Text style={[styles.diagnosisName, { color: colors.text }]}>
              {topDiagnosis.name}
            </Text>
            <View style={styles.confidenceContainer}>
              <View
                style={[
                  styles.confidenceBar,
                  { backgroundColor: colors.textSecondary + '20' },
                ]}
              >
                <View
                  style={[
                    styles.confidenceFill,
                    {
                      backgroundColor: severityColor,
                      width: `${topDiagnosis.confidence}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.confidenceText, { color: colors.textSecondary }]}>
                {topDiagnosis.confidence}%
              </Text>
            </View>
          </View>
        )}

        {item.status === 'pending' && (
          <Text style={[styles.pendingText, { color: colors.textSecondary }]}>
            Awaiting connection to process...
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title={t('tabs.history')} showBack={false} />
      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No History Yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Your scan history will appear here after you analyze your first crop
          </Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/scan/camera')}
          >
            <Text style={styles.emptyButtonText}>{t('scan_leaf')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// getCropIcon removed in favor of centralized images

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  historyCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.md,
    marginRight: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  cropImage: {
    width: '100%',
    height: '100%',
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  diagnosisInfo: {
    marginTop: 4,
  },
  diagnosisName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
    width: 40,
  },
  pendingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
