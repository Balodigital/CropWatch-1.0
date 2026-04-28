import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
  imageBase64?: string;
  description?: string;
  diagnosis: Diagnosis[];
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function PendingScansScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPendingScans = async () => {
    const pendingScans = await OfflineStorage.getPendingScans();

    const pendingItems: HistoryItem[] = pendingScans.map((scan) => ({
      id: scan.id,
      cropType: scan.cropType,
      cropIcon: '', // Not used anymore
      imageBase64: scan.imageBase64,
      description: scan.description,
      diagnosis: [],
      createdAt: new Date(scan.timestamp).toLocaleDateString(),
      status: 'pending' as const,
    }));

    const allHistory = pendingItems.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setHistory(allHistory);
  };

  useFocusEffect(
    useCallback(() => {
      loadPendingScans();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingScans();
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

  const handleDelete = (item: HistoryItem) => {
    Alert.alert(
      t('common.delete') || 'Delete',
      t('history.delete_confirm') || 'Are you sure you want to delete this scan?',
      [
        { text: t('common.cancel') || 'Cancel', style: 'cancel' },
        { 
          text: t('common.delete') || 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await OfflineStorage.removePendingScan(item.id);
            loadPendingScans();
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    return (
      <View style={[styles.historyCard, { backgroundColor: tokens.colors.neutral98 }]}>
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => {
            if (item.status === 'pending') {
              router.push({
                pathname: '/scan/analyzing',
                params: {
                  image: item.imageBase64,
                  cropType: item.cropType,
                  description: item.description,
                  pendingId: item.id,
                },
              });
            }
          }}
          activeOpacity={0.7}
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
          <View style={styles.rightActions}>
            <View style={[styles.statusBadge, { backgroundColor: colors.warning + '20' }]}>
              <Text style={[styles.statusText, { color: colors.warning }]}>Pending</Text>
            </View>
            <View style={{ width: 28 }} />
          </View>
        </View>

        <Text style={[styles.pendingText, { color: colors.textSecondary }]}>
          Awaiting connection to process...
        </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => handleDelete(item)} 
          style={styles.deleteButtonAbsolute}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <MaterialIcons name="delete-outline" size={20} color={tokens.colors.error500} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Pending Scans" showBack={true} />
      
      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>☁️</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Pending Scans
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            You have successfully synced all your scans.
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
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTouchable: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButtonAbsolute: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 10,
    elevation: 10,
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
