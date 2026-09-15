import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AsyncStorageScreen() {
  const [items, setItems] = useState<string[]>([]); // aca se guarda la lista de items
  const [input, setInput] = useState(""); // aca se guarda lo que se escribe en el input
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // aca se guarda el índice en edición (null = crear)

  // aca se cargan los datos al abrir la pantalla
  useEffect(() => {
    loadItems();
  }, []);

  // Leer registros
  const loadItems = async () => {
    try {
      const stored = await AsyncStorage.getItem("items"); // se lee lo guardado
      if (stored) {
        setItems(JSON.parse(stored)); //texto a array
      }
    } catch (err) {
      console.error("Error al leer datos", err);
    }
  };

  // Guardar registros
  const saveItems = async (newItems: string[]) => {
    try {
      await AsyncStorage.setItem("items", JSON.stringify(newItems)); //array a texto y se guarda
      setItems(newItems); //refresh
    } catch (err) {
      console.error("Error al guardar datos", err);
    }
  };

  // Insertar registro (Create)
  const addItem = () => {
    if (!input) return;
    const newItems = [...items, input]; // se agrega el item
    saveItems(newItems);
    setInput("");
  };

  // Guardar actualización (Update)
  const saveUpdate = (index: number) => {
    const newItems = [...items];
    newItems[index] = input; //se reemplaza el valor 
    saveItems(newItems);
    setEditingIndex(null); // aca se sale del modo edición
    setInput("");
  };

  // Eliminar registro (Delete)
  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index); //se elimina el item
    saveItems(newItems);
  };

  // Activar edición
  const startEditing = (index: number, name: string) => {
    setEditingIndex(index); // aca se marca qué posición se edita
    setInput(name); // aca se precarga el texto en el input
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingIndex(null); 
    setInput("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD con AsyncStorage</Text>

      {}
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder={editingIndex !== null ? "Editar item" : "Nuevo item"}
        placeholderTextColor="#B98BA3"
      />

      <View style={styles.mainButtonsRow}>
        {/* agrega o guarda segun lo seleccioando*/}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={editingIndex !== null ? () => saveUpdate(editingIndex) : addItem}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryButtonText}>
            {editingIndex !== null ? "Guardar" : "Agregar"}
          </Text>
        </TouchableOpacity>

        {}
        {editingIndex !== null && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelEditing}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/*se renderiza la lista de items */}
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()} //se usa el índice como key
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
            <View style={styles.itemButtons}>
              {/* aca se activa la edición de este item */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEditing(index, item)}
                activeOpacity={0.7}
              >
                <Text style={styles.smallButtonText}>Editar</Text>
              </TouchableOpacity>
              {/*se elimina item */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteItem(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.smallButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF0F5" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#5A2A45" },
  input: {
    borderWidth: 1,
    borderColor: "#F8B4D9",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    color: "#5A2A45",
  },
  mainButtonsRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: "#F8B4D9",
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#5A2A45",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F8B4D9",
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#B98BA3",
    fontSize: 16,
    fontWeight: "600",
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemText: {
    color: "#5A2A45",
    fontSize: 15,
    marginBottom: 10,
  },
  itemButtons: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#F8B4D9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#E97C9E",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  smallButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});