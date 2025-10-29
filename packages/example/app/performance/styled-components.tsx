import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from 'react-native';
import {
  KStyledComponents,
  StyledComponents,
  generateCardData,
  generateStaticCards,
  type CardData,
  type StaticCardData,
} from '../../src/components';

// Declare performance API for React Native
declare const performance: {
  now(): number;
};

// Statistical analysis functions
const median = (arr: number[]) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

const mean = (arr: number[]) => {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

const stdDev = (arr: number[]) => {
  const avg = mean(arr);
  const squareDiffs = arr.map((val) => Math.pow(val - avg, 2));
  const avgSquareDiff = mean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};

const percentile = (arr: number[], p: number) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (lower === upper) return sorted[lower];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

type BenchmarkStats = {
  median: number;
  mean: number;
  min: number;
  max: number;
  p95: number;
  stdDev: number;
  rawData: number[];
};

type BenchmarkResults = {
  kstyled: BenchmarkStats;
  styledComponents: BenchmarkStats;
  iterations: number;
  warmups: number;
};

export default function StyledComponentsScreen() {
  // Separate states for left (kstyled) and right (styled-components)
  const [leftCards, setLeftCards] = useState<CardData[]>([]);
  const [leftStaticCards, setLeftStaticCards] = useState<StaticCardData[]>([]);
  const [rightCards, setRightCards] = useState<CardData[]>([]);
  const [rightStaticCards, setRightStaticCards] = useState<StaticCardData[]>([]);

  const [benchmarkType, setBenchmarkType] = useState<'static' | 'dynamic' | 'theme'>('dynamic');

  // Professional benchmark states
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [benchmarking, setBenchmarking] = useState(false);
  const [benchmarkProgress, setBenchmarkProgress] = useState('');
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResults | null>(null);

  const runProfessionalBenchmark = useCallback(async () => {
    const WARMUPS = 3;
    const ITERATIONS = 10;
    const CARD_COUNT = 50;

    setBenchmarking(true);
    setBenchmarkResults(null);
    setShowBenchmark(true);

    const kstyledTimes: number[] = [];
    const scTimes: number[] = [];

    try {
      // Phase 1: Warm-up (discard results)
      setBenchmarkProgress(`Warming up (0/${WARMUPS})...`);
      for (let i = 0; i < WARMUPS; i++) {
        setBenchmarkProgress(`Warming up (${i + 1}/${WARMUPS})...`);

        // Clear
        setLeftCards([]);
        setLeftStaticCards([]);
        setRightCards([]);
        setRightStaticCards([]);
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 200));

        // Generate and render (discard timing)
        const data =
          benchmarkType === 'static' ? generateStaticCards(CARD_COUNT) : generateCardData(CARD_COUNT);
        if (benchmarkType === 'static') {
          setLeftStaticCards(data as StaticCardData[]);
          setRightStaticCards(data as StaticCardData[]);
        } else {
          setLeftCards(data as CardData[]);
          setRightCards(data as CardData[]);
        }
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
      }

      // Phase 2: Actual measurements with order randomization
      for (let i = 0; i < ITERATIONS; i++) {
        setBenchmarkProgress(`Iteration ${i + 1}/${ITERATIONS}...`);

        // Randomize order
        const testOrder = Math.random() > 0.5 ? ['kstyled', 'sc'] : ['sc', 'kstyled'];

        for (const library of testOrder) {
          // Clear all
          setLeftCards([]);
          setLeftStaticCards([]);
          setRightCards([]);
          setRightStaticCards([]);
          await new Promise<void>((resolve) => setTimeout(() => resolve(), 200));

          const data =
            benchmarkType === 'static'
              ? generateStaticCards(CARD_COUNT)
              : generateCardData(CARD_COUNT);

          const startTime = performance.now();

          if (library === 'kstyled') {
            if (benchmarkType === 'static') {
              setLeftStaticCards(data as StaticCardData[]);
            } else {
              setLeftCards(data as CardData[]);
            }
          } else {
            if (benchmarkType === 'static') {
              setRightStaticCards(data as StaticCardData[]);
            } else {
              setRightCards(data as CardData[]);
            }
          }

          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );

          const endTime = performance.now();
          const renderTime = endTime - startTime;

          if (library === 'kstyled') {
            kstyledTimes.push(renderTime);
          } else {
            scTimes.push(renderTime);
          }
        }
      }

      // Phase 3: Calculate statistics
      const results: BenchmarkResults = {
        kstyled: {
          median: median(kstyledTimes),
          mean: mean(kstyledTimes),
          min: Math.min(...kstyledTimes),
          max: Math.max(...kstyledTimes),
          p95: percentile(kstyledTimes, 95),
          stdDev: stdDev(kstyledTimes),
          rawData: kstyledTimes,
        },
        styledComponents: {
          median: median(scTimes),
          mean: mean(scTimes),
          min: Math.min(...scTimes),
          max: Math.max(...scTimes),
          p95: percentile(scTimes, 95),
          stdDev: stdDev(scTimes),
          rawData: scTimes,
        },
        iterations: ITERATIONS,
        warmups: WARMUPS,
      };

      setBenchmarkResults(results);
    } catch (error) {
      console.error('Benchmark error:', error);
    } finally {
      setBenchmarking(false);
      setBenchmarkProgress('');
    }
  }, [benchmarkType]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>kstyled vs styled-components</Text>
          <Text style={styles.subtitle}>
            Compare kstyled (compile-time) with styled-components (runtime)
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Professional Benchmark</Text>
          <Text style={styles.cardDescription}>
            Click "Run Professional Benchmark" below to start{'\n'}
            comprehensive performance testing with{'\n'}
            statistical analysis
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Benchmark Type</Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.typeButton, benchmarkType === 'static' && styles.typeButtonActive]}
              onPress={() => setBenchmarkType('static')}
            >
              <Text style={[styles.typeButtonText, benchmarkType === 'static' && styles.typeButtonTextActive]}>
                Static - 50 Cards
              </Text>
            </Pressable>
            <Pressable
              style={[styles.typeButton, benchmarkType === 'dynamic' && styles.typeButtonActive]}
              onPress={() => setBenchmarkType('dynamic')}
            >
              <Text style={[styles.typeButtonText, benchmarkType === 'dynamic' && styles.typeButtonTextActive]}>
                Dynamic - 50 Cards
              </Text>
            </Pressable>
            <Pressable
              style={[styles.typeButton, benchmarkType === 'theme' && styles.typeButtonActive]}
              onPress={() => setBenchmarkType('theme')}
            >
              <Text style={[styles.typeButtonText, benchmarkType === 'theme' && styles.typeButtonTextActive]}>
                Theme - 50 Cards
              </Text>
            </Pressable>
          </View>
          <Text style={styles.typeDescription}>
            {benchmarkType === 'static' && '✓ Pure static styles - measures render overhead'}
            {benchmarkType === 'dynamic' && '✓ Complex dynamic props - real-world performance'}
            {benchmarkType === 'theme' && '✓ Theme changes and re-rendering'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={runProfessionalBenchmark}>
            <Text style={styles.buttonText}>🔬 Run Professional Benchmark</Text>
          </Pressable>
          <Text style={styles.buttonSubtext}>
            • 3 warm-ups + 10 iterations per library{'\n'}
            • Order randomized to avoid bias{'\n'}
            • Statistical analysis (Median, Mean, P95, StdDev)
          </Text>
        </View>

        {/* Split View - Left and Right */}
        <View style={styles.splitView}>
          {/* Left: kstyled */}
          <View style={styles.column}>
            <View style={styles.columnHeaderLeft}>
              <Text style={styles.columnHeaderText}>kstyled (Compiled)</Text>
            </View>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {benchmarkType === 'static'
                ? leftStaticCards.map((card) => (
                    <KStyledComponents.StaticCardRenderer key={card.id} data={card} />
                  ))
                : leftCards.map((card, index) => (
                    <KStyledComponents.DynamicCard key={card.id} data={card} index={index} />
                  ))}
            </ScrollView>
          </View>

          {/* Right: styled-components */}
          <View style={styles.column}>
            <View style={styles.columnHeaderRight}>
              <Text style={styles.columnHeaderText}>styled-components</Text>
            </View>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {benchmarkType === 'static'
                ? rightStaticCards.map((card) => (
                    <StyledComponents.StaticCardRenderer key={card.id} data={card} />
                  ))
                : rightCards.map((card, index) => (
                    <StyledComponents.DynamicCard key={card.id} data={card} index={index} />
                  ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Professional Benchmark Results Modal */}
      <Modal
        visible={showBenchmark}
        transparent
        animationType="none"
        onRequestClose={() => !benchmarking && setShowBenchmark(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => !benchmarking && setShowBenchmark(false)}>
          <View
            onStartShouldSetResponder={() => true}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>🔬 Professional Benchmark Results</Text>
            <Text style={styles.modalDescription}>
              {benchmarkType.charAt(0).toUpperCase() + benchmarkType.slice(1)} benchmark • 50 cards
            </Text>
            {benchmarkResults && (
              <Text
                style={[
                  styles.modalPercentage,
                  {
                    color:
                      benchmarkResults.kstyled.median < benchmarkResults.styledComponents.median
                        ? '#007AFF'
                        : '#E91E63',
                  },
                ]}
              >
                kstyled is{' '}
                {Math.abs(
                  ((benchmarkResults.kstyled.median - benchmarkResults.styledComponents.median) /
                    benchmarkResults.styledComponents.median) *
                    100,
                ).toFixed(1)}
                %{' '}
                {benchmarkResults.kstyled.median < benchmarkResults.styledComponents.median
                  ? 'faster'
                  : 'slower'}
              </Text>
            )}

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.modalScrollContent}
            >
              {benchmarking ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.loadingText}>{benchmarkProgress || 'Running benchmark...'}</Text>
                  <Text style={styles.loadingSubtext}>
                    Warmup → Randomized iterations → Statistics
                  </Text>
                </View>
              ) : benchmarkResults ? (
                <>
                  {/* Summary */}
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryTitle}>📊 Test Configuration</Text>
                    <Text style={styles.summaryText}>
                      • Warm-ups: {benchmarkResults.warmups} iterations (discarded)
                    </Text>
                    <Text style={styles.summaryText}>
                      • Measurements: {benchmarkResults.iterations} iterations per library
                    </Text>
                    <Text style={styles.summaryText}>• Order: Randomized each iteration</Text>
                  </View>

                  {/* kstyled Statistics */}
                  <View style={styles.statsSection}>
                    <Text style={styles.statsTitle}>kstyled (Compiled)</Text>
                    <View style={styles.statsBox}>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Median:</Text>
                        <Text style={styles.statValue}>{benchmarkResults.kstyled.median.toFixed(2)}ms</Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Mean (Average):</Text>
                        <Text style={styles.statValue}>{benchmarkResults.kstyled.mean.toFixed(2)}ms</Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Min / Max:</Text>
                        <Text style={styles.statValue}>
                          {benchmarkResults.kstyled.min.toFixed(2)}ms /{' '}
                          {benchmarkResults.kstyled.max.toFixed(2)}ms
                        </Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>P95 (95th percentile):</Text>
                        <Text style={styles.statValue}>{benchmarkResults.kstyled.p95.toFixed(2)}ms</Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Std Deviation:</Text>
                        <Text style={styles.statValue}>±{benchmarkResults.kstyled.stdDev.toFixed(2)}ms</Text>
                      </View>
                    </View>
                  </View>

                  {/* styled-components Statistics */}
                  <View style={styles.statsSection}>
                    <Text style={[styles.statsTitle, { color: '#E91E63' }]}>styled-components</Text>
                    <View style={[styles.statsBox, { backgroundColor: '#FFF0F5' }]}>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Median:</Text>
                        <Text style={styles.statValue}>
                          {benchmarkResults.styledComponents.median.toFixed(2)}ms
                        </Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Mean (Average):</Text>
                        <Text style={styles.statValue}>
                          {benchmarkResults.styledComponents.mean.toFixed(2)}ms
                        </Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Min / Max:</Text>
                        <Text style={styles.statValue}>
                          {benchmarkResults.styledComponents.min.toFixed(2)}ms /{' '}
                          {benchmarkResults.styledComponents.max.toFixed(2)}ms
                        </Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>P95 (95th percentile):</Text>
                        <Text style={styles.statValue}>
                          {benchmarkResults.styledComponents.p95.toFixed(2)}ms
                        </Text>
                      </View>
                      <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Std Deviation:</Text>
                        <Text style={styles.statValue}>
                          ±{benchmarkResults.styledComponents.stdDev.toFixed(2)}ms
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Winner */}
                  <View
                    style={[
                      styles.winnerBox,
                      {
                        backgroundColor:
                          benchmarkResults.kstyled.median < benchmarkResults.styledComponents.median
                            ? '#E8F5E9'
                            : '#FFF3E0',
                      },
                    ]}
                  >
                    <Text style={styles.winnerLabel}>🏆 Winner</Text>
                    <Text
                      style={[
                        styles.winnerName,
                        {
                          color:
                            benchmarkResults.kstyled.median < benchmarkResults.styledComponents.median
                              ? '#007AFF'
                              : '#E91E63',
                        },
                      ]}
                    >
                      {benchmarkResults.kstyled.median < benchmarkResults.styledComponents.median
                        ? 'kstyled (Compiled)'
                        : 'styled-components'}
                    </Text>
                    <Text style={styles.winnerPercentage}>
                      {Math.abs(
                        ((benchmarkResults.kstyled.median - benchmarkResults.styledComponents.median) /
                          benchmarkResults.styledComponents.median) *
                          100,
                      ).toFixed(1)}
                      % faster
                    </Text>
                    <Text style={styles.winnerDifference}>
                      (
                      {Math.abs(
                        benchmarkResults.kstyled.median - benchmarkResults.styledComponents.median,
                      ).toFixed(2)}
                      ms difference)
                    </Text>
                  </View>

                  {/* Interpretation */}
                  <View style={styles.interpretationBox}>
                    <Text style={styles.interpretationTitle}>📖 How to Read Results</Text>
                    <Text style={styles.interpretationText}>
                      • <Text style={styles.interpretationBold}>Median</Text>: Middle value (most reliable)
                    </Text>
                    <Text style={styles.interpretationText}>
                      • <Text style={styles.interpretationBold}>Mean</Text>: Average of all measurements
                    </Text>
                    <Text style={styles.interpretationText}>
                      • <Text style={styles.interpretationBold}>P95</Text>: 95% of measurements were faster
                    </Text>
                    <Text style={styles.interpretationText}>
                      • <Text style={styles.interpretationBold}>Std Dev</Text>: Consistency (lower = more
                      stable)
                    </Text>
                  </View>

                  <View style={styles.modalButtonContainer}>
                    <Pressable style={styles.modalButton} onPress={() => setShowBenchmark(false)}>
                      <Text style={styles.modalButtonText}>Close</Text>
                    </Pressable>
                  </View>
                </>
              ) : null}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#C6C6C8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  typeDescription: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  button: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  splitView: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
  },
  column: {
    flex: 1,
  },
  columnHeaderLeft: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  columnHeaderRight: {
    backgroundColor: '#E91E63',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  columnHeaderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: 340,
    height: 600,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  modalPercentage: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 12,
  },
  loadingSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
  },
  summaryBox: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  statsBox: {
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  winnerBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  winnerLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  winnerName: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  winnerPercentage: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
  winnerDifference: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  interpretationBox: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  interpretationTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  interpretationText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },
  interpretationBold: {
    fontWeight: '600',
  },
  modalButtonContainer: {
    marginTop: 24,
  },
  modalButton: {
    padding: 14,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
