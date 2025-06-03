import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import A from "./A/A";
import B from "./B/B";
import C from "./C/C";
import { useState } from "react";

export default function Index() {
  const [active, setActive] = useState(0);
  return (
    <SafeAreaView>
      <ScrollView>
        <ScrollView horizontal={true}>
          <TouchableOpacity onPress={() => setActive(0)}>
            <Text
              style={{
                backgroundColor: "red",
                padding: 6,
                width: 50,
                textAlign: "center",
                margin: 4,
              }}
            >
              A
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive(1)}>
            <Text
              style={{
                backgroundColor: "red",
                padding: 6,
                width: 50,
                textAlign: "center",
                margin: 4,
              }}
            >
              B
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive(2)}>
            <Text
              style={{
                backgroundColor: "red",
                padding: 6,
                width: 50,
                textAlign: "center",
                margin: 4,
              }}
            >
              C
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {active === 0 && (
          <View>
            <A />
          </View>
        )}
        {active === 1 && (
          <View>
            <B />
          </View>
        )}
        {active === 2 && (
          <View>
            <C />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
