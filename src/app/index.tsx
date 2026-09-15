import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/astorage")}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>CRUD con AsyncStorage</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/sqlite")}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>CRUD con SQLite</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF0F5", // fondo rosado muy pálido
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: "#F8B4D9", // rosa palo
    width: "100%",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10, // separación entre botones
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3, // sombra en Android
  },
  buttonText: {
    color: "#5A2A45", // texto oscuro que contrasta con el rosa
    fontSize: 16,
    fontWeight: "600",
  },
});