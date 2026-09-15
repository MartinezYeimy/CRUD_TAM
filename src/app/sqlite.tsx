import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SQLiteScreen() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null); // aca se guarda la conexión a la base de datos
  const [items, setItems] = useState<any[]>([]); // lista de items traídos de la tabla
  const [input, setInput] = useState(""); // texto del input
  const [editingId, setEditingId] = useState<number | null>(null); // estado de edición

  // Abrir base de datos y crear tabla
  useEffect(() => {
    const initDb = async () => {
      const database = await SQLite.openDatabaseAsync("crud.db"); // se abre (o crea) el archivo de la base de datos
      setDb(database);

      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        );
      `); // se crea la tabla si no existe aún

      loadItems(database); // se cargan los datos ya existentes
    };

    initDb();
  }, []);

  // Leer registros
  const loadItems = async (database?: SQLite.SQLiteDatabase) => {
    if (!database && !db) return;
    const activeDb = database || db!;
    const rows = await activeDb.getAllAsync("SELECT * FROM items;"); //trae todas las filas de la tabla
    setItems(rows);
  };

  // Insertar registro
  const addItem = async () => {
    if (!db || !input) return;
    await db.runAsync("INSERT INTO items (name) VALUES (?);", [input]); //se inserta un nuevo registro
    setInput("");
    loadItems();
  };

  // Guardar actualización
  const saveUpdate = async () => {
    if (!db || editingId === null) return;
    await db.runAsync("UPDATE items SET name=? WHERE id=?;", [input, editingId]); //se actualiza solo el registro con ese id
    setEditingId(null); // salir del modo edición
    setInput("");
    loadItems();
  };

  // Eliminar registro
  const deleteItem = async (id: number) => {
    if (!db) return;
    await db.runAsync("DELETE FROM items WHERE id=?;", [id]); //se borra solo el registro con ese id
    loadItems();
  };

  // Activar edición
  const startEditing = (id: number, name: string) => {
    setEditingId(id); // aca se marca cual id se edita
    setInput(name); // se muestra el texto en el campo
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingId(null);
    setInput("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD con SQLite</Text>

      {}
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder={editingId !== null ? "Editar item" : "Nuevo item"}
        placeholderTextColor="#B98BA3"
      />

      <View style={styles.mainButtonsRow}>
        {/* agrega o guarda segun lo seleccionado*/}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={editingId !== null ? saveUpdate : addItem}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryButtonText}>
            {editingId !== null ? "Guardar" : "Agregar"}
          </Text>
        </TouchableOpacity>

        {}
        {editingId !== null && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelEditing}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/*se muestra la lista de items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()} //se usa id como identificador de la fila
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <View style={styles.itemButtons}>
              {/* aca se activa la edición de este item */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEditing(item.id, item.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.smallButtonText}>Editar</Text>
              </TouchableOpacity>
              {/*se elimina item */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteItem(item.id)}
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