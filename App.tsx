import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Asset } from "expo-asset";
import { File } from "expo-file-system";
import {
  SQLiteProvider,
  useSQLiteContext,
  type SQLiteDatabase,
} from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ConfettiExplosion } from "react-native-confetti-explosion";
import "react-native-get-random-values";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

import * as SplashScreen from "expo-splash-screen";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { v4 as uuidv4 } from "uuid";
import { click, fruit } from "./drizzle/schema";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  fade: true,
});

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export function useDrizzle() {
  const db = useSQLiteContext();
  return useMemo(() => drizzle(db), [db]);
}

export default function App() {
  return (
    <SQLiteProvider
      databaseName="db.db"
      onInit={migrate}
      options={{ enableChangeListener: true }}
    >
      <Main />
    </SQLiteProvider>
  );
}

function Main() {
  const db = useDrizzle();

  const [confettis, setConfettis] = useState<{ key: number; emoji: string }[]>(
    [],
  );
  const removeConfetti = (key: number) => {
    setConfettis((c) => c.filter((c) => c.key !== key));
  };

  const [tick, setTick] = useState(0);
  const [clickCounts, setClickCounts] = useState<
    { id: string; count: number }[]
  >([]);

  useEffect(() => {
    const cs = db
      .select({
        id: fruit.id,
        count: sql<number>`cast(count(${click.id}) as int)`,
      })
      .from(fruit)
      .leftJoin(click, eq(fruit.id, click.on))
      .groupBy(fruit.id)
      .orderBy(fruit.id)
      .execute();
    cs.then((cs) => setClickCounts(cs));
  }, [tick]);

  useEffect(() => {
    if (clickCounts.length) {
      SplashScreen.hideAsync();
    }
  }, [clickCounts]);

  const onClick = async (on: string) => {
    await db.insert(click).values({
      id: uuidv4(),
      on,
    });
    setTick((t) => t + 1);
    setConfettis((c) => [...c, { key: tick, emoji: on }]);
  };

  const deleteClicks = async () => {
    await db.delete(click);
    setTick((t) => t + 1);
  };

  return (
    <View style={styles.container}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="70%">
            <Stop offset="0%" stopColor="#32134a" />
            <Stop offset="100%" stopColor="#040008" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>
      <Text style={styles.heading}>SQLite Example</Text>
      <ScrollView style={styles.listArea}>
        <View style={styles.sectionContainer}>
          {clickCounts.map(({ id, count }) => {
            return (
              <TouchableOpacity
                key={id}
                onPress={() => onClick(id)}
                style={styles.item}
              >
                <Text style={styles.itemEmoji}>{id}</Text>
                <Text style={styles.itemCount}>{count}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        key="deleteClicks"
        onPress={() => deleteClicks()}
        style={styles.deleteButton}
      >
        <Text style={[styles.deleteText]}>Delete Clicks</Text>
      </TouchableOpacity>

      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
        }}
      >
        {confettis.map(({ key, emoji }) => (
          <ConfettiExplosion
            key={key}
            emoji={emoji}
            emojiFrequency={1}
            pieceCount={2}
            pieceSize={96}
            onComplete={() => removeConfetti(key)}
          />
        ))}
      </View>
    </View>
  );
}

async function migrate(db: SQLiteDatabase) {
  const migrationsAsset = Asset.fromModule(
    require("./assets/db/migrations-client/01-initialize.sql"),
  );
  await migrationsAsset.downloadAsync();
  const migrations = await new File(migrationsAsset.localUri!).text();

  await db.execAsync(migrations);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#040008",
    flex: 1,
    paddingTop: 64,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  listArea: {
    backgroundColor: "transparent",
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: "transparent",
  },
  item: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  itemEmoji: {
    fontSize: 32,
    textAlign: "center",
  },
  itemCount: {
    fontSize: 24,
    color: "#fff",
    width: 32,
    textAlign: "right",
  },
  deleteButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
  },
});
