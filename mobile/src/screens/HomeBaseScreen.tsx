import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BoomBeachIslandView from '../components/BoomBeachIslandView';
import BoomBeachResourceBar from '../components/BoomBeachResourceBar';
import BoomBeachTopHUD from '../components/BoomBeachTopHUD';
import BuildMenuModal from '../components/BuildMenuModal';
import BuildingRenderer, { MEADOW_COLS, MEADOW_ROWS } from '../components/BuildingRenderer';
import { BUILDING_CATALOG, type BuildingSpec } from '../config/buildings';
import { BOOM_BEACH_ISLAND } from '../config/boomBeachLayout';
import { ASSET_CACHE_VERSION } from '../config/assetReplace';
import { useBase } from '../context/BaseContext';
import { useResources } from '../context/ResourceContext';

type Props = {
  buildMenuOpen?: boolean;
  onCloseBuildMenu?: () => void;
};

function islandImageSize(width: number, height: number) {
  const aspect = 16 / 9;
  const viewAspect = width / height;
  if (viewAspect > aspect) {
    const h = height;
    return { width: h * aspect, height: h };
  }
  const w = width;
  return { width: w, height: w / aspect };
}

function cellToIso(
  col: number,
  row: number,
  originLeft: number,
  originTop: number,
  tileW: number,
  tileH: number,
) {
  return {
    left: originLeft + (col - row) * (tileW / 2),
    top: originTop + (col + row) * (tileH / 2),
  };
}

export default function HomeBaseScreen({
  buildMenuOpen = false,
  onCloseBuildMenu,
}: Props) {
  const { buildings, placeBuilding, canPlaceAt, hqLevel } = useBase();
  const { spendResources, canAfford, addResources } = useResources();
  const [pendingSpec, setPendingSpec] = useState<BuildingSpec | null>(null);
  const [layout, setLayout] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const interval = setInterval(() => {
      buildings.forEach((b) => {
        const spec = BUILDING_CATALOG.find((s) => s.key === b.key);
        if (spec?.production) addResources(spec.production);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [addResources, buildings]);

  const gridMetrics = useMemo(() => {
    const img = islandImageSize(layout.width, layout.height);
    const tileW = img.width * BOOM_BEACH_ISLAND.tileScale;
    const tileH = tileW * 0.5;
    const gridW = (MEADOW_COLS + MEADOW_ROWS) * (tileW / 2);
    const originLeft = img.width * BOOM_BEACH_ISLAND.gridAnchorX - gridW * 0.48;
    const originTop = img.height * BOOM_BEACH_ISLAND.gridAnchorY;
    return { img, tileW, tileH, originLeft, originTop };
  }, [layout.height, layout.width]);

  const handleCellPress = useCallback(
    (col: number, row: number) => {
      if (!pendingSpec) return;
      if (hqLevel < pendingSpec.requiredHqLevel) {
        Alert.alert('Gesperrt', `HQ Stufe ${pendingSpec.requiredHqLevel} benötigt.`);
        return;
      }
      if (!canAfford(pendingSpec.cost)) {
        Alert.alert('Zu wenig Ressourcen', 'Sammle mehr Gold, Holz oder Stein.');
        return;
      }
      if (!canPlaceAt(pendingSpec.size, row, col)) {
        Alert.alert('Platz belegt', 'Wähle ein freies Feld auf der Wiese.');
        return;
      }
      if (!spendResources(pendingSpec.cost)) return;
      if (!placeBuilding(pendingSpec.key, row, col)) {
        Alert.alert('Fehler', 'Gebäude konnte nicht platziert werden.');
        return;
      }
      setPendingSpec(null);
    },
    [canAfford, canPlaceAt, hqLevel, pendingSpec, placeBuilding, spendResources],
  );

  const gridCells = useMemo(() => {
    const cells: React.ReactNode[] = [];
    const { originLeft, originTop, tileW, tileH } = gridMetrics;
    for (let row = 0; row < MEADOW_ROWS; row++) {
      for (let col = 0; col < MEADOW_COLS; col++) {
        const pos = cellToIso(col, row, originLeft, originTop, tileW, tileH);
        cells.push(
          <Pressable
            key={`cell-${col}-${row}`}
            style={[
              styles.cell,
              {
                left: pos.left,
                top: pos.top,
                width: tileW,
                height: tileH,
              },
              pendingSpec && styles.cellActive,
            ]}
            onPress={() => handleCellPress(col, row)}
          />,
        );
      }
    }
    return cells;
  }, [gridMetrics, handleCellPress, pendingSpec]);

  return (
    <View
      key={`home-bb-${ASSET_CACHE_VERSION}`}
      style={styles.root}
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
    >
      <BoomBeachIslandView>
        <View style={styles.gridOverlay} pointerEvents="box-none">
          {gridCells}
          {buildings.map((b) => {
            const size = b.size ?? 1;
            const { originLeft, originTop, tileW, tileH } = gridMetrics;
            const pos = cellToIso(b.col, b.row, originLeft, originTop, tileW, tileH);
            const scale = tileW / 52;
            return (
              <View
                key={b.id}
                style={{
                  position: 'absolute',
                  left: pos.left - 4 * scale,
                  top: pos.top - (size - 1) * tileH - 36 * scale,
                  zIndex: 10 + b.row + b.col,
                  transform: [{ scale }],
                }}
                pointerEvents="none"
              >
                <BuildingRenderer building={b} />
              </View>
            );
          })}
        </View>
      </BoomBeachIslandView>

      <View style={styles.hudTop} pointerEvents="box-none">
        <BoomBeachTopHUD />
        <BoomBeachResourceBar />
      </View>

      {pendingSpec && (
        <View style={styles.placementHint} pointerEvents="none">
          <Text style={styles.placementText}>Tippe die Wiese · {pendingSpec.name}</Text>
        </View>
      )}

      <BuildMenuModal
        visible={buildMenuOpen}
        onClose={() => {
          setPendingSpec(null);
          onCloseBuildMenu?.();
        }}
        onSelect={(spec) => setPendingSpec(spec)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1a6fa8' },
  gridOverlay: { ...StyleSheet.absoluteFillObject },
  cell: {
    position: 'absolute',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  cellActive: {
    backgroundColor: 'rgba(250,204,21,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(250,204,21,0.4)',
  },
  hudTop: {
    position: 'absolute',
    top: 6,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 30,
  },
  placementHint: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    left: '18%',
    right: '18%',
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 10,
    padding: 8,
    borderWidth: 2,
    borderColor: '#5eb0ff',
    zIndex: 25,
  },
  placementText: { color: '#fff', textAlign: 'center', fontSize: 10, fontWeight: '800' },
});
