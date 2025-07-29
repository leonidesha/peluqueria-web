import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./Dashboard.css";

// Tipado de la cita
interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: any; // Timestamp de Firestore
  duration: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  // Detectar si hay usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Simulamos que tenemos el nombre (en el futuro vendrá de Firestore)
        setUser({ name: "Nombre del Cliente" });
        loadAppointment(currentUser.uid);
      } else {
        // Si no está logueado, redirigir al login (por ahora mostramos mensaje)
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Cargar la próxima cita del usuario
  const loadAppointment = async (userId: string) => {
    try {
      const q = query(
        collection(db, "appointments"),
        where("userId", "==", userId),
        where("date", ">=", new Date()) // Solo citas futuras
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setAppointment({ id: doc.id, ...doc.data() } as Appointment);
      }
    } catch (error) {
      console.error("Error al cargar la cita:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h2>Peluquería Tal</h2>
        <button onClick={() => {}}>Cerrar sesión</button>
      </header>

      <main className="dashboard-main">
        {/* Bienvenida */}
        <h1>Hola, {user?.name || "Usuario"}</h1>

        {/* Próxima cita */}
        {loading ? (
          <p>Cargando...</p>
        ) : appointment ? (
          <section className="next-appointment">
            <h2>Tu próxima cita:</h2>
            <p>
              <strong>{appointment.service}</strong> el{" "}
              {appointment.date?.toDate().toLocaleDateString("es-ES")} a las{" "}
              {appointment.date?.toDate().getHours()}:
              {String(appointment.date?.toDate().getMinutes()).padStart(2, "0")}
            </p>
            <button className="btn-cancel">Cancelar cita</button>
          </section>
        ) : (
          <section className="no-appointment">
            <p>No tienes citas programadas</p>
            <button className="btn-primary">Reservar nueva cita</button>
          </section>
        )}
        {/* Chat con el local */}
        <button className="btn-whatsapp">Chat con el local (WhatsApp)</button>

        {/* Promociones (opcional) */}
        <section className="promotions">
          <h3>Productos en venta esta semana</h3>
          <ul>
            <li>Shampoo hidratante</li>
            <li>Aceite capilar premium</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
